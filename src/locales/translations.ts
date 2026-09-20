/**
 * @file translations.ts
 * @description 5개 국어(한국어, 영어, 일본어, 중국어, 스페인어) 다국어 번역 사전
 * 새 언어를 추가하려면 LANGUAGES 배열과 translations 객체에 해당 언어 코드를 추가하면 됩니다.
 */

import { LanguageCode } from '../types';

export interface TranslationDictionary {
  languageName: string;
  nav: {
    home: string;
    products: string;
    videos: string;
    contact: string;
    subscribe: string;
    admin: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  products: {
    title: string;
    subtitle: string;
    all: string;
    wro: string;
    cospace: string;
    viewDetails: string;
    requestPayment: string;
    included: string;
    drivingVideo: string;
    noVideo: string;
    close: string;
    priceLabel: string;
    share: string;
    copied: string;
    wroBadge: string;
    cospaceBadge: string;
  };
  emailTemplate: {
    subject: (productName: string) => string;
    body: (params: { productName: string; price: string; url: string; orderDate: string }) => string;
    openGmail: string;
    fallbackMailto: string;
    copyDetails: string;
    copiedSuccess: string;
    instruction: string;
  };
  videos: {
    title: string;
    subtitle: string;
    subscribeBtn: string;
    watchNow: string;
    channelLink: string;
    openOnYoutube: string;
    moreVideos: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    telegramLabel: string;
    messageLabel: string;
    sendDirectEmail: string;
    operatingNotice: string;
  };
  admin: {
    title: string;
    loginTitle: string;
    loginDesc: string;
    initPasswordTitle: string;
    initPasswordDesc: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    loginBtn: string;
    setPasswordBtn: string;
    logoutBtn: string;
    invalidPassword: string;
    passwordMismatch: string;
    passwordSetSuccess: string;
    
    tabProducts: string;
    tabSettings: string;
    tabBackup: string;
    
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    deleteConfirm: string;
    saveProduct: string;
    cancel: string;
    
    fieldCategory: string;
    fieldName: string;
    fieldPrice: string;
    fieldShortDesc: string;
    fieldDesc: string;
    fieldIncluded: string;
    fieldImages: string;
    fieldYoutube: string;
    fieldTranslations: string;
    
    uploadImageNotice: string;
    dropImageHere: string;
    compressing: string;
    deleteImage: string;
    moveUp: string;
    moveDown: string;
    
    settingsTitle: string;
    heroTitleLabel: string;
    heroSubtitleLabel: string;
    adminEmailLabel: string;
    youtubeChannelLabel: string;
    saveSettingsBtn: string;
    settingsSaved: string;
  };
}

export const LANGUAGES: { code: LanguageCode; name: string; flag: string }[] = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文 (简体)', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  // 1. 한국어 (기본)
  ko: {
    languageName: '한국어',
    nav: {
      home: '홈',
      products: '제품',
      videos: '영상',
      contact: '문의',
      subscribe: '유튜브 구독',
      admin: '관리자',
    },
    hero: {
      badge: 'WRO & CoSpace Rescue 공인 전문가 설계',
      title: 'WRO 로봇 조립도 & 소스코드\nCoSpace Rescue 알고리즘 마켓',
      subtitle: '국제 대회에서 입증된 안정적인 하드웨어 설계와 미션 만점 알고리즘 소스코드를 만나보세요.',
      ctaButton: '제품 보러가기',
      feature1: '정밀 3D 조립도 (Studio/PDF)',
      feature2: '검증된 파이썬 / C++ 소스코드',
      feature3: '실제 주행 영상 100% 검증',
    },
    products: {
      title: '판매 제품 목록',
      subtitle: '직접 제작하고 대회에서 검증한 고성능 로봇 조립도 및 소스코드입니다.',
      all: '전체',
      wro: 'WRO (조립도 & 소스코드)',
      cospace: 'CoSpace Rescue (소스코드)',
      viewDetails: '상세보기',
      requestPayment: '결제 요청 (Gmail)',
      included: '패키지 포함 내용',
      drivingVideo: '이 로봇의 주행 영상',
      noVideo: '등록된 주행 영상이 없습니다.',
      close: '닫기',
      priceLabel: '판매 가격',
      share: '링크 복사',
      copied: '복사되었습니다!',
      wroBadge: 'WRO 조립도 + 코드',
      cospaceBadge: 'CoSpace 소스코드',
    },
    emailTemplate: {
      subject: (name) => `[구매 요청] ${name}`,
      body: ({ productName, price, url, orderDate }) => 
`안녕하세요. 아래 제품을 구매하고 싶습니다.

제품명: ${productName}
가격: ${price}
제품 링크: ${url}
주문 요청일: ${orderDate}

구매자 이름: 
연락처(전화번호 또는 이메일): 

결제 안내(계좌번호 등)와 자료 전달 방법을 회신해 주시면 감사하겠습니다.`,
      openGmail: 'Gmail로 바로 결제 요청',
      fallbackMailto: '기본 메일 앱으로 열기',
      copyDetails: '신청 양식 클립보드 복사',
      copiedSuccess: '구매 요청 내용이 복사되었습니다!',
      instruction: '버튼을 클릭하면 결제 요청 이메일이 자동 완성되어 발송 준비됩니다.',
    },
    videos: {
      title: '로봇 주행 및 튜토리얼 영상',
      subtitle: '유튜브 공식 채널에서 다양한 로봇의 실제 미션 주행과 시뮬레이션 영상을 확인하세요.',
      subscribeBtn: '유튜브 채널 구독하기',
      watchNow: '영상 보기',
      channelLink: '채널 바로가기',
      openOnYoutube: 'YouTube에서 시청',
      moreVideos: '더 많은 영상 보러가기',
    },
    contact: {
      title: '구매 및 기술 문의',
      subtitle: '제품에 관한 궁금한 점이나 커스텀 제작 의뢰는 언제든 편하게 문의해주세요.',
      emailLabel: '대표 이메일',
      telegramLabel: '빠른 문의 채널',
      messageLabel: '문의 내용',
      sendDirectEmail: '직접 이메일 보내기',
      operatingNotice: '1인 운영 연구소로 확인 후 순차적으로 답변드립니다 (보통 24시간 이내).',
    },
    admin: {
      title: '스토어 관리자 센터',
      loginTitle: '관리자 로그인',
      loginDesc: '제품 등록 및 사이트 관리를 위해 비밀번호를 입력해주세요.',
      initPasswordTitle: '초기 관리자 비밀번호 설정',
      initPasswordDesc: '첫 방문입니다. 앞으로 사용할 관리자 비밀번호를 설정해주세요.',
      passwordPlaceholder: '비밀번호를 입력하세요',
      confirmPasswordPlaceholder: '비밀번호 확인',
      loginBtn: '로그인',
      setPasswordBtn: '비밀번호 저장 및 로그인',
      logoutBtn: '로그아웃',
      invalidPassword: '비밀번호가 올바르지 않습니다.',
      passwordMismatch: '비밀번호 확인이 일치하지 않습니다.',
      passwordSetSuccess: '관리자 비밀번호가 성공적으로 설정되었습니다.',
      
      tabProducts: '제품 관리',
      tabSettings: '사이트 설정',
      tabBackup: '데이터 백업 & 복원',
      
      addProduct: '새 제품 등록',
      editProduct: '제품 수정',
      deleteProduct: '삭제',
      deleteConfirm: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      saveProduct: '제품 저장',
      cancel: '취소',
      
      fieldCategory: '카테고리',
      fieldName: '제품명 (한국어)',
      fieldPrice: '가격 (원)',
      fieldShortDesc: '한 줄 소개 (한국어)',
      fieldDesc: '상세 설명 (한국어)',
      fieldIncluded: '포함 내용 (엔터로 구분)',
      fieldImages: '제품 사진 업로드',
      fieldYoutube: '주행 영상 유튜브 링크 (예: https://www.youtube.com/watch?v=...)',
      fieldTranslations: '다국어 번역 설정 (선택 사항, 비워둘 시 한국어 표시)',
      
      uploadImageNotice: '사진을 여러 장 선택할 수 있으며 자동으로 최적화(압축)됩니다.',
      dropImageHere: '여기를 클릭하거나 이미지를 드래그하여 업로드',
      compressing: '이미지 최적화 처리 중...',
      deleteImage: '사진 삭제',
      moveUp: '앞으로',
      moveDown: '뒤로',
      
      settingsTitle: '기본 설정',
      heroTitleLabel: '히어로 메인 제목',
      heroSubtitleLabel: '히어로 소개글',
      adminEmailLabel: '결제 요청 수신 이메일 주소',
      youtubeChannelLabel: '유튜브 채널 URL',
      saveSettingsBtn: '설정 저장',
      settingsSaved: '설정이 성공적으로 저장되었습니다.',
    },
  },

