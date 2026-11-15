import { LanguageCode, ProductTranslation } from '../types';

const description='Blueprints for precision robots that achieve high scores in the WRO, and code that calculates precise angles and distances to control their movements';
// Match the published revision field by field. Future administrator edits take precedence.
export const publishedSource={
  id:'prod-1790165879276',
  name:'WRO junior 2026 robot & code',shortDescription:'WRO junior 2026 robot & code',
  description:'WRO에서 좋은 점수를 내는 정밀한 로봇의 설계도와 정밀한 각도와 거리를 계산해 움직이는 코드',
  includedItems:['조립 설명서,','작동 코드'],
  translations:{en:{name:'WRO junior 2026 robot & code',shortDescription:'WRO junior 2026 robot & code',description},ja:{description},zh:{description},es:{description}},
};
export const publishedTranslations: Record<LanguageCode,Required<ProductTranslation>>={
  en:{name:'WRO Junior 2026 Robot & Code',shortDescription:'WRO Junior 2026 robot building guide and operating code.',description:'Building plans for a precision robot designed for high scores in WRO, with code that calculates precise angles and distances to control its movement.',includedItems:['Robot building instructions','Robot operating code']},
  ko:{name:'WRO 주니어 2026 로봇 & 코드',shortDescription:'WRO 주니어 2026 로봇 조립 설명서와 작동 코드.',description:publishedSource.description,includedItems:['로봇 조립 설명서','로봇 작동 코드']},
  ja:{name:'WROジュニア2026 ロボット＆コード',shortDescription:'WROジュニア2026のロボット組立説明書と動作コード。',description:'WROでの高得点を目指す精密ロボットの設計図と、正確な角度や距離を計算して動作を制御するコードです。',includedItems:['ロボット組立説明書','ロボット動作コード']},
  zh:{name:'WRO初级组2026机器人与代码',shortDescription:'WRO初级组2026机器人搭建指南与运行代码。',description:'旨在WRO比赛中取得高分的精密机器人设计图，以及通过精确计算角度和距离来控制机器人运动的代码。',includedItems:['机器人搭建说明','机器人运行代码']},
  es:{name:'Robot y código WRO Junior 2026',shortDescription:'Guía de construcción y código de funcionamiento del robot WRO Junior 2026.',description:'Planos de un robot de precisión diseñado para obtener buenas puntuaciones en WRO, y código que calcula ángulos y distancias precisos para controlar sus movimientos.',includedItems:['Instrucciones de construcción del robot','Código de funcionamiento del robot']},
};
export const publishedVideoTitles:Record<LanguageCode,string>={en:'WRO Junior 2026',ko:'WRO 주니어 2026',ja:'WROジュニア2026',zh:'WRO初级组2026',es:'WRO Junior 2026'};
