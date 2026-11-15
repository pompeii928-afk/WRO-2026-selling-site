import { LanguageCode } from '../types';

export const boutique: Record<LanguageCode, { collection: string; studio: string; signature: string; explore: string }> = {
  en: { collection: 'The collection', studio: 'Independent robotics studio', signature: 'From an idea. To your next build.', explore: 'Explore the collection' },
  ko: { collection: '컬렉션', studio: '독립 로보틱스 스튜디오', signature: '하나의 아이디어에서, 당신의 다음 로봇으로.', explore: '컬렉션 둘러보기' },
  ja: { collection: 'コレクション', studio: '独立系ロボティクススタジオ', signature: 'ひとつのアイデアから、次のロボットへ。', explore: 'コレクションを見る' },
  zh: { collection: '精选系列', studio: '独立机器人工作室', signature: '从一个创意，到您的下一台机器人。', explore: '探索精选系列' },
  es: { collection: 'La colección', studio: 'Estudio independiente de robótica', signature: 'De una idea. A tu próximo robot.', explore: 'Explorar la colección' },
};