  // 2. English
  en: {
    languageName: 'English',
    nav: {
      home: 'Home',
      products: 'Products',
      videos: 'Videos',
      contact: 'Contact',
      subscribe: 'Subscribe',
      admin: 'Admin',
    },
    hero: {
      badge: 'Certified WRO & CoSpace Robotics Engineering',
      title: 'WRO Robot Instructions & Code\nCoSpace Rescue Algorithms',
      subtitle: 'Access world-class competition-proven robotics hardware designs and 100% full-score algorithm codebases.',
      ctaButton: 'Explore Products',
      feature1: 'High-Precision 3D Build (PDF/Studio)',
      feature2: 'Verified Python & C++ Algorithms',
      feature3: '100% Real Run Demonstration Videos',
    },
    products: {
      title: 'Our Products',
      subtitle: 'High-performance robot building guides and source codes tested in international competitions.',
      all: 'All',
      wro: 'WRO (Guide & Code)',
      cospace: 'CoSpace Rescue (Source Code)',
      viewDetails: 'View Details',
      requestPayment: 'Order via Gmail',
      included: 'Package Contents',
      drivingVideo: 'Robot Demonstration Video',
      noVideo: 'No demonstration video registered yet.',
      close: 'Close',
      priceLabel: 'Price',
      share: 'Copy Link',
      copied: 'Copied!',
      wroBadge: 'WRO Guide + Code',
      cospaceBadge: 'CoSpace Source Code',
    },
    emailTemplate: {
      subject: (name) => `[Purchase Request] ${name}`,
      body: ({ productName, price, url, orderDate }) => 
`Hello,

I would like to purchase the following product:

Product Name: ${productName}
Price: ${price}
Product Link: ${url}
Order Date: ${orderDate}

Buyer Name: 
Contact (Email or Phone): 

Please reply with payment instructions (e.g., PayPal/Bank/Wise) and delivery details.

Thank you!`,
      openGmail: 'Compose in Gmail Web',
      fallbackMailto: 'Open Default Mail App',
      copyDetails: 'Copy Order Text to Clipboard',
      copiedSuccess: 'Order details copied to clipboard!',
      instruction: 'Clicking opens Gmail with all details pre-filled and ready to send.',
    },
    videos: {
      title: 'Robot Runs & Tutorials',
      subtitle: 'Watch official runs, obstacle strategies, and simulated trials on our YouTube channel.',
      subscribeBtn: 'Subscribe on YouTube',
      watchNow: 'Watch Now',
      channelLink: 'Visit Channel',
      openOnYoutube: 'Watch on YouTube',
      moreVideos: 'More Videos',
    },
    contact: {
      title: 'Inquiries & Support',
      subtitle: 'Feel free to reach out for questions regarding packages or custom engineering guidance.',
      emailLabel: 'Official Email',
      telegramLabel: 'Direct Channel',
      messageLabel: 'Message',
      sendDirectEmail: 'Send Email Directly',
      operatingNotice: 'Operated independently; responses are typically sent within 24 hours.',
    },
    admin: {
      title: 'Store Admin Console',
      loginTitle: 'Admin Sign In',
      loginDesc: 'Please enter your master password to access the store management system.',
      initPasswordTitle: 'Set Initial Admin Password',
      initPasswordDesc: 'First time setup. Please define your master admin password.',
      passwordPlaceholder: 'Enter master password',
      confirmPasswordPlaceholder: 'Confirm password',
      loginBtn: 'Sign In',
      setPasswordBtn: 'Save Password & Sign In',
      logoutBtn: 'Sign Out',
      invalidPassword: 'Password is incorrect.',
      passwordMismatch: 'Passwords do not match.',
      passwordSetSuccess: 'Admin password successfully initialized.',
      
      tabProducts: 'Products',
      tabSettings: 'Settings',
      tabBackup: 'Backup & Restore',
      
      addProduct: 'Add New Product',
      editProduct: 'Edit Product',
      deleteProduct: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this product? This action cannot be undone.',
      saveProduct: 'Save Product',
      cancel: 'Cancel',
      
      fieldCategory: 'Category',
      fieldName: 'Product Name (Korean default)',
      fieldPrice: 'Price',
      fieldShortDesc: 'Short Description',
      fieldDesc: 'Full Description',
      fieldIncluded: 'Included Items (One per line)',
      fieldImages: 'Product Photos',
      fieldYoutube: 'YouTube Demonstration URL',
      fieldTranslations: 'Language Translations (Optional)',
      
      uploadImageNotice: 'Multiple images supported with automatic in-browser compression.',
      dropImageHere: 'Click or drop images here to upload',
      compressing: 'Optimizing and compressing...',
      deleteImage: 'Delete',
      moveUp: 'Move Left',
      moveDown: 'Move Right',
      
      settingsTitle: 'Global Configuration',
      heroTitleLabel: 'Hero Main Title',
      heroSubtitleLabel: 'Hero Subtitle',
      adminEmailLabel: 'Recipient Email for Orders',
      youtubeChannelLabel: 'YouTube Channel URL',
      saveSettingsBtn: 'Save Settings',
      settingsSaved: 'Settings saved successfully.',
    },
  },

