import React from 'react';
import { LockKeyhole, ArrowUpRight } from 'lucide-react';
import { LanguageCode } from '../types';
import { payment } from '../locales/payment';
import { normalizeCheckoutUrl } from '../utils/checkout';

export function CheckoutPanel({checkoutUrl,currentLang}:{checkoutUrl:string;currentLang:LanguageCode}) {
  const url=normalizeCheckoutUrl(checkoutUrl);
  if(!url)return null;
  const t=payment[currentLang];
  return <div id="product-checkout" className="purchase-footer shrink-0 p-3 sm:p-5 border-t border-[#ebebe6] bg-[#fbfbfa] flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-20">
    <div className="min-w-0 max-w-xl">
      <p className="text-xs font-semibold text-[#55554e] flex items-center gap-1.5"><LockKeyhole size={14}/>{t.secure}</p>
      <p className="text-xs text-[#73736c] mt-1 leading-relaxed">{t.notice}</p>
    </div>
    <a id="buy-now-btn" href={url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-3 px-7 py-3 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-base font-bold transition-colors">
      {t.buy}<ArrowUpRight size={18}/>
    </a>
  </div>;
}
