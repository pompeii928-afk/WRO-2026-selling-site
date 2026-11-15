import { LanguageCode } from '../types';
export const payment: Record<LanguageCode,{buy:string;secure:string;notice:string}> = {
  en:{buy:'Buy now',secure:'Secure checkout with Lemon Squeezy',notice:'Complete payment and access your files on Lemon Squeezy. The final total, including applicable taxes, is shown at checkout.'},
  ko:{buy:'지금 구매하기',secure:'Lemon Squeezy 안전 결제',notice:'Lemon Squeezy에서 결제하고 파일을 받으세요. 적용되는 세금을 포함한 최종 금액은 결제 화면에서 확인할 수 있습니다.'},
  ja:{buy:'今すぐ購入',secure:'Lemon Squeezyの安全な決済',notice:'Lemon Squeezyでお支払いとファイルの受け取りを行います。適用される税金を含む最終金額は決済画面でご確認ください。'},
  zh:{buy:'立即购买',secure:'通过Lemon Squeezy安全支付',notice:'在Lemon Squeezy完成支付并获取文件。含适用税费的最终金额将在结账页面显示。'},
  es:{buy:'Comprar ahora',secure:'Pago seguro con Lemon Squeezy',notice:'Completa el pago y accede a tus archivos en Lemon Squeezy. El total final, incluidos los impuestos aplicables, se muestra al pagar.'},
};
