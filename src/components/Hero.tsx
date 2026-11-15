import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { LanguageCode, StoreSettings } from '../types';
import { heroText } from '../locales/content';
import { welcome } from '../locales/welcome';
import { boutique } from '../locales/boutique';

interface HeroProps {
  currentLang: LanguageCode;
  settings: StoreSettings;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, settings, onExploreClick }) => {
  const {title, subtitle} = heroText(settings, currentLang);
  const copy = welcome[currentLang];
  const brand = boutique[currentLang];
  return <section id="welcome-section" className="boutique-hero relative isolate overflow-hidden">
    <div className="boutique-shell">
      <div className="hero-topline"><span>{brand.studio}</span><span>WRO / CoSpace</span></div>
      <div className="hero-composition">
        <div className="hero-copy">
          <p className="boutique-eyebrow"><span className="copper-rule"/>{copy.eyebrow}</p>
          <h1 className="boutique-title whitespace-pre-line wrap-anywhere">{title}</h1>
          <p className="hero-description whitespace-pre-line">{subtitle}</p>
          <button onClick={onExploreClick} id="hero-cta-btn" className="boutique-cta">{brand.explore}<ArrowUpRight size={18}/></button>
        </div>
        <div className="brand-art" aria-hidden="true">
          <span className="art-corner art-corner-tl"/><span className="art-corner art-corner-br"/>
          <div className="brand-orbit"/>
          <svg viewBox="650 660 1620 1250" className="brand-emblem" focusable="false"><image href="/channel-mark.png" width="2720" height="2720"/></svg>
          <div className="art-wordmark">K.F.C.<span>R O B O T I C S</span></div>
          <span className="art-caption">{brand.signature}</span>
        </div>
      </div>
      <div className="hero-colophon"><span>WRO &amp; CoSpace Rescue</span><div>{copy.labels.map((label,i)=><span key={label}><small>0{i+1}</small>{label}</span>)}</div><ArrowDownRight size={19} aria-hidden="true"/></div>
    </div>
  </section>;
};
