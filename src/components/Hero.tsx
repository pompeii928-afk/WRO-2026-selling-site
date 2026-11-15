import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { LanguageCode, StoreSettings } from '../types';
import { heroText } from '../locales/content';
import { welcome } from '../locales/welcome';

interface HeroProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, settings, onExploreClick }) => {
  const {title, subtitle, buttonText} = heroText(settings, currentLang);
  const copy = welcome[currentLang];
  return <section id="welcome-section" className="welcome-hero relative isolate overflow-hidden border-b border-[#e5e2da] bg-[#f5f4ef]">
    <div aria-hidden="true" className="welcome-glow pointer-events-none absolute rounded-full"/>
    <svg aria-hidden="true" focusable="false" viewBox="699 705 1522 1156" className="welcome-watermark pointer-events-none absolute select-none">
      <image href="/channel-mark.png" width="2720" height="2720"/>
    </svg>
    <div className="relative max-w-7xl mx-auto px-5 sm:px-10 lg:px-8 pt-10 sm:pt-20 pb-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#6e6c64]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d35b31]"/>
        <span>K.F.C. ROBOTICS</span><span className="h-3 w-px bg-[#b7b4aa]"/><span>{copy.eyebrow}</span>
      </div>
      <div className="py-8 sm:py-12 lg:py-14 max-w-3xl">
        <h1 className="welcome-title text-[#1a1a18] font-extrabold tracking-[-0.055em] leading-[0.98] whitespace-pre-line wrap-anywhere">{title}</h1>
        <p className="mt-7 sm:mt-8 text-base sm:text-lg text-[#66645d] max-w-xl leading-relaxed whitespace-pre-line">{subtitle}</p>
        <button onClick={onExploreClick} id="hero-cta-btn" className="mt-8 sm:mt-9 inline-flex items-center gap-4 sm:gap-6 rounded-full bg-[#1a1a18] px-6 py-4 text-sm font-semibold text-white hover:bg-[#d35b31] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d35b31] transition-colors">
          {buttonText}<ArrowUpRight size={18}/>
        </button>
      </div>
      <div className="mt-5 pt-6 border-t border-[#d9d6cd] flex flex-wrap items-center justify-between gap-4 text-[11px] sm:text-xs text-[#737168]">
        <span className="font-semibold tracking-[0.1em]">WRO &amp; CoSpace Rescue</span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">{copy.labels.map(label=><span key={label}>{label}</span>)}</div>
        <ArrowDownRight size={20} aria-hidden="true" className="text-[#d35b31] hidden sm:block"/>
      </div>
    </div>
  </section>;
};
