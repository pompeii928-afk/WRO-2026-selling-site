import { LanguageCode } from '../types';

export const DISPLAY_CURRENCIES = ['KRW','USD','EUR','JPY','CNY','GBP','AUD','CAD','SGD','HKD','TWD','CHF','THB','INR'] as const;
export type DisplayCurrency = typeof DISPLAY_CURRENCIES[number];
export type ReferenceRates = {rates: Record<string,number>; date:string; fetchedAt:number};
export const defaultCurrency = (language:LanguageCode):DisplayCurrency => ({ko:'KRW',en:'USD',ja:'JPY',zh:'CNY',es:'EUR'} as const)[language];
export const isDisplayCurrency = (value:unknown):value is DisplayCurrency => DISPLAY_CURRENCIES.includes(value as DisplayCurrency);
export function parseReferenceRates(rows:unknown,now=Date.now()):ReferenceRates {
  if(!Array.isArray(rows))throw new Error('Invalid exchange rates');
  const rates:Record<string,number>={KRW:1};
  const dates:string[]=[];
  for(const row of rows) {
    if(row?.base!=='KRW'||!isDisplayCurrency(row.quote)||typeof row.rate!=='number'||!Number.isFinite(row.rate)||row.rate<=0||!/^\d{4}-\d{2}-\d{2}$/.test(row.date))continue;
    const age=now-Date.parse(`${row.date}T00:00:00Z`);
    if(!Number.isFinite(age)||age>10*86400000||age < -86400000)continue;
    rates[row.quote]=row.rate; dates.push(row.date);
  }
  if(DISPLAY_CURRENCIES.some(currency=>!rates[currency]))throw new Error('Incomplete exchange rates');
  return {rates,date:dates.sort()[0],fetchedAt:now};
}
export function convertPrice(amount:number,from:string,to:string,rates:ReferenceRates|null):number|null {
  if(from===to)return amount;
  const source=rates?.rates[from],target=rates?.rates[to];
  return source&&target&&Number.isFinite(amount)?amount/source*target:null;
}
