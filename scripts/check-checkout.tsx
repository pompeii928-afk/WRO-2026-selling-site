import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {normalizeCheckoutUrl} from '../src/utils/checkout';
import {CheckoutPanel} from '../src/components/CheckoutPanel';
import {ProductDetailModal} from '../src/components/ProductDetailModal';
import {DEFAULT_PRODUCTS,DEFAULT_SETTINGS} from '../src/utils/storage';
import {LANGUAGES} from '../src/locales/translations';

const link='https://example.lemonsqueezy.com/checkout/buy/11111111-2222-3333-4444-555555555555';
assert.equal(normalizeCheckoutUrl(' '+link+' '),link);
for(const invalid of [undefined,'','javascript:alert(1)','http://example.lemonsqueezy.com/checkout/buy/abc','https://evil.test/checkout/buy/abc','https://lemonsqueezy.com.evil.test/checkout/buy/abc','https://evil.test@example.lemonsqueezy.com/checkout/buy/abc','https://example.lemonsqueezy.com/checkout/?cart=private','https://example.lemonsqueezy.com/checkout/buy/abc?test_mode=1'])assert.equal(normalizeCheckoutUrl(invalid),null,invalid);
for(const {code} of LANGUAGES){
 const html=renderToStaticMarkup(<CheckoutPanel checkoutUrl={link} currentLang={code}/>);
 assert.ok(html.includes(link));assert.ok(html.includes('noopener noreferrer'));
 if(code!=='ko')assert.ok(!/[가-힣]/.test(html));
 const ready=renderToStaticMarkup(<ProductDetailModal product={{...DEFAULT_PRODUCTS[0],checkoutUrl:link}} currentLang={code} settings={DEFAULT_SETTINGS} onClose={()=>{}}/>);
 assert.ok(ready.includes('id="buy-now-btn"'));assert.ok(!ready.includes('id="request-payment-btn"'));
 const pending=renderToStaticMarkup(<ProductDetailModal product={DEFAULT_PRODUCTS[0]} currentLang={code} settings={DEFAULT_SETTINGS} onClose={()=>{}}/>);
 assert.ok(pending.includes('id="request-payment-btn"'));assert.ok(!pending.includes('id="buy-now-btn"'));
}
console.log('PASS: hosted checkout URL validation, malicious/cart/test URL rejection, 5 languages, checkout ready/unconfigured states');
