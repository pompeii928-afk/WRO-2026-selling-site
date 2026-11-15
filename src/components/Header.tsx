import React, { useState, useEffect, useRef } from 'react';
import { Globe, Youtube, Menu, X, ChevronDown } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, translations } from '../locales/translations';
import { ui } from '../locales/ui';
import { CurrencySelector } from './Currency';
export type ActiveSection = 'home' | 'products' | 'videos' | 'contact';
interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeSection: ActiveSection;
  onNavigate: (page: 'home' | 'videos' | 'admin', sectionId?: string) => void;
  youtubeChannelUrl: string;
  customLogoUrl?: string;
}
export const Header: React.FC<HeaderProps> = ({currentLang,onLanguageChange,activeSection,onNavigate,youtubeChannelUrl,customLogoUrl}) => {
  const [langOpen,setLangOpen]=useState(false),[mobileOpen,setMobileOpen]=useState(false);
  const dropdownRef=useRef<HTMLDivElement>(null);
  const t=translations[currentLang],u=ui[currentLang];
  const language=LANGUAGES.find(l=>l.code===currentLang)!;
  useEffect(()=>{
    const outside=(e:MouseEvent)=>{if(!dropdownRef.current?.contains(e.target as Node))setLangOpen(false);};
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setLangOpen(false);setMobileOpen(false);}};
    document.addEventListener('mousedown',outside);document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('mousedown',outside);document.removeEventListener('keydown',escape);};
  },[]);
  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnDesktop = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, [mobileOpen]);
  const navItems: {id:ActiveSection;page:'home'|'videos';section?:string;label:string}[]=[
    {id:'home',page:'home',label:t.nav.home},
    {id:'products',page:'home',section:'products-section',label:t.nav.products},
    {id:'videos',page:'videos',label:t.nav.videos},
    {id:'contact',page:'home',section:'contact-section',label:t.nav.contact},
  ];
  const channel=youtubeChannelUrl||'https://www.youtube.com/channel/UC_o1n4QCZyABlKCdxI7cFPA';
  const subscribeUrl=`${channel}${channel.includes('?')?'&':'?'}sub_confirmation=1`;
  const navigate=(page:'home'|'videos',section?:string)=>{setMobileOpen(false);onNavigate(page,section);};
  const links=()=>navItems.map(item=><button key={item.id} onClick={()=>navigate(item.page,item.section)} aria-current={activeSection===item.id?'location':undefined} data-nav={item.id}
    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection===item.id?'text-white bg-[#2d2d2a] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#D85A30]':'text-[#d0d0cc] hover:text-white hover:bg-[#252523]'}`}>{item.label}</button>);
  return <header className="boutique-header sticky top-0 z-50 w-full bg-[#1a1a18] text-white border-b border-[#2d2d2a]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between gap-3">
      <button onClick={()=>navigate('home')} className="header-brand min-w-0 py-1" aria-label={t.nav.home}><img src={customLogoUrl||'/logo.svg'} alt={u.logo} className="h-9 lg:h-10 max-w-[min(30vw,140px)] w-auto object-contain"/><span aria-hidden="true" className="header-wordmark">K.F.C.<small>ROBOTICS</small></span></button>
      <nav aria-label={u.navigation} className="hidden lg:flex items-center gap-1">{links()}</nav>
      <div className="hidden lg:flex items-center gap-3">
        <CurrencySelector language={currentLang}/>
        <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#cc0000] hover:bg-[#b00000]"><Youtube className="w-4 h-4"/><span>{t.nav.subscribe}</span></a>
        <div className="relative" ref={dropdownRef}>
          <button id="language-selector-btn" aria-label={u.language} aria-expanded={langOpen} aria-controls="language-options" onClick={()=>setLangOpen(!langOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282825] hover:bg-[#333330] text-sm border border-[#383834]"><Globe className="w-4 h-4"/><span lang={language.code}>{language.flag} {language.name}</span><ChevronDown className="w-3.5 h-3.5"/></button>
          {langOpen&&<div id="language-options" className="absolute right-0 mt-2 w-44 bg-[#232321] border border-[#383834] rounded-xl shadow-xl py-1 z-50">{LANGUAGES.map(l=><button key={l.code} lang={l.code} aria-pressed={currentLang===l.code} onClick={()=>{onLanguageChange(l.code);setLangOpen(false);}} className={`w-full text-left px-4 py-2 text-sm ${currentLang===l.code?'bg-[#D85A30] text-white':'text-[#e5e5e0] hover:bg-[#2e2e2a]'}`}>{l.flag} {l.name}</button>)}</div>}
        </div>
      </div>
      <button className="lg:hidden shrink-0 min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-[#282825]" aria-label={mobileOpen?u.closeMenu:u.menu} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
    </div>
    {mobileOpen&&<div id="mobile-navigation" className="lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-[#1f1f1d] border-b border-[#2d2d2a] shadow-xl px-4 pt-3 pb-5 space-y-3">
      <nav aria-label={u.navigation} className="grid grid-cols-2 gap-2">{links()}</nav>
      <div className="pt-2 border-t border-[#2d2d2a]"><p className="text-xs text-[#a3a39e] mb-2">{u.language}</p><div className="grid grid-cols-2 gap-1.5">{LANGUAGES.map(l=><button key={l.code} lang={l.code} aria-pressed={currentLang===l.code} onClick={()=>onLanguageChange(l.code)} className={`px-3 py-2 rounded-lg text-xs text-left ${currentLang===l.code?'bg-[#D85A30]':'bg-[#282825] text-[#d0d0cc]'}`}>{l.flag} {l.name}</button>)}</div></div>
      <CurrencySelector language={currentLang}/>
      <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs bg-[#cc0000]"><Youtube className="w-4 h-4"/>{t.nav.subscribe}</a>
    </div>}
  </header>;
};
