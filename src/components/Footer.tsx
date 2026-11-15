/**
 * @file Footer.tsx
 * @description 하단 고정 푸터 (#1a1a18 어두운 배경)
 * 로고, 메뉴 링크, 유튜브 구독 버튼, 관리자 페이지 진입 링크
 */

import React from 'react';
import { Youtube, Mail, ArrowUp } from 'lucide-react';
import { LanguageCode, StoreSettings } from '../types';
import { translations } from '../locales/translations';
import { ui, localeFor } from '../locales/ui';
import { productText, heroText, videoTitle, categoryText } from '../locales/content';

interface FooterProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  onNavigate: (page: 'home' | 'videos' | 'admin', sectionId?: string) => void;
  customLogoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  settings,
  onNavigate,
  customLogoUrl,
}) => {
  const t = translations[currentLang];
  const channelUrl = settings.youtubeChannelUrl || 'https://www.youtube.com/channel/UC_o1n4QCZyABlKCdxI7cFPA';
  const subscribeUrl = channelUrl.includes('?') ? `${channelUrl}&sub_confirmation=1` : `${channelUrl}?sub_confirmation=1`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1a1a18] text-[#d0d0cc] border-t border-[#2d2d2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* 1열: 로고 & 소개 */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="inline-block cursor-pointer"
            >
              {customLogoUrl ? (
                <img src={customLogoUrl} alt={ui[currentLang].logo} className="h-9 md:h-10 max-w-full w-auto object-contain" />
              ) : (
                <img src="/logo.svg" alt={ui[currentLang].logo} className="h-9 md:h-10 max-w-full w-auto object-contain" />
              )}
            </div>
            <p className="text-sm text-[#a3a39e] max-w-sm leading-relaxed">
              {ui[currentLang].about}
            </p>
            <div className="pt-2">
              <a
                href={subscribeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#cc0000] text-white hover:bg-[#b00000] transition-colors"
              >
                <Youtube className="w-4 h-4" />
                <span>{t.nav.subscribe}</span>
              </a>
            </div>
          </div>

          {/* 2열: 바로가기 메뉴 */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">{ui[currentLang].navigation}</p>
            <ul className="space-y-2 text-sm text-[#a3a39e]">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('home', 'products-section')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('videos')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.videos}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('home', 'contact-section')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* 3열: 고객 안내 & 관리자 */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">{ui[currentLang].support}</p>
            <ul className="space-y-2 text-sm text-[#a3a39e]">
              <li className="flex items-center gap-2">
                <Mail className="shrink-0 w-3.5 h-3.5 text-[#D85A30]" />
                <span className="min-w-0 wrap-anywhere font-mono text-xs">{settings.adminEmail}</span>
              </li>

            </ul>
          </div>

        </div>

        {/* 하단 카피라이트 & 맨 위로 가기 버튼 */}
        <div className="pt-8 border-t border-[#2d2d2a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#70706a]">
          <p>© {new Date().getFullYear()} ROBO STORE. {ui[currentLang].copyright}</p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#a3a39e] hover:text-white transition-colors"
          >
            <span>{ui[currentLang].top}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
