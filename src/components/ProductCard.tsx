/**
 * @file ProductCard.tsx
 * @description 데스크탑 3열, 태블릿 2열, 모바일 1열 제품 카드
 * 썸네일 사진, 제품명, 짧은 설명, 가격, "상세보기" 버튼 구성
 */

import React from 'react';
import { ChevronRight, FileCode2, Play } from 'lucide-react';
import { LanguageCode, Product } from '../types';
import { translations } from '../locales/translations';

interface ProductCardProps {
  product: Product;
  currentLang: LanguageCode;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currentLang, onSelect }) => {
  const t = translations[currentLang];

  // 다국어 번역 가져오기 (없으면 한국어 기본값 사용)
  const trans = product.translations?.[currentLang];
  const displayName = trans?.name || product.name;
  const displayShortDesc = trans?.shortDescription || product.shortDescription;

  // 가격 포맷팅 (원화 기준 또는 USD 등)
  const formattedPrice = new Intl.NumberFormat(
    currentLang === 'ko' ? 'ko-KR' : currentLang === 'ja' ? 'ja-JP' : 'en-US',
    {
      style: 'currency',
      currency: product.currency || 'KRW',
      maximumFractionDigits: 0,
    }
  ).format(product.price);

  const thumbnail = product.images?.[0] || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="flex flex-col bg-white rounded-xl border border-[#ebebe6] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group"
      id={`product-card-${product.id}`}
    >
      {/* 썸네일 사진 영역 */}
      <div 
        className="relative aspect-16/10 w-full bg-[#f4f4f0] overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={thumbnail}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />

        {/* 카테고리 뱃지 */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide shadow-xs ${
            product.category === 'WRO'
              ? 'bg-[#1a1a18] text-white'
              : 'bg-[#D85A30] text-white'
          }`}>
            <FileCode2 className="w-3.5 h-3.5" />
            {product.category === 'WRO' ? t.products.wroBadge : t.products.cospaceBadge}
          </span>
        </div>

        {/* 유튜브 영상 포함 표시 */}
        {product.youtubeUrl && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-full shadow-xs">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        )}
      </div>

      {/* 카드 텍스트 콘텐츠 */}
      <div className="flex flex-col flex-1 p-5">
        <h3 
          onClick={() => onSelect(product)}
          className="text-lg font-bold text-[#1a1a18] line-clamp-2 leading-snug mb-2 cursor-pointer hover:text-[#D85A30] transition-colors"
        >
          {displayName}
        </h3>

        <p className="text-sm text-[#666660] line-clamp-2 leading-relaxed mb-5 flex-1">
          {displayShortDesc}
        </p>

        {/* 하단 가격 & 상세보기 버튼 */}
        <div className="pt-4 border-t border-[#f0f0eb] flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-[#8e8e89] block font-medium">
              {t.products.priceLabel}
            </span>
            <span className="text-lg font-extrabold text-[#1a1a18]">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={() => onSelect(product)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#f4f4f0] hover:bg-[#D85A30] text-[#1a1a18] hover:text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <span>{t.products.viewDetails}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
