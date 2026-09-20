/**
 * @file Header.tsx
 * @description 상단 고정 헤더 (#1a1a18 어두운 배경) + 좌측 흰색 로고 + 우측 메뉴 + 언어 선택 드롭다운 + 유튜브 구독 버튼
 */

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Youtube, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, translations } from '../locales/translations';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentPage: 'home' | 'videos' | 'admin';
  onNavigate: (page: 'home' | 'videos' | 'admin', sectionId?: string) => void;
  youtubeChannelUrl: string;
  customLogoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentPage,
  onNavigate,
  youtubeChannelUrl,
  customLogoUrl,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang];
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: 'home' | 'videos' | 'admin', sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  };

  // 유튜브 구독 URL (채널 구독 확인 모달 파라미터 추가)
  const subscribeUrl = youtubeChannelUrl.includes('?')
    ? `${youtubeChannelUrl}&sub_confirmation=1`
    : `${youtubeChannelUrl}?sub_confirmation=1`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a1a18] text-white border-b border-[#2d2d2a] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* 좌측 로고: 클릭 시 홈으로 이동 */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group py-1"
          id="header-logo"
        >
          {customLogoUrl ? (
            <img 
              src={customLogoUrl} 
              alt="Store Logo" 
              className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <img 
              src="/logo.svg" 
              alt="Store Logo" 
              className="h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          )}
        </div>

        {/* 데스크탑 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'home'
                ? 'text-white bg-[#2d2d2a]'
                : 'text-[#d0d0cc] hover:text-white hover:bg-[#252523]'
            }`}
          >
            {t.nav.home}
          </button>

          <button
            onClick={() => handleNavClick('home', 'products-section')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#d0d0cc] hover:text-white hover:bg-[#252523] transition-colors"
          >
            {t.nav.products}
          </button>

          <button
            onClick={() => handleNavClick('videos')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'videos'
                ? 'text-white bg-[#2d2d2a]'
                : 'text-[#d0d0cc] hover:text-white hover:bg-[#252523]'
            }`}
          >
            {t.nav.videos}
          </button>

          <button
            onClick={() => handleNavClick('home', 'contact-section')}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#d0d0cc] hover:text-white hover:bg-[#252523] transition-colors"
          >
            {t.nav.contact}
          </button>
        </nav>

        {/* 우측 도구: 유튜브 구독 버튼 + 언어 선택 드롭다운 */}
        <div className="hidden md:flex items-center gap-3">
          {/* 유튜브 구독 버튼 */}
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="header-youtube-sub-btn"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#cc0000] text-white hover:bg-[#b00000] transition-colors shadow-sm"
          >
            <Youtube className="w-4 h-4" />
            <span>{t.nav.subscribe}</span>
          </a>

          {/* 언어 선택 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              id="language-selector-btn"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282825] hover:bg-[#333330] text-sm text-white transition-colors border border-[#383834]"
            >
              <Globe className="w-4 h-4 text-[#a3a39e]" />
              <span className="text-sm font-medium">{currentLangObj.flag} {currentLangObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#a3a39e]" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#232321] border border-[#383834] rounded-xl shadow-xl py-1 z-50 overflow-hidden">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                      currentLang === lang.code
                        ? 'bg-[#D85A30] text-white font-medium'
                        : 'text-[#e5e5e0] hover:bg-[#2e2e2a]'
                    }`}
                  >
                    <span>{lang.flag} {lang.name}</span>
                    {currentLang === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 관리자 바로가기 링크 */}
          <button
            onClick={() => handleNavClick('admin')}
            title="관리자 페이지"
            className={`p-2 rounded-lg text-sm transition-colors ${
              currentPage === 'admin'
                ? 'text-[#D85A30] bg-[#2d2d2a]'
                : 'text-[#8e8e89] hover:text-white hover:bg-[#252523]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        {/* 모바일 햄버거 메뉴 토글 버튼 */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-[#282825] transition-colors"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 모바일 확장 메뉴 드로어 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1f1f1d] border-b border-[#2d2d2a] px-4 pt-3 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-[#282825] text-white"
            >
              {t.nav.home}
            </button>
            <button
              onClick={() => handleNavClick('home', 'products-section')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-[#282825] text-white"
            >
              {t.nav.products}
            </button>
            <button
              onClick={() => handleNavClick('videos')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-[#282825] text-white"
            >
              {t.nav.videos}
            </button>
            <button
              onClick={() => handleNavClick('home', 'contact-section')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-[#282825] text-white"
            >
              {t.nav.contact}
            </button>
          </div>

          {/* 모바일 언어 선택 그리드 */}
          <div className="pt-2 border-t border-[#2d2d2a]">
            <p className="text-xs text-[#a3a39e] mb-2 font-medium">언어 선택 (Language)</p>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    currentLang === lang.code
                      ? 'bg-[#D85A30] text-white'
                      : 'bg-[#282825] text-[#d0d0cc]'
                  }`}
                >
                  <span>{lang.flag} {lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 모바일 유튜브 구독 & 관리자 버튼 */}
          <div className="pt-2 flex items-center gap-2">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold bg-[#cc0000] text-white"
            >
              <Youtube className="w-4 h-4" />
              <span>{t.nav.subscribe}</span>
            </a>
            <button
              onClick={() => handleNavClick('admin')}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-[#282825] text-white flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#D85A30]" />
              <span>{t.nav.admin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
