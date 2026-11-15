import { LanguageCode } from '../types';
export const currencyText:Record<LanguageCode,{label:string;estimate:string;unavailable:string;loading:string;base:string;reference:string;notice:string}>= {
  ko:{label:'표시 통화',estimate:'환산 예상가',unavailable:'환율을 불러오지 못해 판매 통화로 표시합니다.',loading:'환율을 불러오는 중입니다.',base:'판매가',reference:'기준 환율',notice:'환산 가격은 참고용입니다. 실제 결제 통화·금액은 결제창에서 확인하세요.'},
  en:{label:'Display currency',estimate:'Estimated conversion',unavailable:'Rates unavailable. Showing the original sale currency.',loading:'Loading exchange rates.',base:'Sale price',reference:'Reference rate',notice:'Converted prices are estimates. Confirm the final currency and amount at checkout.'},
  ja:{label:'表示通貨',estimate:'換算目安',unavailable:'為替レートを取得できないため、元の販売通貨で表示しています。',loading:'為替レートを取得中です。',base:'販売価格',reference:'参考為替レート',notice:'換算価格は目安です。実際の通貨と金額は決済画面で確認してください。'},
  zh:{label:'显示货币',estimate:'估算换算价',unavailable:'汇率暂不可用，显示原始销售货币。',loading:'正在加载汇率。',base:'销售价格',reference:'参考汇率',notice:'换算价格仅供参考，最终货币和金额请以结账页面为准。'},
  es:{label:'Moneda de visualización',estimate:'Conversión estimada',unavailable:'Tipos no disponibles. Se muestra la moneda original de venta.',loading:'Cargando tipos de cambio.',base:'Precio de venta',reference:'Tipo de referencia',notice:'Los precios convertidos son estimados. Confirma la moneda y el importe finales al pagar.'},
};
