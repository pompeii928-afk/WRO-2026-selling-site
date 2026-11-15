import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ui } from '../src/locales/ui';
import { translations, LANGUAGES } from '../src/locales/translations';
import { productText, videoTitle, heroText } from '../src/locales/content';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_VIDEOS } from '../src/utils/storage';
import { publishedSource } from '../src/locales/published';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { Hero } from '../src/components/Hero';
import { ContactSection } from '../src/components/ContactSection';
import { VideosSection } from '../src/components/VideosSection';
import { ProductCard } from '../src/components/ProductCard';
import { ProductDetailModal } from '../src/components/ProductDetailModal';

for (const {code} of LANGUAGES) {
  assert.deepEqual(Object.keys(ui[code]).sort(),Object.keys(ui.en).sort());
  const fragments=[
    <Header currentLang={code} onLanguageChange={()=>{}} activeSection="products" onNavigate={()=>{}} youtubeChannelUrl={DEFAULT_SETTINGS.youtubeChannelUrl}/>,
    <Footer currentLang={code} settings={DEFAULT_SETTINGS} onNavigate={()=>{}}/>,
    <Hero currentLang={code} settings={DEFAULT_SETTINGS} onExploreClick={()=>{}}/>,
    <ContactSection currentLang={code} settings={DEFAULT_SETTINGS}/>,
    <VideosSection currentLang={code} settings={DEFAULT_SETTINGS} videos={DEFAULT_VIDEOS}/>,
  ];
  for(const product of [...DEFAULT_PRODUCTS,{...DEFAULT_PRODUCTS[0],...publishedSource}]){
    const text=productText(product,code);
    for(const key of ['name','shortDescription','description'] as const)assert.ok(text[key]);
    assert.equal(text.includedItems.length,product.includedItems.length);
    fragments.push(<ProductCard currentLang={code} product={product} onSelect={()=>{}}/>);
    fragments.push(<ProductDetailModal currentLang={code} product={product} settings={DEFAULT_SETTINGS} onClose={()=>{}}/>);
  }
  const html=fragments.map(f=>renderToStaticMarkup(f)).join('\n');
  assert.ok(!html.includes('/admin'),'Public admin shortcut must be absent');
  assert.match(html,/data-nav="products" aria-current|aria-current="location" data-nav="products"/);
  if(code!=='ko') assert.ok(!/[가-힣]/.test(html),`Korean leaked into ${code} public content`);
  DEFAULT_VIDEOS.forEach(v=>assert.ok(videoTitle(v,code)));
  const email=translations[code].emailTemplate.body({productName:'Example',price:'10',url:'https://example.test',orderDate:'2026-11-15'});
  assert.ok(email.includes('Example'));
}
// Translation resolution must never overwrite edited products with sample text.
const custom={...DEFAULT_PRODUCTS[1],name:'Custom robot',translations:{en:{name:'My robot'}}};
assert.equal(productText(custom,'en').name,'My robot');
const customHero={...DEFAULT_SETTINGS,heroTitle:'Custom heading',translations:{en:{heroTitle:'Custom English heading'}}};
assert.equal(heroText(customHero,'en').title,'Custom English heading');
assert.match(readFileSync('src/App.tsx','utf8'),/path === '\/admin'/);
console.log('PASS: all 5 visitor languages, 3 product packages, 6 video titles, mail templates, no public admin links, direct admin routing, custom overrides');