  // 3. 日本語
  ja: {
    languageName: '日本語',
    nav: {
      home: 'ホーム',
      products: '製品',
      videos: '動画',
      contact: 'お問い合わせ',
      subscribe: 'YouTube登録',
      admin: '管理者',
    },
    hero: {
      badge: '国際WRO・CoSpace Rescue公認設計',
      title: 'WRO ロボット組立図・コード\nCoSpace Rescue アルゴリズム',
      subtitle: '世界大会で実証された高精度ハードウェア設計とミッション満点アルゴリズムをお届けします。',
      ctaButton: '製品を見る',
      feature1: '精密3D組立図 (Studio/PDF)',
      feature2: '検証済み Python & C++ コード',
      feature3: '100% 実際の走行動画を公開',
    },
    products: {
      title: '製品一覧',
      subtitle: '大会実績を持つ高性能ロボット組立図およびソースコードです。',
      all: 'すべて',
      wro: 'WRO (組立図 & コード)',
      cospace: 'CoSpace Rescue (コード)',
      viewDetails: '詳細を見る',
      requestPayment: 'Gmailで購入申請',
      included: 'パッケージ内容',
      drivingVideo: 'このロボットの走行動画',
      noVideo: '走行動画はまだ登録されていません。',
      close: '閉じる',
      priceLabel: '販売価格',
      share: 'リンクをコピー',
      copied: 'コピー完了！',
      wroBadge: 'WRO 組立図 + コード',
      cospaceBadge: 'CoSpace コード',
    },
    emailTemplate: {
      subject: (name) => `[購入リクエスト] ${name}`,
      body: ({ productName, price, url, orderDate }) => 
`こんにちは。

以下の製品の購入を希望します。

製品名: ${productName}
価格: ${price}
製品リンク: ${url}
注文日: ${orderDate}

購入者のお名前: 
ご連絡先 (メールまたは電話番号): 

お支払い方法（送金先等）および資料の送付手順をご案内いただけますと幸いです。

よろしくお願いいたします。`,
      openGmail: 'Gmailで購入申請を作成',
      fallbackMailto: '標準メールアプリで開く',
      copyDetails: '申請文をクリップボードにコピー',
      copiedSuccess: '購入申請内容をコピーしました！',
      instruction: 'ボタンを押すと内容が自動入力されたGmail作成画面が開きます。',
    },
    videos: {
      title: '走行および解説動画',
      subtitle: '公式YouTubeチャンネルにてロボットの走行テストや戦略動画を随時公開中。',
      subscribeBtn: 'YouTubeチャンネルを登録',
      watchNow: '動画を見る',
      channelLink: 'チャンネルへ',
      openOnYoutube: 'YouTubeで見る',
      moreVideos: 'もっと見る',
    },
    contact: {
      title: 'お問い合わせ',
      subtitle: '製品に関するご質問や技術サポートについてはお気軽にお問い合わせください。',
      emailLabel: '代表メール',
      telegramLabel: 'ダイレクト連絡先',
      messageLabel: 'お問い合わせ内容',
      sendDirectEmail: '直接メールを送る',
      operatingNotice: '個人運営のため通常24時間以内に順次ご返答いたします。',
    },
    admin: {
      title: 'ストア管理者センター',
      loginTitle: '管理者ログイン',
      loginDesc: '管理機能を利用するにはパスワードを入力してください。',
      initPasswordTitle: '初回管理者パスワード設定',
      initPasswordDesc: '初回アクセスです。今後使用する管理者パスワードを設定してください。',
      passwordPlaceholder: 'パスワードを入力',
      confirmPasswordPlaceholder: 'パスワード再確認',
      loginBtn: 'ログイン',
      setPasswordBtn: '保存してログイン',
      logoutBtn: 'ログアウト',
      invalidPassword: 'パスワードが正しくありません。',
      passwordMismatch: 'パスワードが一致しません。',
      passwordSetSuccess: '管理者パスワードを設定しました。',
      
      tabProducts: '製品管理',
      tabSettings: 'サイト設定',
      tabBackup: 'バックアップ & 復元',
      
      addProduct: '新規製品登録',
      editProduct: '製品編集',
      deleteProduct: '削除',
      deleteConfirm: '本当に削除しますか？この操作は取り消せません。',
      saveProduct: '製品を保存',
      cancel: 'キャンセル',
      
      fieldCategory: 'カテゴリー',
      fieldName: '製品名 (韓国語標準)',
      fieldPrice: '価格',
      fieldShortDesc: '短い説明',
      fieldDesc: '詳細説明',
      fieldIncluded: '含まれる内容 (改行区切り)',
      fieldImages: '製品写真アップロード',
      fieldYoutube: 'YouTube走行動画URL',
      fieldTranslations: '多言語設定 (任意)',
      
      uploadImageNotice: '複数枚対応・自動画像リサイズ＆圧縮処理。',
      dropImageHere: 'クリックまたは画像をドラッグして追加',
      compressing: '画像を圧縮中...',
      deleteImage: '写真を削除',
      moveUp: '前へ',
      moveDown: '次へ',
      
      settingsTitle: '基本設定',
      heroTitleLabel: 'メイン見出し',
      heroSubtitleLabel: 'サブ見出し',
      adminEmailLabel: '購入申請受信メールアドレス',
      youtubeChannelLabel: 'YouTubeチャンネルURL',
      saveSettingsBtn: '設定を保存',
      settingsSaved: '設定が保存されました。',
    },
  },

