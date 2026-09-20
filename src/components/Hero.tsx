/**
 * @file Hero.tsx
 * @description the15thfloor.com 스타일의 미니멀하면서 권위 있는 히어로 섹션
 * 큰 제목, 한 줄 설명, "제품 보러가기" 주황색 버튼(#D85A30) 및 특장점 뱃지
 */

import React from 'react';
import { ArrowDown, Cpu, FileText, PlayCircle } from 'lucide-react';
import { LanguageCode, StoreSettings } from '../types';
import { translations } from '../locales/translations';

interface HeroProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, settings, onExploreClick }) => {
  const t = translations[currentLang];

  // 커스텀 설정이 있으면 우선 사용하고 없으면 다국어 기본값 적용
  const title = (settings.translations?.[currentLang]?.heroTitle || settings.heroTitle || t.hero.title);
  const subtitle = (settings.translations?.[currentLang]?.heroSubtitle || settings.heroSubtitle || t.hero.subtitle);
  const buttonText = (settings.translations?.[currentLang]?.heroButtonText || settings.heroButtonText || t.hero.ctaButton);

  return (
    <section className="relative bg-white pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#ecece8] overflow-hidden">
      {/* 은은한 배경 기하학 패턴 */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 상단 뱃지 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f0] border border-[#e2e2dc] text-xs font-semibold text-[#5a5a54] mb-8 tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#D85A30] animate-pulse" />
          <span>{t.hero.badge}</span>
        </div>

        {/* 메인 헤드라인: 높은 대비, 가독성 높은 디스플레이 타이포그래피 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#1a1a18] tracking-tight leading-[1.18] whitespace-pre-line mb-6 font-['Pretendard']">
          {title}
        </h1>

        {/* 서브 카피: 65~75자 최적 가독성 폭 */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#555550] leading-relaxed mb-10 font-normal">
          {subtitle}
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExploreClick}
            id="hero-cta-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-base font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* 핵심 가치 3요소 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9f9f7] border border-[#ebebe6] transition-colors hover:border-[#deded8]">
            <div className="p-2.5 rounded-lg bg-[#ffffff] text-[#D85A30] shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#70706a] font-medium">STEP 1</p>
              <p className="text-sm font-bold text-[#1a1a18]">{t.hero.feature1}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9f9f7] border border-[#ebebe6] transition-colors hover:border-[#deded8]">
            <div className="p-2.5 rounded-lg bg-[#ffffff] text-[#D85A30] shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#70706a] font-medium">STEP 2</p>
              <p className="text-sm font-bold text-[#1a1a18]">{t.hero.feature2}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9f9f7] border border-[#ebebe6] transition-colors hover:border-[#deded8]">
            <div className="p-2.5 rounded-lg bg-[#ffffff] text-[#D85A30] shadow-xs">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[#70706a] font-medium">STEP 3</p>
              <p className="text-sm font-bold text-[#1a1a18]">{t.hero.feature3}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
