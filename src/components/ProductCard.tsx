/**
 * @file ProductCard.tsx
 * @description 데스크탑 3열, 태블릿 2열, 모바일 1열 제품 카드
 * 썸네일 사진, 제품명, 짧은 설명, 가격, "상세보기" 버튼 구성
 */

import React from 'react';
import { ChevronRight, FileCode2, Play } from 'lucide-react';
import { LanguageCode, Product } from '../types';
import { translations } from '../locales/translations';
import { ui, localeFor } from '../locales/ui';
import { productText, heroText, videoTitle, categoryText } from '../locales/content';

interface ProductCardProps {
  product: Product;
  currentLang: LanguageCode;
  onSelect: (product: Product) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currentLang, onSelect, featured = false }) => {
  const t = translations[currentLang];

  // 다국어 번역 가져오기 (없으면 한국어 기본값 사용)
  const {name: displayName, shortDescription: displayShortDesc} = productText(product, currentLang);

  // 가격 포맷팅 (원화 기준 또는 USD 등)
  const formattedPrice = new Intl.NumberFormat(
    localeFor[currentLang],
    {
      style: 'currency',
      currency: product.currency || 'KRW',
      maximumFractionDigits: 0,
    }
  ).format(product.price);

  const thumbnail = product.images?.[0] || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className={`boutique-product ${featured ? 'boutique-product-featured' : ''} min-w-0 group`}
      id={`product-card-${product.id}`}
    >
      {/* 썸네일 사진 영역 */}
      <button
        type="button"
        aria-label={displayName}
        className="product-artwork relative aspect-16/10 w-full bg-[#f4f4f0] overflow-hidden cursor-pointer"
        onClick={() => onSelect(product)}
      >
        <img
          src={thumbnail}
          alt={displayName}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* 카테고리 뱃지 */}
        <div className="absolute top-3 left-3">
          <span className={`product-badge inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium tracking-wide ${
            product.category === 'WRO'
              ? 'bg-[#1a1a18] text-white'
              : 'bg-[#D85A30] text-white'
          }`}>
            <FileCode2 className="w-3.5 h-3.5" />
            {product.category === 'WRO' ? t.products.wroBadge : product.category === 'CoSpace' ? t.products.cospaceBadge : categoryText(product.category,currentLang)}
          </span>
        </div>

        {/* 유튜브 영상 포함 표시 */}
        {product.youtubeUrl && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-full shadow-xs">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        )}
      </button>

      {/* 카드 텍스트 콘텐츠 */}
      <div className="product-copy flex flex-col flex-1">
        <p className="product-category">{categoryText(product.category,currentLang)}</p>
        <h3 
          className="product-title text-lg font-bold text-[#1a1a18] leading-snug mb-2 wrap-anywhere"
        >
          <button className="text-left" onClick={() => onSelect(product)}>{displayName}</button>
        </h3>

        <p className="product-description text-sm text-[#666660] leading-relaxed mb-5 flex-1">
          {displayShortDesc}
        </p>

        {/* 하단 가격 & 상세보기 버튼 */}
        <div className="product-purchase pt-4 border-t border-[#f0f0eb] flex flex-wrap items-center justify-between gap-3">
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
            className="product-detail-button min-h-11 inline-flex items-center justify-center gap-3 px-5 py-3 text-sm font-semibold transition-all cursor-pointer"
          >
            <span>{t.products.viewDetails}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
