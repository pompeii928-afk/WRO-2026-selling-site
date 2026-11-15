import assert from 'node:assert/strict';
import {DISPLAY_CURRENCIES,convertPrice,defaultCurrency,parseReferenceRates} from '../src/utils/currency';
import {getYoutubeEmbedUrl} from '../src/utils/youtube';

// Synthetic rates verify conversion arithmetic; they are not market quotations.
const now=Date.parse('2026-11-15T12:00:00Z');
const rows=DISPLAY_CURRENCIES.filter(quote=>quote!=='KRW').map(quote=>({base:'KRW',quote,rate:quote==='USD'?.001:quote==='JPY'?.1:1,date:'2026-11-15'}));
const rates=parseReferenceRates(rows,now);
assert.equal(convertPrice(100000,'KRW','USD',rates),100);
assert.equal(convertPrice(100,'USD','JPY',rates),10000);
assert.equal(convertPrice(0,'KRW','USD',rates),0);
assert.equal(convertPrice(100,'USD','USD',null),100);
assert.equal(convertPrice(100,'KRW','USD',null),null);
assert.equal(convertPrice(100,'XYZ','USD',rates),null);
assert.throws(()=>parseReferenceRates(rows.map(row=>({...row,rate:-1})),now));
assert.throws(()=>parseReferenceRates(rows.map(row=>({...row,date:'2026-10-01'})),now));
assert.throws(()=>parseReferenceRates(rows.slice(1),now));
assert.equal(defaultCurrency('ko'),'KRW');
assert.equal(defaultCurrency('ja'),'JPY');
assert.equal(defaultCurrency('zh'),'CNY');
assert.equal(defaultCurrency('es'),'EUR');
const passive=new URL(getYoutubeEmbedUrl('xP376YuRLOE')!);
const requested=new URL(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=xP376YuRLOE',true)!);
assert.equal(passive.searchParams.get('autoplay'),'0');
assert.equal(requested.searchParams.get('autoplay'),'1');
assert.equal(requested.searchParams.getAll('autoplay').length,1);
assert.equal(requested.pathname,'/embed/xP376YuRLOE');
console.log('PASS: currency cross-conversion, unavailable/stale rates, language defaults and click-to-play embed URLs');
