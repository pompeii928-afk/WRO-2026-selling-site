/**
 * @file VideosSection.tsx
 * @description 유튜브 채널 연동 영상 섹션 및 전용 페이지
 * - 실시간 Firestore 동기화된 비디오 목록 렌더링
 * - 영상 카테고리 필터링 탭 (ALL, WRO Senior, CoSpace Rescue 등)
 * - 인라인 플레이어 및 유튜브 원본 링크
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Youtube, Play, ExternalLink, Filter } from 'lucide-react';
import { LanguageCode, StoreSettings, VideoItem } from '../types';
import { translations } from '../locales/translations';
import { getYoutubeEmbedUrl } from '../utils/youtube';
import { DEFAULT_VIDEOS } from '../utils/storage';

interface VideosSectionProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  videos?: VideoItem[];
  isStandalonePage?: boolean;
}

export const VideosSection: React.FC<VideosSectionProps> = ({
  currentLang,
  settings,
  videos = DEFAULT_VIDEOS,
  isStandalonePage = false,
}) => {
  const videoList = useMemo(() => {
    return (videos && videos.length > 0) ? videos : DEFAULT_VIDEOS;
  }, [videos]);

  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('ALL');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(() => videoList[0] || null);

  // 비디오 목록이 외부에서 변경되었을 때 활성 비디오 갱신
  useEffect(() => {
    if (activeVideo) {
      const found = videoList.find((v) => v.id === activeVideo.id);
      if (found) {
        setActiveVideo(found);
      } else if (videoList.length > 0) {
        setActiveVideo(videoList[0]);
      }
    } else if (videoList.length > 0) {
      setActiveVideo(videoList[0]);
    }
  }, [videoList]);

  // 카테고리 목록 추출
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    if (settings.videoCategories && settings.videoCategories.length > 0) {
      settings.videoCategories.forEach((c) => set.add(c));
    }
    videoList.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [settings.videoCategories, videoList]);

  // 선택된 카테고리에 맞는 영상 필터링
  const filteredVideos = useMemo(() => {
    if (selectedVideoCategory === 'ALL') {
      return videoList;
    }
    return videoList.filter((v) => v.category === selectedVideoCategory);
  }, [videoList, selectedVideoCategory]);

  const t = translations[currentLang];
  const channelUrl = settings.youtubeChannelUrl || 'https://www.youtube.com/channel/UC_o1n4QCZyABlKCdxI7cFPA';
  const subscribeUrl = channelUrl.includes('?') ? `${channelUrl}&sub_confirmation=1` : `${channelUrl}?sub_confirmation=1`;

  return (
    <section className={`w-full ${isStandalonePage ? 'py-12 md:py-20' : 'py-16 md:py-24'} bg-[#fbfbfa] border-t border-[#ecece8]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 상단 섹션 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ffebee] text-[#cc0000] text-xs font-bold mb-3">
              <Youtube className="w-4 h-4" />
              <span>YOUTUBE CHANNEL</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1a18] tracking-tight">
              {t.videos.title}
            </h2>
            <p className="mt-2 text-base text-[#666660] max-w-2xl">
              {t.videos.subtitle}
            </p>
          </div>

          {/* 유튜브 구독 및 채널 링크 */}
          <div className="flex items-center gap-3">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="channel-subscribe-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#cc0000] hover:bg-[#b00000] text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
            >
              <Youtube className="w-4 h-4" />
              <span>{t.videos.subscribeBtn}</span>
            </a>

            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#f0f0eb] border border-[#deded8] text-[#1a1a18] text-sm font-semibold transition-colors"
            >
              <span>{t.videos.channelLink}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#888882]" />
            </a>
          </div>
        </div>

        {/* 영상 카테고리 필터 탭 */}
        {availableCategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            <div className="flex items-center gap-1 text-xs font-bold text-[#888882] mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>카테고리:</span>
            </div>
            <button
              onClick={() => setSelectedVideoCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedVideoCategory === 'ALL'
                  ? 'bg-[#1a1a18] text-white shadow-xs'
                  : 'bg-white text-[#666660] hover:bg-[#ebebe6] border border-[#e0e0db]'
              }`}
            >
              전체보기 ({videoList.length})
            </button>
            {availableCategories.map((cat) => {
              const count = videoList.filter((v) => v.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedVideoCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedVideoCategory === cat
                      ? 'bg-[#D85A30] text-white shadow-xs'
                      : 'bg-white text-[#666660] hover:bg-[#ebebe6] border border-[#e0e0db]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* 메인 비디오 플레이어 (인라인 재생) */}
        {activeVideo && (
          <div className="mb-12 bg-white rounded-2xl border border-[#ebebe6] overflow-hidden shadow-sm">
            <div className="relative aspect-16/9 w-full bg-black">
              <iframe
                src={getYoutubeEmbedUrl(activeVideo.youtubeId) || ''}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div>
                <span className="text-xs font-bold text-[#D85A30] uppercase tracking-wide bg-[#fef1ec] px-2.5 py-1 rounded-md mb-2 inline-block">
                  {activeVideo.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a1a18]">
                  {activeVideo.title}
                </h3>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f4f4f0] hover:bg-[#e8e8e3] text-[#1a1a18] text-sm font-medium transition-colors shrink-0"
              >
                <span>{t.videos.openOnYoutube}</span>
                <ExternalLink className="w-4 h-4 text-[#777770]" />
              </a>
            </div>
          </div>
        )}

        {/* 영상 그리드 목록 */}
        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#ebebe6]">
            <p className="text-[#888882] text-sm">해당 카테고리에 등록된 영상이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isSelected = activeVideo?.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }
                  }}
                  className={`flex flex-col bg-white rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer group ${
                    isSelected ? 'border-[#D85A30] ring-2 ring-[#D85A30]/20 shadow-md' : 'border-[#ebebe6] hover:border-[#deded8] hover:shadow-xs'
                  }`}
                >
                  {/* 썸네일 영역 */}
                  <div className="relative aspect-16/9 w-full bg-[#1a1a18] overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-black/70 group-hover:bg-[#cc0000] text-white flex items-center justify-center transition-all shadow-md group-hover:scale-110">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-white text-xs font-mono">
                        {video.duration}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                      {video.category}
                    </div>
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <h4 className="text-sm font-bold text-[#1a1a18] line-clamp-2 leading-snug group-hover:text-[#D85A30] transition-colors mb-3">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-[#8e8e89] font-medium pt-2 border-t border-[#f4f4f0]">
                      <span className="flex items-center gap-1 text-[#cc0000]">
                        <Youtube className="w-3.5 h-3.5" />
                        <span>YouTube</span>
                      </span>
                      <span className="text-[#D85A30] font-semibold group-hover:underline">
                        {t.videos.watchNow} →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
