/**
 * @file ContactSection.tsx
 * @description 구매 및 기술 문의 섹션
 * 1인 운영 웹사이트 문의 대응 (직접 이메일 발송, 빠른 채널 안내)
 */

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Copy, Check } from 'lucide-react';
import { LanguageCode, StoreSettings } from '../types';
import { translations } from '../locales/translations';
import { ui, localeFor } from '../locales/ui';
import { productText, heroText, videoTitle, categoryText } from '../locales/content';

interface ContactSectionProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ currentLang, settings }) => {
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState(false);

  const t = translations[currentLang];
  const adminEmail = settings.adminEmail || 'pompeii928@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(adminEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderContact.trim() || !inquiryText.trim()) { setFormError(true); return; }
    setFormError(false);
    const u = ui[currentLang];
    const subject = encodeURIComponent(`[${u.inquirySubject}] ${senderName}`);
    const body = encodeURIComponent(`${u.sender}: ${senderName}\n${u.contact}: ${senderContact}\n\n${u.message}:\n${inquiryText}\n`);

    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(adminEmail)}&su=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${encodeURIComponent(adminEmail)}?subject=${subject}&body=${body}`;

    if (isMobile) {
      window.location.href = mailtoUrl;
    } else {
      window.open(gmailWebUrl, '_blank');
    }
  };

  return (
    <section id="contact-section" className="py-16 md:py-24 bg-white border-t border-[#ecece8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#f4f4f0] text-[#555550] text-xs font-bold mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#D85A30]" />
            <span>{ui[currentLang].inquiryBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1a1a18] tracking-tight">
            {t.contact.title}
          </h2>
          <p className="mt-2 text-base text-[#666660]">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-[#fbfbfa] p-4 sm:p-8 rounded-2xl border border-[#ebebe6] shadow-xs">
          
          {/* 좌측 안내 정보 (2열) */}
          <div className="min-w-0 md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#8e8e89] uppercase tracking-wider block mb-1">
                  {t.contact.emailLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span className="min-w-0 wrap-anywhere text-sm sm:text-base font-bold font-mono text-[#1a1a18]">
                    {adminEmail}
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    aria-label={ui[currentLang].copyEmail}
                    className="shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-md hover:bg-[#ebebe6] text-[#70706a] transition-colors"
                    title={ui[currentLang].copyEmail}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#ebebe6] text-xs text-[#666660] space-y-2">
                <p className="font-semibold text-[#1a1a18]">💡 {ui[currentLang].inquiryGuide}</p>
                <p>{t.contact.operatingNotice}</p>
                <p className="text-[#888882]">{ui[currentLang].compatibility}</p>
              </div>
            </div>

            <div className="text-xs text-[#a0a09a]">
              ROBO STORE © {new Date().getFullYear()} {ui[currentLang].rights}
            </div>
          </div>

          {/* 우측 빠른 문의 작성 양식 (3열) */}
          <form noValidate onSubmit={handleSendEmail} className="min-w-0 md:col-span-3 space-y-4">
            {formError && <p role="alert" className="text-sm text-red-700">{ui[currentLang].required}</p>}
            <div>
              <label htmlFor="sender-name" className="block text-xs font-bold text-[#33332f] mb-1.5">
                {ui[currentLang].name}
              </label>
              <input
                type="text"
                required
                id="sender-name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={ui[currentLang].namePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#deded8] text-base sm:text-sm text-[#1a1a18] focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none"
              />
            </div>

            <div>
              <label htmlFor="sender-contact" className="block text-xs font-bold text-[#33332f] mb-1.5">
                {ui[currentLang].replyContact}
              </label>
              <input
                type="text"
                required
                id="sender-contact"
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                placeholder={ui[currentLang].contactPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#deded8] text-base sm:text-sm text-[#1a1a18] focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none"
              />
            </div>

            <div>
              <label htmlFor="inquiry-message" className="block text-xs font-bold text-[#33332f] mb-1.5">
                {t.contact.messageLabel}
              </label>
              <textarea
                required
                rows={4}
                id="inquiry-message"
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder={ui[currentLang].messagePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#deded8] text-base sm:text-sm text-[#1a1a18] focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1a1a18] hover:bg-[#2d2d2a] text-white text-sm font-bold transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{t.contact.sendDirectEmail} (Gmail)</span>
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};
