/**
 * @file types.ts
 * @description WRO 및 CoSpace Rescue 스토어의 핵심 데이터 타입 정의
 */

// 지원 언어 코드 타입
export type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'es';

// 제품 카테고리 (기본값 'WRO', 'CoSpace' 및 사용자가 등록/수정한 카테고리 문자열 지원)
export type ProductCategory = string;

// 제품 다국어 번역 필드
export interface ProductTranslation {
  name?: string;
  shortDescription?: string;
  description?: string;
  includedItems?: string[];
}

// 판매 제품 인터페이스
export interface Product {
  id: string;
  category: ProductCategory;
  name: string; // 기본 한국어 제품명
  price: number; // 가격 (원화 기준 또는 표시 화폐)
  currency: string; // 'KRW', 'USD' 등
  shortDescription: string; // 목록 카드에 표시될 한 줄 요약
  description: string; // 상세 페이지 본문 설명
  includedItems: string[]; // 포함된 항목 목록 (예: PDF 조립도, 파이썬 코드 등)
  images: string[]; // 제품 사진 URL/Base64 배열 (첫 번째 이미지가 대표 썸네일)
  youtubeUrl?: string; // 이 로봇의 주행 영상 유튜브 링크
  translations?: Partial<Record<LanguageCode, ProductTranslation>>; // 다국어 번역 데이터
  createdAt: string;
}

// 사이트 전역 설정 인터페이스
export interface StoreSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  adminEmail: string; // 결제 요청 메일을 받을 관리자 이메일
  youtubeChannelUrl: string; // 유튜브 채널 주소
  customLogoUrl?: string; // 사용자가 직접 업로드한 커스텀 로고
  categories: string[]; // 사이트의 모든 제품 카테고리 목록 (기본: ['WRO', 'CoSpace'])
  videoCategories?: string[]; // 사이트의 모든 영상 카테고리 목록 (기본: ['WRO Senior', 'WRO Junior', 'CoSpace Rescue', 'Tutorial', 'Engineering'])
  youtubeDisplayCategory: string; // 유튜브 채널이 노출될 카테고리 ('ALL' 또는 특정 카테고리명)
  showHeroSection: boolean; // 히어로 배너 섹션 표시 여부 (기본 false)
  translations?: Partial<Record<LanguageCode, {
    heroTitle?: string;
    heroSubtitle?: string;
    heroButtonText?: string;
  }>>;
}

// 유튜브 비디오 아이템 인터페이스
export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  category: string; // 영상 카테고리 (WRO Senior, CoSpace Rescue 등)
  thumbnailUrl: string;
  duration?: string;
  order?: number;
}
