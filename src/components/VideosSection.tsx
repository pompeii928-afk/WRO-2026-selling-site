/**
 * @file VideosSection.tsx
 * @description 유튜브 채널 연동 영상 섹션 및 전용 페이지
 * - 채널 최신 영상들을 썸네일 그리드로 보여주고, 클릭 시 사이트 내부 임베드 플레이어로 재생
 * - 유튜브 채널 구독 링크 및 바로가기 연동
 */

import React, { useState } from 'react';
import { Youtube, Play, ExternalLink, X } from 'lucide-react';
import { LanguageCode, StoreSettings, VideoItem } from '../types';
import { translations } from '../locales/translations';
import { getYoutubeEmbedUrl } from '../utils/youtube';

interface VideosSectionProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  isStandalonePage?: boolean;
}

// 기본 추천/대표 로봇 주행 및 튜토리얼 영상 목록
export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'WRO RoboMission Senior 2024 - 만점 주행 풀코스 데모 (Dual Color Sensor PID Run)',
    youtubeId: 'S2fFv3y29O8',
    category: 'WRO Senior',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    duration: '02:15',
  },
  {
    id: 'vid-2',
    title: 'WRO RoboMission Junior 2024 - 패시브 랙 앤 피니언 그리퍼 오브젝트 적재 테스트',
    youtubeId: 'b0bA3YxZvxA',
    category: 'WRO Junior',
    thumbnailUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80',
    duration: '01:45',
  },
  {
    id: 'vid-3',
    title: 'CoSpace Rescue Virtual Challenge - Dynamic A* 장애물 회피 시뮬레이션 데모',
    youtubeId: 'kYJvYg_V408',
    category: 'CoSpace Rescue',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    duration: '03:10',
  },
  {
    id: 'vid-4',
    title: 'LEGO Spike Prime 자이로 센서 누적 오차 보정(Gyro Drift) 및 라인트레이싱 튜토리얼',
    youtubeId: 'YQHsXMglC9A',
    category: 'Tutorial',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    duration: '05:32',
  },
  {
    id: 'vid-5',
    title: 'WRO 초고속 회전 모터 기어비 선정 및 토크 최적화 가이드',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'Engineering',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    duration: '04:18',
  },
  {
    id: 'vid-6',
    title: 'CoSpace Rescue 색상 감지 센서 캘리브레이션과 텔레포트 존 감지 기법',
    youtubeId: 'eVTXPUF4Oz4',
    category: 'CoSpace Rescue',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    duration: '03:40',
  },
];

export const VideosSection: React.FC<VideosSectionProps> = ({
  currentLang,
  settings,
  isStandalonePage = false,
}) => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(DEFAULT_VIDEOS[0]);
  const [isPlayingModal, setIsPlayingModal] = useState<boolean>(false);

  const t = translations[currentLang];
  const channelUrl = settings.youtubeChannelUrl || 'https://www.youtube.com/channel/UC_o1n4QCZyABlKCdxI7cFPA';
  const subscribeUrl = channelUrl.includes('?') ? `${channelUrl}&sub_confirmation=1` : `${channelUrl}?sub_confirmation=1`;

  return (
    <section className={`w-full ${isStandalonePage ? 'py-12 md:py-20' : 'py-16 md:py-24'} bg-[#fbfbfa] border-t border-[#ecece8]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 상단 섹션 헤더 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_VIDEOS.map((video) => {
            const isSelected = activeVideo?.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  // 모바일에서는 스크롤 이동
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

      </div>
    </section>
  );
};
