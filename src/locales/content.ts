import { LanguageCode, Product, ProductTranslation, StoreSettings, VideoItem } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_VIDEOS } from '../utils/storage';
import { catalog, videoTitles } from './catalog';
import { translations } from './translations';
import { publishedSource, publishedTranslations, publishedVideoTitles } from './published';

export function productText(product: Product, lang: LanguageCode): Required<ProductTranslation> {
  const original = DEFAULT_PRODUCTS.find(p => p.id === product.id) || (product.id === publishedSource.id ? publishedSource : undefined);
  const translated = product.translations?.[lang];
  const bundled = product.id === publishedSource.id ? publishedTranslations[lang] : catalog[product.id]?.[lang];
  const field = <K extends keyof ProductTranslation>(key: K): Product[K] => {
    const explicit = translated?.[key];
    const isUnchanged = original && JSON.stringify(product[key]) === JSON.stringify(original[key]);
    const isBundledTranslation = JSON.stringify(explicit) === JSON.stringify((original?.translations as Partial<Record<LanguageCode,ProductTranslation>>)?.[lang]?.[key]);
    if (isUnchanged && bundled?.[key] && (!explicit || isBundledTranslation)) return bundled[key] as Product[K];
    return (explicit || product[key]) as Product[K];
  };
  return { name: field('name'), shortDescription: field('shortDescription'), description: field('description'), includedItems: field('includedItems') };
}
export function heroText(settings: StoreSettings, lang: LanguageCode) {
  const t = translations[lang].hero;
  const defaults = {heroTitle:t.title,heroSubtitle:t.subtitle,heroButtonText:t.ctaButton};
  const field = (key: keyof typeof defaults) => settings.translations?.[lang]?.[key] || (settings[key] === DEFAULT_SETTINGS[key] ? defaults[key] : settings[key]) || defaults[key];
  return {title:field('heroTitle'),subtitle:field('heroSubtitle'),buttonText:field('heroButtonText')};
}
export function videoTitle(video: VideoItem, lang: LanguageCode): string {
  const explicit=video.translations?.[lang]?.title;
  if(explicit)return explicit;
  if(video.id==='vid-2' && video.title==='WRO junior 2026')return publishedVideoTitles[lang];
  const index=DEFAULT_VIDEOS.findIndex(v=>v.id===video.id && v.title===video.title);
  return lang!=='ko' && index>=0 ? videoTitles[lang][index] : video.title;
}
const categoryLabels: Record<string,Record<LanguageCode,string>> = {
  'WRO Senior': {en:'WRO Senior',ko:'WRO 시니어',ja:'WROシニア',zh:'WRO高级组',es:'WRO Senior'},
  'WRO Junior': {en:'WRO Junior',ko:'WRO 주니어',ja:'WROジュニア',zh:'WRO初级组',es:'WRO Junior'},
  Tutorial: {en:'Tutorial',ko:'튜토리얼',ja:'チュートリアル',zh:'教程',es:'Tutorial'},
  Engineering: {en:'Engineering',ko:'엔지니어링',ja:'エンジニアリング',zh:'工程',es:'Ingeniería'},
};
export const categoryText=(category:string,lang:LanguageCode)=>categoryLabels[category]?.[lang]||category;
