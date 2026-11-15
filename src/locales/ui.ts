import { LanguageCode } from '../types';

// Every visitor-facing label, including accessible labels and generated email text.
const en = {
  required: 'Please enter your name, reply contact and message.',
  logo: 'Store logo', menu: 'Open menu', closeMenu: 'Close menu', language: 'Language',
  navigation: 'Navigation', support: 'Support', top: 'Back to top',
  about: 'An independent engineering store sharing WRO (World Robot Olympiad) robot building guides and source code, and CoSpace Rescue autonomous navigation algorithms.',
  copyright: 'All rights reserved. Built with precision for competitive robotics.',
  rights: 'All rights reserved.', emptyProducts: 'No products are available in this category.',
  category: 'Category', allVideos: 'All videos', emptyVideos: 'No videos are available in this category.',
  youtubeChannel: 'YouTube channel', inquiryBadge: 'Contact & inquiry', copyEmail: 'Copy email address',
  inquiryGuide: 'Inquiry information', compatibility: 'Questions about WRO rule changes and motor or sensor compatibility are welcome.',
  name: 'Name / nickname', namePlaceholder: 'Your name', replyContact: 'Reply contact (email / phone)',
  contactPlaceholder: 'Your email address or phone number', messagePlaceholder: 'Tell us which product you are interested in or enter your question.',
  inquirySubject: 'Product / technical inquiry', sender: 'Name', contact: 'Contact', message: 'Message',
  details: 'Product details', recipient: 'Recipient', photo: 'Photo', previous: 'Previous photo', next: 'Next photo',
  step: 'Step', pageDescription: 'WRO robot building guides, source code and CoSpace Rescue algorithms.',
};
type UI = typeof en;
export const ui: Record<LanguageCode, UI> = {
  en,
  ko: {
    required: '성함, 회신받을 연락처, 문의 내용을 모두 입력해주세요.',
    logo: '스토어 로고', menu: '메뉴 열기', closeMenu: '메뉴 닫기', language: '언어 선택',
    navigation: '탐색', support: '고객 지원', top: '맨 위로',
    about: 'WRO(World Robot Olympiad) 로봇 조립도 및 소스코드와 CoSpace Rescue 자율주행 알고리즘을 연구하고 공유하는 1인 전문 엔지니어링 스토어입니다.',
    copyright: '모든 권리 보유. 로봇 경기를 위한 정밀한 설계.', rights: '모든 권리 보유.',
    emptyProducts: '해당 카테고리에 등록된 제품이 없습니다.', category: '카테고리', allVideos: '전체 영상', emptyVideos: '해당 카테고리에 등록된 영상이 없습니다.',
    youtubeChannel: '유튜브 채널', inquiryBadge: '구매 및 기술 문의', copyEmail: '이메일 복사', inquiryGuide: '문의 안내',
    compatibility: 'WRO 규정 변경이나 모터·센서 부품 호환성 문의도 환영합니다.', name: '성함 / 닉네임', namePlaceholder: '이름을 입력하세요',
    replyContact: '회신받을 연락처 (이메일 / 전화번호)', contactPlaceholder: '이메일 주소 또는 전화번호', messagePlaceholder: '궁금하신 제품이나 질문 내용을 적어주세요.',
    inquirySubject: '구매 / 기술 문의', sender: '성함', contact: '연락처', message: '문의 내용',
    details: '상세 정보', recipient: '받는 사람', photo: '사진', previous: '이전 사진', next: '다음 사진', step: '단계', pageDescription: 'WRO 로봇 조립도·소스코드 및 CoSpace Rescue 알고리즘 전문 스토어.',
  },
  ja: {
    required: 'お名前、返信先、お問い合わせ内容を入力してください。',
    logo: 'ストアのロゴ', menu: 'メニューを開く', closeMenu: 'メニューを閉じる', language: '言語', navigation: 'ナビゲーション', support: 'サポート', top: 'ページ上部へ',
    about: 'WRO（World Robot Olympiad）のロボット組立ガイドとソースコード、CoSpace Rescueの自律走行アルゴリズムを研究・共有する個人のエンジニアリングストアです。',
    copyright: '無断転載を禁じます。ロボット競技のための精密設計。', rights: '無断転載を禁じます。', emptyProducts: 'このカテゴリーには商品がありません。',
    category: 'カテゴリー', allVideos: 'すべての動画', emptyVideos: 'このカテゴリーには動画がありません。', youtubeChannel: 'YouTubeチャンネル',
    inquiryBadge: '購入・技術に関するお問い合わせ', copyEmail: 'メールアドレスをコピー', inquiryGuide: 'お問い合わせのご案内', compatibility: 'WROのルール変更やモーター・センサーの互換性についてもご相談ください。',
    name: 'お名前 / ニックネーム', namePlaceholder: 'お名前', replyContact: '返信先（メール / 電話）', contactPlaceholder: 'メールアドレスまたは電話番号', messagePlaceholder: 'ご希望の商品やご質問を入力してください。',
    inquirySubject: '購入・技術に関するお問い合わせ', sender: 'お名前', contact: '連絡先', message: 'お問い合わせ内容', details: '商品の詳細', recipient: '宛先', photo: '写真', previous: '前の写真', next: '次の写真', step: 'ステップ', pageDescription: 'WROロボットの組立ガイド、ソースコード、CoSpace Rescueアルゴリズムのストア。',
  },
  zh: {
    required: '请输入姓名、回复联系方式和咨询内容。',
    logo: '商店标志', menu: '打开菜单', closeMenu: '关闭菜单', language: '语言', navigation: '导航', support: '客户支持', top: '返回顶部',
    about: '独立工程商店，研究并分享WRO（世界机器人奥林匹克竞赛）机器人搭建指南、源代码和CoSpace Rescue自主导航算法。',
    copyright: '版权所有。专为机器人竞赛精密设计。', rights: '版权所有。', emptyProducts: '此类别暂无商品。', category: '类别', allVideos: '全部视频', emptyVideos: '此类别暂无视频。',
    youtubeChannel: 'YouTube频道', inquiryBadge: '购买与技术咨询', copyEmail: '复制电子邮箱', inquiryGuide: '咨询说明', compatibility: '欢迎咨询WRO规则变更以及电机、传感器的兼容性。',
    name: '姓名 / 昵称', namePlaceholder: '您的姓名', replyContact: '回复联系方式（邮箱 / 电话）', contactPlaceholder: '电子邮箱或电话号码', messagePlaceholder: '请输入您感兴趣的商品或问题。',
    inquirySubject: '购买 / 技术咨询', sender: '姓名', contact: '联系方式', message: '咨询内容', details: '商品详情', recipient: '收件人', photo: '照片', previous: '上一张照片', next: '下一张照片', step: '步骤', pageDescription: 'WRO机器人搭建指南、源代码及CoSpace Rescue算法商店。',
  },
  es: {
    required: 'Escribe tu nombre, contacto de respuesta y mensaje.',
    logo: 'Logotipo de la tienda', menu: 'Abrir menú', closeMenu: 'Cerrar menú', language: 'Idioma', navigation: 'Navegación', support: 'Atención al cliente', top: 'Volver arriba',
    about: 'Tienda independiente de ingeniería que investiga y comparte guías de construcción y código fuente para WRO (World Robot Olympiad), y algoritmos de navegación autónoma para CoSpace Rescue.',
    copyright: 'Todos los derechos reservados. Diseñado con precisión para la robótica de competición.', rights: 'Todos los derechos reservados.', emptyProducts: 'No hay productos en esta categoría.',
    category: 'Categoría', allVideos: 'Todos los vídeos', emptyVideos: 'No hay vídeos en esta categoría.', youtubeChannel: 'Canal de YouTube', inquiryBadge: 'Consultas de compra y técnicas', copyEmail: 'Copiar correo electrónico',
    inquiryGuide: 'Información de contacto', compatibility: 'También atendemos consultas sobre cambios en las reglas WRO y compatibilidad de motores y sensores.',
    name: 'Nombre / apodo', namePlaceholder: 'Tu nombre', replyContact: 'Contacto de respuesta (correo / teléfono)', contactPlaceholder: 'Tu correo electrónico o teléfono', messagePlaceholder: 'Indica el producto que te interesa o escribe tu pregunta.',
    inquirySubject: 'Consulta de compra / técnica', sender: 'Nombre', contact: 'Contacto', message: 'Mensaje', details: 'Detalles del producto', recipient: 'Destinatario', photo: 'Foto', previous: 'Foto anterior', next: 'Foto siguiente', step: 'Paso', pageDescription: 'Guías de construcción WRO, código fuente y algoritmos de CoSpace Rescue.',
  },
};
export const localeFor = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', zh: 'zh-CN', es: 'es-ES' } as const;
