/**
 * @file ProductDetailModal.tsx
 * @description 제품 상세 모달 뷰
 * - 사진 갤러리 (여러 장 좌우 슬라이드 및 썸네일 스트립)
 * - 제품 상세 설명, 패키지 포함 내용 목록
 * - "이 로봇의 주행 영상" 유튜브 임베드 플레이어
 * - Gmail 자동 작성 결제 요청 버튼 (언어별 자동 번역 템플릿, 모바일 앱 폴백, URL 인코딩 완벽 대응)
 */

import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Mail, 
  Play, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode, Product, StoreSettings } from '../types';
import { translations } from '../locales/translations';
import { getYoutubeEmbedUrl } from '../utils/youtube';

interface ProductDetailModalProps {
  product: Product | null;
  currentLang: LanguageCode;
  settings: StoreSettings;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currentLang,
  settings,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const t = translations[currentLang];
  const trans = product.translations?.[currentLang];

  const displayName = trans?.name || product.name;
  const displayDesc = trans?.description || product.description;
  const displayIncluded = (trans?.includedItems && trans.includedItems.length > 0)
    ? trans.includedItems
    : product.includedItems;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80'];

  const formattedPrice = new Intl.NumberFormat(
    currentLang === 'ko' ? 'ko-KR' : currentLang === 'ja' ? 'ja-JP' : 'en-US',
    {
      style: 'currency',
      currency: product.currency || 'KRW',
      maximumFractionDigits: 0,
    }
  ).format(product.price);

  // 현재 날짜 포맷 (YYYY-MM-DD)
  const orderDate = new Date().toISOString().slice(0, 10);
  // 제품 고유 링크
  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#product-${product.id}`
    : `https://robostore.app/#product-${product.id}`;

  // 현재 언어에 맞춤화된 Gmail 제목 및 본문 텍스트 생성
  const emailSubject = t.emailTemplate.subject(displayName);
  const emailBody = t.emailTemplate.body({
    productName: displayName,
    price: formattedPrice,
    url: productUrl,
    orderDate,
  });

  // 관리자 이메일 주소
  const recipientEmail = settings.adminEmail || 'pompeii928@gmail.com';

  /**
   * [5. 결제 요청 (메일 자동 작성 방식)]
   * Gmail 웹 작성창 이동 및 모바일 Gmail 앱/mailto 폴백 처리
   */
  const handlePaymentRequest = () => {
    const encodedEmail = encodeURIComponent(recipientEmail);
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${encodedEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    // 모바일 기기 감지
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // 모바일: 1차로 Gmail 앱 스킴 시도 후 fallback
      const gmailAppUrl = `googlegmail:///co?to=${encodedEmail}&subject=${encodedSubject}&body=${encodedBody}`;
      
      const start = Date.now();
      window.location.href = gmailAppUrl;

      // 500ms 내 앱 전환이 일어나지 않으면 mailto: 로 폴백
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          window.location.href = mailtoUrl;
        }
      }, 500);
    } else {
      // 데스크탑: Gmail 웹 작성창을 새 탭으로 오픈
      const newTab = window.open(gmailWebUrl, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // 팝업 차단 시 mailto로 폴백
        window.location.href = mailtoUrl;
      }
    }
  };

  // 구매 요청 서식 클립보드 복사
  const handleCopyDetails = async () => {
    try {
      const fullText = `[${emailSubject}]\n\n${emailBody}\n\n받는 사람: ${recipientEmail}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // 폴백
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // 유튜브 영상 임베드 URL 추출
  const youtubeEmbedUrl = getYoutubeEmbedUrl(product.youtubeUrl);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="product-detail-modal"
      >
        {/* 상단 헤더 바 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebe6] bg-white sticky top-0 z-20">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D85A30] bg-[#fdf2ee] px-2.5 py-1 rounded-md">
            {product.category === 'WRO' ? t.products.wroBadge : t.products.cospaceBadge}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8e8e89] hover:text-[#1a1a18] hover:bg-[#f4f4f0] transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 스크롤 가능한 본문 */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* [0. 참고 디자인] 사진 갤러리: 여러 장 좌우 슬라이드 및 썸네일 바 */}
          <div className="space-y-3">
            <div className="relative aspect-16/10 w-full bg-[#1a1a18] rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`${displayName} - 사진 ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* 좌우 슬라이드 버튼 (사진이 2장 이상일 때만 노출) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
                    aria-label="이전 사진"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-xs"
                    aria-label="다음 사진"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* 인덱스 표시 뱃지 */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-semibold">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* 썸네일 스트립 */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      currentImageIndex === idx ? 'border-[#D85A30] scale-102' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 제목 & 가격 요약 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a18] leading-snug mb-3">
              {displayName}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-[#8e8e89]">{t.products.priceLabel}:</span>
              <span className="text-3xl font-black text-[#D85A30] tracking-tight">{formattedPrice}</span>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#1a1a18] flex items-center gap-2">
              <span>상세 정보</span>
            </h4>
            <div className="text-sm sm:text-base text-[#444440] leading-relaxed whitespace-pre-line bg-[#fcfcfb] p-5 rounded-xl border border-[#ebebe6]">
              {displayDesc}
            </div>
          </div>

          {/* 패키지 포함 내용 목록 */}
          {displayIncluded && displayIncluded.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#1a1a18] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D85A30]" />
                <span>{t.products.included}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayIncluded.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-sm text-[#33332f] font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D85A30] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* [4. 유튜브 연동] 이 로봇의 주행 영상 임베드 */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-[#1a1a18] flex items-center gap-2">
              <Play className="w-5 h-5 text-[#cc0000] fill-current" />
              <span>{t.products.drivingVideo}</span>
            </h4>
            {youtubeEmbedUrl ? (
              <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden bg-black shadow-md border border-[#ebebe6]">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Robot Run Demonstration"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-[#f8f8f5] rounded-xl border border-dashed border-[#deded8] text-sm text-[#8e8e89]">
                {t.products.noVideo}
              </div>
            )}
          </div>

        </div>

        {/* [5. 결제 요청 (메일 자동 작성 방식)] 고정 하단 바 */}
        <div className="p-5 border-t border-[#ebebe6] bg-[#fbfbfa] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div className="text-left w-full sm:w-auto">
            <p className="text-xs text-[#73736c] mb-0.5">{t.emailTemplate.instruction}</p>
            <p className="text-xs font-mono text-[#8e8e89] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D85A30]" />
              <span>수신: {recipientEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* 복사 버튼 보조 도구 */}
            <button
              onClick={handleCopyDetails}
              title={t.emailTemplate.copyDetails}
              className="px-3.5 py-3 rounded-xl border border-[#deded8] bg-white hover:bg-[#f4f4f0] text-xs font-semibold text-[#444440] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.emailTemplate.copiedSuccess : t.emailTemplate.copyDetails}</span>
            </button>

            {/* 메인 Gmail 결제 요청 버튼 */}
            <button
              onClick={handlePaymentRequest}
              id="request-payment-btn"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-base font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              <span>{t.products.requestPayment}</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
