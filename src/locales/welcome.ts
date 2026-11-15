import { LanguageCode } from '../types';

export const welcome: Record<LanguageCode, {title:string; subtitle:string; eyebrow:string; labels:string[]}> = {
  en: {title:'Welcome to\nthe shop.', subtitle:'Build with purpose. Code with confidence.\nYour next robot starts here.', eyebrow:'Ideas into motion.', labels:['Building guides','Source code','Robot runs']},
  ko: {title:'로봇을 만드는\n당신을 위한 공간.', subtitle:'목표를 담아 조립하고, 자신 있게 코딩하세요.\n당신의 다음 로봇이 여기서 시작됩니다.', eyebrow:'아이디어를 움직임으로.', labels:['조립 설명서','소스 코드','로봇 주행 영상']},
  ja: {title:'ロボットづくりの\nその先へ。', subtitle:'目的を持って組み立て、自信を持ってコードを書く。\n次のロボットはここから始まります。', eyebrow:'アイデアを動きに。', labels:['組立ガイド','ソースコード','ロボット走行動画']},
  zh: {title:'欢迎来到\n机器人商店。', subtitle:'带着目标搭建，充满信心编程。\n您的下一台机器人，从这里开始。', eyebrow:'让创意动起来。', labels:['搭建指南','源代码','机器人运行视频']},
  es: {title:'Bienvenido\na la tienda.', subtitle:'Construye con propósito. Programa con confianza.\nTu próximo robot empieza aquí.', eyebrow:'Ideas en movimiento.', labels:['Guías de construcción','Código fuente','Robots en acción']},
};