  // 4. 中文 (简体)
  zh: {
    languageName: '中文 (简体)',
    nav: {
      home: '首页',
      products: '产品',
      videos: '视频',
      contact: '咨询',
      subscribe: '订阅频道',
      admin: '管理后台',
    },
    hero: {
      badge: '国际 WRO & CoSpace 赛事认证方案',
      title: 'WRO 机器人图纸与代码\nCoSpace Rescue 算法商店',
      subtitle: '提供经过国际大赛验证的高可靠性机器人机械结构图纸与满分级算法源代码。',
      ctaButton: '浏览产品',
      feature1: '高精度 3D 搭建指南 (PDF/Studio)',
      feature2: '全套 Python & C++ 满分算法',
      feature3: '100% 真实场地实车运行演示',
    },
    products: {
      title: '精选产品',
      subtitle: '国际赛事获奖级别的高性能机器人搭建图纸与优化源代码。',
      all: '全部',
      wro: 'WRO (图纸 & 代码)',
      cospace: 'CoSpace Rescue (源代码)',
      viewDetails: '查看详情',
      requestPayment: 'Gmail 申请购买',
      included: '包含内容清单',
      drivingVideo: '机器人实车运行视频',
      noVideo: '暂未上传运行视频。',
      close: '关闭',
      priceLabel: '价格',
      share: '复制链接',
      copied: '已复制！',
      wroBadge: 'WRO 图纸 + 代码',
      cospaceBadge: 'CoSpace 算法源码',
    },
    emailTemplate: {
      subject: (name) => `[购买申请] ${name}`,
      body: ({ productName, price, url, orderDate }) => 
`您好，

我想购买以下产品：

产品名称: ${productName}
价格: ${price}
产品链接: ${url}
申请日期: ${orderDate}

购买者姓名: 
联系方式 (电话或邮箱): 

请回复汇款方式（支付宝/银行/PayPal等）与资料发放说明。

非常感谢！`,
      openGmail: '在 Gmail 中填写并发送',
      fallbackMailto: '打开本地默认邮件应用',
      copyDetails: '复制购买信息到剪贴板',
      copiedSuccess: '购买申请内容已复制到剪贴板！',
      instruction: '点击按钮将自动在 Gmail 中生成带有完整订单信息的预填邮件。',
    },
    videos: {
      title: '机器人实测与教程视频',
      subtitle: '在官方 YouTube 频道查看各种机器人的真实赛道任务运行与算法仿真展示。',
      subscribeBtn: '订阅 YouTube 频道',
      watchNow: '观看视频',
      channelLink: '进入频道',
      openOnYoutube: '在 YouTube 播放',
      moreVideos: '查看更多',
    },
    contact: {
      title: '购买与技术咨询',
      subtitle: '关于产品详情或定制研发咨询，欢迎随时与我们联系。',
      emailLabel: '官方邮箱',
      telegramLabel: '即时联络',
      messageLabel: '咨询内容',
      sendDirectEmail: '直接发送邮件',
      operatingNotice: '个人独立研发工作室，通常在 24 小时内回复。',
    },
    admin: {
      title: '商城管理控制台',
      loginTitle: '管理员登录',
      loginDesc: '请输入主管理员密码以访问控制台。',
      initPasswordTitle: '初次设置管理员密码',
      initPasswordDesc: '检测到首次访问，请设置您的管理员登录密码。',
      passwordPlaceholder: '输入密码',
      confirmPasswordPlaceholder: '确认密码',
      loginBtn: '登录',
      setPasswordBtn: '保存并登录',
      logoutBtn: '退出登录',
      invalidPassword: '密码错误。',
      passwordMismatch: '两次输入的密码不一致。',
      passwordSetSuccess: '管理员密码设置成功。',
      
      tabProducts: '产品管理',
      tabSettings: '站点设置',
      tabBackup: '数据备份与还原',
      
      addProduct: '新增产品',
      editProduct: '编辑产品',
      deleteProduct: '删除',
      deleteConfirm: '确定要删除此产品吗？此操作无法撤销。',
      saveProduct: '保存产品',
      cancel: '取消',
      
      fieldCategory: '分类',
      fieldName: '产品名称 (韩文原文)',
      fieldPrice: '价格',
      fieldShortDesc: '简短描述',
      fieldDesc: '详细说明',
      fieldIncluded: '包含项目 (每行一项)',
      fieldImages: '产品图片',
      fieldYoutube: 'YouTube 运行视频链接',
      fieldTranslations: '多语言翻译 (可选)',
      
      uploadImageNotice: '支持多图上传，浏览器本地自动缩放与无损压缩。',
      dropImageHere: '点击或拖拽图片到此处上传',
      compressing: '正在压缩图片...',
      deleteImage: '删除图片',
      moveUp: '向前',
      moveDown: '向后',
      
      settingsTitle: '基础配置',
      heroTitleLabel: '主页大标题',
      heroSubtitleLabel: '主页副标题',
      adminEmailLabel: '接收购买申请的管理员邮箱',
      youtubeChannelLabel: 'YouTube 频道链接',
      saveSettingsBtn: '保存设置',
      settingsSaved: '设置保存成功。',
    },
  },

