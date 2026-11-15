import React,{createContext,useContext,useEffect,useState} from 'react';
import { LanguageCode } from '../types';
import { localeFor } from '../locales/ui';
import { currencyText } from '../locales/currency';
import { DISPLAY_CURRENCIES,DisplayCurrency,ReferenceRates,convertPrice,defaultCurrency,isDisplayCurrency,parseReferenceRates } from '../utils/currency';

const CACHE_KEY='ROBO_REFERENCE_RATES_V1',CHOICE_KEY='ROBO_DISPLAY_CURRENCY';
const CurrencyContext=createContext<{currency:DisplayCurrency;select:(value:DisplayCurrency)=>void;rates:ReferenceRates|null;loading:boolean}>({currency:'KRW',select:()=>{},rates:null,loading:false});

export function CurrencyProvider({language,children}:{language:LanguageCode;children:React.ReactNode}) {
  const [chosen,setChosen]=useState<DisplayCurrency|null>(()=>{try{const choice=localStorage.getItem(CHOICE_KEY);return isDisplayCurrency(choice)?choice:null;}catch{return null;}});
  const [rates,setRates]=useState<ReferenceRates|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let active=true;
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),10000);
    const update=async()=>{
      try {
        try {
          const cached:ReferenceRates=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');
          if(cached&&Date.now()-cached.fetchedAt<6*3600000&&cached.fetchedAt<=Date.now()) {
            const validated=parseReferenceRates(Object.entries(cached.rates).filter(([quote])=>quote!=='KRW').map(([quote,rate])=>({base:'KRW',quote,rate,date:cached.date})));
            if(active){setRates(validated);setLoading(false);} return;
          }
        }catch{/* Fetch fresh rates when storage or its cached data is unavailable. */}
        const quotes=DISPLAY_CURRENCIES.filter(code=>code!=='KRW').join(',');
        const response=await fetch(`https://api.frankfurter.dev/v2/rates?base=KRW&quotes=${quotes}`,{signal:controller.signal,credentials:'omit'});
        if(!response.ok)throw new Error('Exchange rates unavailable');
        const latest=parseReferenceRates(await response.json());
        if(active){setRates(latest);try{localStorage.setItem(CACHE_KEY,JSON.stringify(latest));}catch{/* Display still works without storage. */}}
      }catch{if(active)setRates(null);}finally{clearTimeout(timeout);if(active)setLoading(false);}
    };
    void update();
    return()=>{active=false;controller.abort();clearTimeout(timeout);};
  },[]);
  const select=(value:DisplayCurrency)=>{setChosen(value);try{localStorage.setItem(CHOICE_KEY,value);}catch{/* Keep the current visit's choice. */}};
  return <CurrencyContext.Provider value={{currency:chosen||defaultCurrency(language),select,rates,loading}}>{children}</CurrencyContext.Provider>;
}

export function CurrencySelector({language}:{language:LanguageCode}) {
  const {currency,select}=useContext(CurrencyContext);
  return <label className="currency-selector"><span>{currencyText[language].label}</span><select aria-label={currencyText[language].label} value={currency} onChange={event=>select(event.target.value as DisplayCurrency)}>{DISPLAY_CURRENCIES.map(code=><option key={code} value={code}>{code}</option>)}</select></label>;
}

export function ProductPrice({amount,currency='KRW',language,detail=false}:{amount:number;currency?:string;language:LanguageCode;detail?:boolean}) {
  const {currency:selected,rates,loading}=useContext(CurrencyContext);
  const text=currencyText[language],converted=convertPrice(amount,currency,selected,rates);
  const different=selected!==currency,available=converted!==null;
  const format=(value:number,code:string)=>new Intl.NumberFormat(localeFor[language],{style:'currency',currency:code,maximumFractionDigits:['KRW','JPY','TWD'].includes(code)?0:2}).format(value);
  return <div className={`display-price ${detail?'display-price-detail':''}`} aria-live="polite">
    <strong>{different&&available?'≈ ':''}{format(available?converted:amount,available?selected:currency)}</strong>
    {different&&available&&<span className="price-original">{text.base}: {format(amount,currency)} · {text.estimate}</span>}
    {different&&!available&&<span className="price-original">{loading?text.loading:text.unavailable}</span>}
    {detail&&different&&available&&<p className="price-reference">{text.reference}: {rates?.date} · Frankfurter<br/>{text.notice}</p>}
  </div>;
}
