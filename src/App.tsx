/**
 * @file App.tsx
 * @description WRO 로봇 조립도·소스코드 및 CoSpace Rescue 소스코드 전문 판매 웹사이트 메인 애플리케이션
 * - the15thfloor.com 스타일의 정제된 레이아웃 및 Pretendard 타이포그래피
 * - 상단 고정 헤더 (#1a1a18) + 좌측 흰색 로고 + 우측 메뉴 + 언어 드롭다운
 * - 제품 그리드 (데스크탑 3열, 태블릿 2열, 모바일 1열)
 * - 제품 상세 모달 (사진 슬라이드 갤러리, 포함 내용 목록, 유튜브 주행 영상 임베드, Gmail 자동 작성 결제 요청)
 * - /admin 관리자 페이지 (비밀번호 보안 로그인, 제품/사진/설정/유튜브/다국어 관리)
 * - 브라우저 언어 자동 감지 및 5개 국어 전환 (ko, en, ja, zh, es)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { LanguageCode, Product, StoreSettings, ProductCategory } from './types';
import { translations } from './locales/translations';
import { loadProducts, loadSettings } from './utils/storage';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VideosSection } from './components/VideosSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPage } from './components/AdminPage';

// 브라우저 기본 언어 감지 헬퍼
function detectInitialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'ko';
  
  // 1. 기존 저장된 사용자 선택 언어 확인
  const saved = localStorage.getItem('ROBO_STORE_LANGUAGE') as LanguageCode;
  if (saved && ['ko', 'en', 'ja', 'zh', 'es'].includes(saved)) {
    return saved;
  }

  // 2. 브라우저 언어 감지
  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('es')) return 'es';
  return 'en'; // 기본 영문 (글로벌 사용자)
}

export default function App() {
  // 언어 상태
  const [currentLang, setCurrentLang] = useState<LanguageCode>(detectInitialLanguage);

  // 현재 페이지 라우트 상태 ('home' | 'videos' | 'admin')
  const [currentPage, setCurrentPage] = useState<'home' | 'videos' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
        return 'admin';
      }
    }
    return 'home';
  });

  // 데이터 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(loadSettings);

  // 카테고리 필터 상태 ('ALL' | 'WRO' | 'CoSpace')
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');

  // 제품 상세 모달 상태
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // 언어 번역 사전
  const t = translations[currentLang];

  // 초기 데이터 로드 및 브라우저 URL 동기화
  useEffect(() => {
    setProducts(loadProducts());
    setSettings(loadSettings());

    // 브라우저 뒤로가기/앞으로가기 popstate 이벤트 감지
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 언어 변경 핸들러
  const handleLanguageChange = (newLang: LanguageCode) => {
    setCurrentLang(newLang);
    localStorage.setItem('ROBO_STORE_LANGUAGE', newLang);
  };

  // 페이지 이동 핸들러
  const handleNavigate = (page: 'home' | 'videos' | 'admin', sectionId?: string) => {
    setCurrentPage(page);
    
    // URL 히스토리 업데이트
    if (typeof window !== 'undefined') {
      if (page === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else {
        window.history.pushState(null, '', '/');
      }
    }

    // 섹션 스크롤 이동
    if (sectionId && page === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 관리자 모드에서 데이터 수정 시 새로고침
  const handleDataChange = () => {
    setProducts(loadProducts());
    setSettings(loadSettings());
  };

  // 카테고리별 필터링된 제품 목록
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'ALL') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  // 관리자 페이지가 활성화된 경우 관리자 콘솔 렌더링
  if (currentPage === 'admin') {
    return (
      <AdminPage
        currentLang={currentLang}
        onExit={() => handleNavigate('home')}
        onDataChange={handleDataChange}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a18]">
      
      {/* 상단 고정 헤더 (#1a1a18 어두운 배경 + 좌측 흰색 로고 + 우측 메뉴 + 언어 드롭다운) */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        youtubeChannelUrl={settings.youtubeChannelUrl}
        customLogoUrl={settings.customLogoUrl}
      />

      {/* 홈 화면 메인 콘텐츠 */}
      {currentPage === 'home' && (
        <main className="flex-1">
          {/* [0. 참고 디자인] 히어로 섹션 */}
          <Hero
            currentLang={currentLang}
            settings={settings}
            onExploreClick={() => {
              const el = document.getElementById('products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* [2. 판매 제품] 제품 그리드 섹션 */}
          <section id="products-section" className="py-16 md:py-24 bg-white scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* 섹션 제목 및 카테고리 탭 */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1a18] tracking-tight">
                    {t.products.title}
                  </h2>
                  <p className="mt-2 text-base text-[#666660]">
                    {t.products.subtitle}
                  </p>
                </div>

                {/* 카테고리 분류 필터: 전체, WRO, CoSpace */}
                <div className="flex items-center gap-2 bg-[#f4f4f0] p-1.5 rounded-xl self-start md:self-auto">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === 'ALL'
                        ? 'bg-[#1a1a18] text-white shadow-xs'
                        : 'text-[#666660] hover:text-[#1a1a18]'
                    }`}
                  >
                    {t.products.all} ({products.length})
                  </button>

                  <button
                    onClick={() => setSelectedCategory('WRO')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === 'WRO'
                        ? 'bg-[#1a1a18] text-white shadow-xs'
                        : 'text-[#666660] hover:text-[#1a1a18]'
                    }`}
                  >
                    {t.products.wro}
                  </button>

                  <button
                    onClick={() => setSelectedCategory('CoSpace')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === 'CoSpace'
                        ? 'bg-[#D85A30] text-white shadow-xs'
                        : 'text-[#666660] hover:text-[#1a1a18]'
                    }`}
                  >
                    {t.products.cospace}
                  </button>
                </div>
              </div>

              {/* 제품 그리드: 데스크탑 3열, 태블릿 2열, 모바일 1열 */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currentLang={currentLang}
                      onSelect={(prod) => setSelectedProduct(prod)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-[#fbfbfa] rounded-2xl border border-dashed border-[#deded8]">
                  <p className="text-base text-[#8e8e89] font-medium">
                    해당 카테고리에 등록된 제품이 없습니다.
                  </p>
                </div>
              )}

            </div>
          </section>

          {/* [4. 유튜브 연동] 홈 화면 추천 영상 섹션 */}
          <VideosSection
            currentLang={currentLang}
            settings={settings}
            isStandalonePage={false}
          />

          {/* 구매 및 기술 문의 섹션 */}
          <ContactSection
            currentLang={currentLang}
            settings={settings}
          />
        </main>
      )}

      {/* [4. 유튜브 연동] 별도 "영상" 전용 페이지 */}
      {currentPage === 'videos' && (
        <main className="flex-1">
          <VideosSection
            currentLang={currentLang}
            settings={settings}
            isStandalonePage={true}
          />
        </main>
      )}

      {/* 하단 고정 푸터 */}
      <Footer
        currentLang={currentLang}
        settings={settings}
        onNavigate={handleNavigate}
        customLogoUrl={settings.customLogoUrl}
      />

      {/* [0. 참고 디자인] 제품 상세 모달 (사진 슬라이더, 설명, 포함 내용, 유튜브 주행 영상, Gmail 결제 요청) */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          currentLang={currentLang}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}
