/**
 * @file VideoManagementSection.tsx
 * @description 관리자 페이지 내 유튜브 영상 및 영상 카테고리 관리 컴포넌트
 * - 영상 카테고리 즉시 변경 및 신규 카테고리 추가/수정/삭제
 * - 영상 등록/수정/삭제 및 Firebase Firestore 실시간 연동
 */

import React, { useState } from 'react';
import {
  Youtube,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Play,
  Check,
  AlertCircle,
  Clock,
  Tag,
  Save,
  X
} from 'lucide-react';
import { VideoItem, StoreSettings } from '../../types';
import {
  saveVideoToCloud,
  deleteVideoFromCloud,
  saveSettingsToCloud,
  DEFAULT_VIDEO_CATEGORIES
} from '../../utils/storage';
import { extractYoutubeId } from '../../utils/youtube';

interface VideoManagementSectionProps {
  videos: VideoItem[];
  settings: StoreSettings;
  onVideosChange: (updatedVideos: VideoItem[]) => void;
  onSettingsChange: (updatedSettings: StoreSettings) => void;
  showFeedback: (msg: string) => void;
}

export const VideoManagementSection: React.FC<VideoManagementSectionProps> = ({
  videos,
  settings,
  onVideosChange,
  onSettingsChange,
  showFeedback,
}) => {
  // 사용 가능한 영상 카테고리 목록
  const videoCategories = settings.videoCategories && settings.videoCategories.length > 0
    ? settings.videoCategories
    : DEFAULT_VIDEO_CATEGORIES;

  // 카테고리 추가/편집 상태
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');

  // 비디오 추가/편집 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalYoutubeUrl, setModalYoutubeUrl] = useState('');
  const [modalCategory, setModalCategory] = useState('');
  const [modalCustomCategory, setModalCustomCategory] = useState('');
  const [modalDuration, setModalDuration] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 1. 영상 카테고리 추가
  const handleAddVideoCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      alert('영상 카테고리 이름을 입력해주세요.');
      return;
    }
    if (videoCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('이미 존재하는 영상 카테고리입니다.');
      return;
    }

    const updatedCategories = [...videoCategories, trimmed];
    const updatedSettings: StoreSettings = {
      ...settings,
      videoCategories: updatedCategories,
    };

    onSettingsChange(updatedSettings);
    setNewCategoryName('');

    try {
      await saveSettingsToCloud(updatedSettings);
      showFeedback(`새 영상 카테고리 "${trimmed}"이(가) Firebase에 등록되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('Firebase 저장 실패: ' + err);
    }
  };

  // 2. 영상 카테고리 이름 수정 (해당 카테고리를 쓰던 영상들도 일괄 자동 업데이트)
  const handleSaveEditCategory = async (oldCategory: string) => {
    const trimmed = editingCategoryValue.trim();
    if (!trimmed) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    if (trimmed === oldCategory) {
      setEditingCategoryIndex(null);
      return;
    }
    if (videoCategories.some((c, i) => i !== editingCategoryIndex && c.toLowerCase() === trimmed.toLowerCase())) {
      alert('이미 존재하는 다른 카테고리 이름입니다.');
      return;
    }

    const updatedCategories = videoCategories.map((c) => (c === oldCategory ? trimmed : c));
    const updatedSettings: StoreSettings = {
      ...settings,
      videoCategories: updatedCategories,
    };

    // 해당 카테고리를 쓰던 영상들의 category 필드도 일괄 변경
    const updatedVideos = videos.map((v) => {
      if (v.category === oldCategory) {
        return { ...v, category: trimmed };
      }
      return v;
    });

    onSettingsChange(updatedSettings);
    onVideosChange(updatedVideos);
    setEditingCategoryIndex(null);

    try {
      await saveSettingsToCloud(updatedSettings);
      // 변경된 영상들 Firestore에 반영
      for (const v of updatedVideos) {
        if (v.category === trimmed) {
          await saveVideoToCloud(v);
        }
      }
      showFeedback(`영상 카테고리가 "${trimmed}"(으)로 변경 및 Firebase에 동기화되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('Firebase 업데이트 중 오류가 발생했습니다.');
    }
  };

  // 3. 영상 카테고리 삭제
  const handleDeleteCategory = async (catToDelete: string) => {
    if (videoCategories.length <= 1) {
      alert('최소 1개 이상의 영상 카테고리가 필요합니다.');
      return;
    }

    const attachedCount = videos.filter((v) => v.category === catToDelete).length;
    let msg = `"${catToDelete}" 영상 카테고리를 정말 삭제하시겠습니까?`;
    if (attachedCount > 0) {
      msg += `\n\n[안내] 이 카테고리를 사용 중인 영상이 ${attachedCount}개 있습니다. 삭제 시 기본 카테고리로 변경됩니다.`;
    }

    if (!window.confirm(msg)) return;

    const remainingCategories = videoCategories.filter((c) => c !== catToDelete);
    const fallbackCategory = remainingCategories[0];

    const updatedSettings: StoreSettings = {
      ...settings,
      videoCategories: remainingCategories,
    };

    const updatedVideos = videos.map((v) => {
      if (v.category === catToDelete) {
        return { ...v, category: fallbackCategory };
      }
      return v;
    });

    onSettingsChange(updatedSettings);
    onVideosChange(updatedVideos);

    try {
      await saveSettingsToCloud(updatedSettings);
      for (const v of updatedVideos) {
        if (v.category === fallbackCategory) {
          await saveVideoToCloud(v);
        }
      }
      showFeedback(`"${catToDelete}" 영상 카테고리가 삭제되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('Firebase 저장 오류: ' + err);
    }
  };

  // 4. 특정 영상의 카테고리를 즉시 변경 (카드 인라인 선택)
  const handleQuickChangeVideoCategory = async (videoId: string, newCategory: string) => {
    const target = videos.find((v) => v.id === videoId);
    if (!target) return;

    if (target.category === newCategory) return;

    const updatedVideo: VideoItem = {
      ...target,
      category: newCategory,
    };

    const updatedList = videos.map((v) => (v.id === videoId ? updatedVideo : v));
    onVideosChange(updatedList);

    try {
      await saveVideoToCloud(updatedVideo);
      showFeedback(`"${target.title.slice(0, 18)}..." 영상의 카테고리가 "${newCategory}"(으)로 즉시 변경되었습니다!`);
    } catch (err) {
      console.error(err);
      alert('Firebase 저장 실패: ' + err);
    }
  };

  // 5. 모달 열기: 영상 추가
  const handleOpenAddModal = () => {
    setEditingVideoId(null);
    setModalTitle('');
    setModalYoutubeUrl('');
    setModalCategory(videoCategories[0] || 'WRO Senior');
    setModalCustomCategory('');
    setModalDuration('03:00');
    setIsModalOpen(true);
  };

  // 6. 모달 열기: 영상 수정
  const handleOpenEditModal = (v: VideoItem) => {
    setEditingVideoId(v.id);
    setModalTitle(v.title);
    setModalYoutubeUrl(`https://www.youtube.com/watch?v=${v.youtubeId}`);
    if (videoCategories.includes(v.category)) {
      setModalCategory(v.category);
      setModalCustomCategory('');
    } else {
      setModalCategory('__CUSTOM__');
      setModalCustomCategory(v.category);
    }
    setModalDuration(v.duration || '02:30');
    setIsModalOpen(true);
  };

  // 7. 모달 저장: 영상 등록 또는 수정
  const handleSaveVideoModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      alert('영상 제목을 입력해주세요.');
      return;
    }

    const yId = extractYoutubeId(modalYoutubeUrl);
    if (!yId) {
      alert('올바른 유튜브 링크를 입력해주세요. (예: https://www.youtube.com/watch?v=...)');
      return;
    }

    let finalCategory = modalCategory;
    if (modalCategory === '__CUSTOM__') {
      finalCategory = modalCustomCategory.trim();
      if (!finalCategory) {
        alert('새 카테고리 이름을 입력해주세요.');
        return;
      }
      // 신규 카테고리면 settings.videoCategories 에도 추가
      if (!videoCategories.includes(finalCategory)) {
        const updatedCats = [...videoCategories, finalCategory];
        const newSettings = { ...settings, videoCategories: updatedCats };
        onSettingsChange(newSettings);
        saveSettingsToCloud(newSettings).catch(console.error);
      }
    }

    setIsSaving(true);
    try {
      const thumbnailUrl = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;

      let targetVideo: VideoItem;
      let updatedList: VideoItem[];

      if (editingVideoId) {
        const prev = videos.find((v) => v.id === editingVideoId);
        targetVideo = {
          ...prev!,
          id: editingVideoId,
          title: modalTitle.trim(),
          youtubeId: yId,
          category: finalCategory,
          thumbnailUrl,
          duration: modalDuration.trim() || '02:00',
        };
        updatedList = videos.map((v) => (v.id === editingVideoId ? targetVideo : v));
      } else {
        targetVideo = {
          id: `vid-${Date.now()}`,
          title: modalTitle.trim(),
          youtubeId: yId,
          category: finalCategory,
          thumbnailUrl,
          duration: modalDuration.trim() || '02:00',
          order: videos.length + 1,
        };
        updatedList = [...videos, targetVideo];
      }

      onVideosChange(updatedList);
      await saveVideoToCloud(targetVideo);

      showFeedback(editingVideoId ? '영상이 성공적으로 수정 및 Firebase에 반영되었습니다.' : '새 영상이 등록되었습니다.');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Firebase 저장 오류: ' + err);
    } finally {
      setIsSaving(false);
    }
  };

  // 8. 영상 삭제
  const handleDeleteVideo = async (video: VideoItem) => {
    if (!window.confirm(`[확인] "${video.title}" 영상을 정말 삭제하시겠습니까?`)) {
      return;
    }

    const updatedList = videos.filter((v) => v.id !== video.id);
    onVideosChange(updatedList);

    try {
      await deleteVideoFromCloud(video.id);
      showFeedback(`"${video.title.slice(0, 15)}..." 영상이 삭제되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('영상 삭제 중 오류가 발생했습니다: ' + err);
    }
  };

  const previewYoutubeId = extractYoutubeId(modalYoutubeUrl);

  return (
    <div className="space-y-8">
      
      {/* ==================================================== */}
      {/* 1. 영상 카테고리 관리 카드 */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#f4f4f0]">
          <div>
            <h3 className="text-lg font-bold text-[#1a1a18] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#D85A30]" />
              <span>유튜브 영상 카테고리 관리</span>
            </h3>
            <p className="text-xs text-[#70706a] mt-0.5">
              영상 분류에 사용될 카테고리 목록입니다. 여기서 카테고리를 추가하거나 이름을 변경하면 해당 영상을 포함해 Firebase에 실시간 즉시 반영됩니다.
            </p>
          </div>
        </div>

        {/* 새 영상 카테고리 추가 폼 */}
        <form onSubmit={handleAddVideoCategory} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="새 영상 카테고리 이름 입력 (예: WRO RoboMission, MicroPython 강좌)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30] focus:bg-white"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a1a18] hover:bg-[#33332f] text-white text-sm font-bold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>카테고리 추가</span>
          </button>
        </form>

        {/* 등록된 카테고리 목록 칩 및 수정/삭제 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {videoCategories.map((cat, index) => {
            const count = videos.filter((v) => v.category === cat).length;
            const isEditing = editingCategoryIndex === index;

            return (
              <div
                key={cat}
                className="p-3 rounded-xl border border-[#ecece8] bg-[#fbfbfa] flex items-center justify-between gap-2"
              >
                {isEditing ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editingCategoryValue}
                      onChange={(e) => setEditingCategoryValue(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-[#D85A30] bg-white text-[#1a1a18] outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditCategory(cat)}
                      className="px-2.5 py-1 rounded-lg bg-[#D85A30] text-white text-xs font-bold hover:bg-[#c04e28] cursor-pointer"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategoryIndex(null)}
                      className="px-2 py-1 rounded-lg bg-white border border-[#deded8] text-xs font-bold text-[#666] hover:bg-gray-100 cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs font-bold text-[#1a1a18] truncate">{cat}</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-[#ebebe6] text-[#555] font-semibold">
                        {count}개
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryIndex(index);
                          setEditingCategoryValue(cat);
                        }}
                        className="p-1 rounded-md text-[#70706a] hover:bg-[#ebebe6] hover:text-[#1a1a18] cursor-pointer"
                        title="카테고리명 수정"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="p-1 rounded-md text-red-500 hover:bg-red-50 cursor-pointer"
                        title="카테고리 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. 등록된 영상 목록 및 인라인 카테고리 변경 */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f4f4f0]">
          <div>
            <h3 className="text-lg font-bold text-[#1a1a18] flex items-center gap-2">
              <Youtube className="w-5 h-5 text-[#cc0000]" />
              <span>등록된 유튜브 영상 목록 ({videos.length}개)</span>
            </h3>
            <p className="text-xs text-[#70706a] mt-0.5">
              각 영상 카드에서 바로 <strong className="text-[#D85A30] font-bold">영상 카테고리를 변경</strong>할 수 있으며, 변경 즉시 Firebase 클라우드에 영구 저장되어 사이트에 실시간 반영됩니다.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#cc0000] hover:bg-[#b00000] text-white text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>새 유튜브 영상 등록</span>
          </button>
        </div>

        {/* 영상 그리드 목록 */}
        {videos.length === 0 ? (
          <div className="p-12 text-center bg-[#fbfbfa] rounded-xl border border-dashed border-[#deded8]">
            <Youtube className="w-10 h-10 text-[#a8a8a2] mx-auto mb-2" />
            <p className="text-sm text-[#70706a]">등록된 영상이 없습니다. 새 영상을 등록해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-[#ebebe6] overflow-hidden shadow-xs hover:border-[#deded8] flex flex-col justify-between transition-all"
              >
                <div>
                  {/* 영상 썸네일 */}
                  <div className="relative aspect-16/9 w-full bg-[#1a1a18] overflow-hidden group">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#cc0000] text-white flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* 본문 정보 */}
                  <div className="p-4 space-y-3">
                    <h4 className="text-sm font-bold text-[#1a1a18] line-clamp-2 leading-snug">
                      {video.title}
                    </h4>

                    {/* [핵심 기능] 영상 카테고리 즉시 변경 드롭다운 */}
                    <div className="p-2.5 rounded-lg bg-[#fef7f4] border border-[#fae2d8]">
                      <label className="block text-[11px] font-bold text-[#D85A30] mb-1 flex items-center justify-between">
                        <span>🏷️ 영상 카테고리 즉시 변경</span>
                        <span className="text-[10px] text-emerald-600 font-bold">실시간 저장</span>
                      </label>
                      <select
                        value={video.category}
                        onChange={(e) => handleQuickChangeVideoCategory(video.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-md border border-[#f0c2b0] bg-white text-xs font-bold text-[#1a1a18] outline-none focus:border-[#D85A30] cursor-pointer"
                      >
                        {videoCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="p-4 pt-0 border-t border-[#f4f4f0] flex items-center justify-between gap-2 mt-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#888] hover:text-[#1a1a18]"
                  >
                    <span>유튜브 확인</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(video)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#deded8] bg-white hover:bg-[#f0f0eb] text-xs font-bold text-[#333] cursor-pointer"
                    >
                      <Edit className="w-3 h-3 text-[#777]" />
                      <span>수정</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(video)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. 영상 등록/수정 모달 */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#ebebe6] my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f0f0eb]">
              <h3 className="text-lg font-bold text-[#1a1a18] flex items-center gap-2">
                <Youtube className="w-5 h-5 text-[#cc0000]" />
                <span>{editingVideoId ? '유튜브 영상 정보 수정' : '새 유튜브 영상 등록'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#888] hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoModal} className="space-y-4">
              {/* 영상 제목 */}
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">
                  영상 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="예: WRO 2024 시니어 만점 자율주행 데모"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                />
              </div>

              {/* 유튜브 URL */}
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">
                  유튜브 영상 주소 (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={modalYoutubeUrl}
                  onChange={(e) => setModalYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                />
                <p className="text-[11px] text-[#888] mt-1">
                  유튜브 영상 링크 또는 단축 링크(youtu.be)를 붙여넣으시면 썸네일과 영상 ID가 자동으로 추출됩니다.
                </p>
              </div>

              {/* 실시간 썸네일 미리보기 */}
              {previewYoutubeId && (
                <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e8e8e4]">
                  <p className="text-[11px] font-bold text-[#555] mb-2">자동 감지된 영상 미리보기:</p>
                  <div className="aspect-16/9 rounded-lg overflow-hidden relative bg-black max-w-xs mx-auto">
                    <img
                      src={`https://img.youtube.com/vi/${previewYoutubeId}/hqdefault.jpg`}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#cc0000] text-white flex items-center justify-center">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 영상 카테고리 선택 */}
              <div className="p-3.5 rounded-xl bg-[#fef8f5] border border-[#fbd4c2]">
                <label className="block text-xs font-bold text-[#D85A30] mb-1">
                  영상 카테고리 지정 *
                </label>
                <select
                  value={modalCategory}
                  onChange={(e) => setModalCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#f0c2b0] bg-white text-sm font-bold text-[#1a1a18] outline-none focus:border-[#D85A30] cursor-pointer mb-2"
                >
                  {videoCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__CUSTOM__">➕ 새 카테고리 직접 입력...</option>
                </select>

                {modalCategory === '__CUSTOM__' && (
                  <input
                    type="text"
                    value={modalCustomCategory}
                    onChange={(e) => setModalCustomCategory(e.target.value)}
                    placeholder="새로운 영상 카테고리명 입력"
                    className="w-full px-3 py-2 rounded-lg border border-[#D85A30] bg-white text-xs font-bold text-[#1a1a18] outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 재생 시간 */}
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#888]" />
                  <span>영상 재생 시간 (선택)</span>
                </label>
                <input
                  type="text"
                  value={modalDuration}
                  onChange={(e) => setModalDuration(e.target.value)}
                  placeholder="예: 02:45"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                />
              </div>

              {/* 모달 버튼 */}
              <div className="pt-4 border-t border-[#f0f0eb] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#deded8] text-sm font-bold text-[#666] hover:bg-gray-100 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] disabled:opacity-50 text-white text-sm font-bold shadow-xs cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Firebase 저장 중...' : '클라우드에 즉시 저장'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