  // 5. Español
  es: {
    languageName: 'Español',
    nav: {
      home: 'Inicio',
      products: 'Productos',
      videos: 'Videos',
      contact: 'Contacto',
      subscribe: 'Suscribirse',
      admin: 'Admin',
    },
    hero: {
      badge: 'Diseño Certificado para WRO & CoSpace Rescue',
      title: 'Planos y Códigos WRO\nAlgoritmos CoSpace Rescue',
      subtitle: 'Acceda a diseños de hardware robótico probados en torneos mundiales y algoritmos con puntuación perfecta.',
      ctaButton: 'Ver Productos',
      feature1: 'Planos 3D de Precisión (PDF/Studio)',
      feature2: 'Código Python & C++ Verificado',
      feature3: 'Videos de Demostración 100% Reales',
    },
    products: {
      title: 'Nuestros Productos',
      subtitle: 'Guías de construcción y códigos de software de alto rendimiento para robótica de competición.',
      all: 'Todos',
      wro: 'WRO (Guía & Código)',
      cospace: 'CoSpace Rescue (Código Fuente)',
      viewDetails: 'Ver Detalles',
      requestPayment: 'Pedir vía Gmail',
      included: 'Contenido del Paquete',
      drivingVideo: 'Video de Demostración del Robot',
      noVideo: 'Sin video de demostración registrado.',
      close: 'Cerrar',
      priceLabel: 'Precio',
      share: 'Copiar Enlace',
      copied: '¡Copiado!',
      wroBadge: 'WRO Guía + Código',
      cospaceBadge: 'CoSpace Código',
    },
    emailTemplate: {
      subject: (name) => `[Solicitud de Compra] ${name}`,
      body: ({ productName, price, url, orderDate }) => 
`Hola,

Deseo adquirir el siguiente producto:

Producto: ${productName}
Precio: ${price}
Enlace del producto: ${url}
Fecha de solicitud: ${orderDate}

Nombre del comprador: 
Contacto (Teléfono o Correo): 

Por favor respóndame con las instrucciones de pago (PayPal / transferencia bancaria) y el método de entrega de los archivos.

¡Muchas gracias!`,
      openGmail: 'Redactar en Gmail Web',
      fallbackMailto: 'Abrir Aplicación de Correo',
      copyDetails: 'Copiar Datos al Portapapeles',
      copiedSuccess: '¡Detalles de la compra copiados al portapapeles!',
      instruction: 'Al hacer clic se abrirá Gmail con todos los datos completados automáticamente.',
    },
    videos: {
      title: 'Demostraciones y Tutoriales',
      subtitle: 'Observe recorridos reales, tácticas y simulaciones en nuestro canal oficial de YouTube.',
      subscribeBtn: 'Suscribirse en YouTube',
      watchNow: 'Ver Ahora',
      channelLink: 'Ir al Canal',
      openOnYoutube: 'Ver en YouTube',
      moreVideos: 'Ver Más Videos',
    },
    contact: {
      title: 'Consultas y Soporte',
      subtitle: 'Contáctenos para cualquier duda técnica o requerimientos personalizados.',
      emailLabel: 'Correo Oficial',
      telegramLabel: 'Canal Directo',
      messageLabel: 'Mensaje',
      sendDirectEmail: 'Enviar Correo Directo',
      operatingNotice: 'Operación individual: las respuestas suelen enviarse dentro de las 24 horas.',
    },
    admin: {
      title: 'Panel de Administración',
      loginTitle: 'Iniciar Sesión',
      loginDesc: 'Ingrese la contraseña maestra para administrar la tienda.',
      initPasswordTitle: 'Definir Contraseña Inicial',
      initPasswordDesc: 'Primera visita detectada. Defina la contraseña maestra del administrador.',
      passwordPlaceholder: 'Ingrese contraseña',
      confirmPasswordPlaceholder: 'Confirmar contraseña',
      loginBtn: 'Ingresar',
      setPasswordBtn: 'Guardar e Ingresar',
      logoutBtn: 'Cerrar Sesión',
      invalidPassword: 'La contraseña es incorrecta.',
      passwordMismatch: 'Las contraseñas no coinciden.',
      passwordSetSuccess: 'Contraseña maestra guardada con éxito.',
      
      tabProducts: 'Productos',
      tabSettings: 'Ajustes',
      tabBackup: 'Copia de Seguridad',
      
      addProduct: 'Nuevo Producto',
      editProduct: 'Editar Producto',
      deleteProduct: 'Eliminar',
      deleteConfirm: '¿Está seguro de que desea eliminar este producto? Esta acción no se puede deshacer.',
      saveProduct: 'Guardar Producto',
      cancel: 'Cancelar',
      
      fieldCategory: 'Categoría',
      fieldName: 'Nombre del Producto (Coreano original)',
      fieldPrice: 'Precio',
      fieldShortDesc: 'Descripción Breve',
      fieldDesc: 'Descripción Completa',
      fieldIncluded: 'Contenidos Incluidos (Uno por línea)',
      fieldImages: 'Fotos del Producto',
      fieldYoutube: 'URL de Video en YouTube',
      fieldTranslations: 'Traducciones (Opcional)',
      
      uploadImageNotice: 'Admite múltiples imágenes con compresión y optimización automática.',
      dropImageHere: 'Haga clic o arrastre imágenes aquí',
      compressing: 'Comprimiendo imágenes...',
      deleteImage: 'Eliminar foto',
      moveUp: 'Mover izquierda',
      moveDown: 'Mover derecha',
      
      settingsTitle: 'Configuración General',
      heroTitleLabel: 'Título Principal',
      heroSubtitleLabel: 'Subtítulo',
      adminEmailLabel: 'Correo para Recibir Pedidos',
      youtubeChannelLabel: 'URL del Canal de YouTube',
      saveSettingsBtn: 'Guardar Cambios',
      settingsSaved: 'Ajustes guardados con éxito.',
    },
  },
};
