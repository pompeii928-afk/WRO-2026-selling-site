/**
 * @file storage.ts
 * @description 로컬 저장소(localStorage) 기반 영구 저장 및 초기 샘플 데이터 관리 유틸리티
 */

import { Product, StoreSettings } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'ROBO_STORE_PRODUCTS_V2',
  SETTINGS: 'ROBO_STORE_SETTINGS_V2',
  ADMIN_PASSWORD: 'ROBO_STORE_ADMIN_PASSWORD_HASH',
  ACTIVE_SESSION: 'ROBO_STORE_ADMIN_SESSION',
  LANGUAGE: 'ROBO_STORE_LANGUAGE',
};

// 기본 초기 샘플 제품 3종 (WRO 2종 + CoSpace 1종)
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-wro-senior-2024',
    category: 'WRO',
    name: 'WRO RoboMission Senior 2024 - 초고속 듀얼 컬러 센서 섀시 & 알고리즘 풀패키지',
    price: 48000,
    currency: 'KRW',
    shortDescription: '2024 WRO 시니어 규격 맞춤 고속 주행 기구부와 완벽한 라인트레이싱/미션 수행 소스코드 (PDF 조립도 포함)',
    description: `WRO RoboMission 시니어 부문에서 최고의 기록을 달성하기 위해 설계된 경기용 로봇 패키지입니다.

1. 하드웨어 구조적 특징
- 무게 중심이 극대화된 저중심 섀시로 설계되어 고속 주행 중에도 흔들림 없는 완벽한 안정성을 자랑합니다.
- 초정밀 듀얼 컬러 센서(SPIKE Prime Color Sensors)를 차체 최전방에 배치하여 미세한 라인 굴곡 및 교차로를 밀리초(ms) 단위로 감지합니다.
- 4바퀴 저마찰 캐스터 및 고출력 라지 모터를 직결하여 동력 손실을 최소화했습니다.

2. 소프트웨어 알고리즘 특징
- 비례-미분-적분(PID) 폐루프 선 추적 제어 알고리즘 탑재
- 조명 및 바닥 재질 변화에 대응하는 자동 화이트/블랙 센서 캘리브레이션 모듈 포함
- 미션 오브젝트 수거 시 정확한 각도 회전을 보장하는 자이로 오차 누적 보정(Gyro Drift Filter) 탑재`,
    includedItems: [
      '단계별 초고화질 3D PDF 조립 설명서 (총 128단계)',
      'LEGO Spike Prime MicroPython 및 Pybricks 소스코드 전체',
      '조명 보정 및 센서 캘리브레이션 튜토리얼 매뉴얼 (PDF)',
      '고급 PID 라인트레이싱 알고리즘 라이브러리 (.py)',
      '2024 시니어 미션 공략 순서 및 전략 다이어그램',
    ],
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=S2fFv3y29O8',
    translations: {
      en: {
        name: 'WRO RoboMission Senior 2024 - High-Speed Dual Sensor Chassis & Algorithm Full Package',
        shortDescription: 'Competition-grade high-speed robot chassis with perfect PID line-following and mission execution Python code.',
        description: 'Engineered for maximum reliability and peak scores in the WRO Senior RoboMission division. Includes ultra-low center of gravity chassis, high-precision dual-color sensor placement, full PID control algorithm, and 128-step high-definition 3D PDF building guide.',
        includedItems: [
          'High-Definition 3D PDF Building Guide (128 Steps)',
          'Complete LEGO Spike Prime MicroPython & Pybricks Source Codes',
          'Lighting Calibration & Dual Color Sensor Tuning Manual (PDF)',
          'Advanced Proportional-Integral-Derivative (PID) Control Library',
          'Mission Sequence & Strategy Flowchart',
        ],
      },
      ja: {
        name: 'WRO RoboMission Senior 2024 - 高速デュアルセンサーシャーシ & アルゴリズム パッケージ',
        shortDescription: 'WROシニア部門向け高精度シャーシ組立図とPIDライントレース・ミッション攻略コードセット。',
        description: 'WRO RoboMissionシニア部門で満点を狙うための競技専用ロボットです。低重心設計と最先端デュアルセンサー配置により、急カーブでも安定して最高速度を維持します。',
      },
      zh: {
        name: 'WRO RoboMission 高级组 2024 - 高速双巡线底盘与满分算法全套方案',
        shortDescription: '专为高级组设计的低重心高刚性结构图纸与高精度PID巡线算法源代码（含3D PDF图纸）。',
        description: '在国际大赛中经过数十次实车测试验证的优秀方案。低重心结构彻底消除晃动，配合微秒级响应的PID算法与陀螺仪航向修正，实现满分稳定运行。',
      },
      es: {
        name: 'WRO RoboMission Senior 2024 - Chasis de Alta Velocidad y Algoritmo Completo',
        shortDescription: 'Chasis optimizado para competición con algoritmo PID y guía 3D paso a paso en PDF.',
        description: 'Diseñado específicamente para la categoría Senior de WRO. Ofrece máxima estabilidad mecánica, doble sensor de color frontal y control PID de alta precisión.',
      },
    },
    createdAt: '2024-03-10',
  },
  {
    id: 'prod-wro-junior-2024',
    category: 'WRO',
    name: 'WRO RoboMission Junior 2024 - 콤팩트 패시브 랙 앤 피니언 그리퍼 로봇',
    price: 39000,
    currency: 'KRW',
    shortDescription: '보조 모터 소모를 없애고 미션 성공률을 극대화한 스마트 패시브 기어 메커니즘과 스파이크 코드',
    description: `2024 WRO 주니어 경기장의 다양한 미션 블록을 정밀하게 파지하고 목표 지점에 배치할 수 있는 경량 고효율 로봇입니다.

1. 하드웨어 메커니즘
- 보조 모터를 추가하지 않고 차체의 전진/후진 모멘텀과 패시브 래칫(Passive Ratchet) 기어를 활용해 오브젝트를 단단히 고정하는 특수 메커니즘 설계.
- 차체 폭 18cm 이내의 초소형 규격으로 좁은 미션 구역에서도 간섭 없이 자유롭게 회전 가능.

2. 소프트웨어 프로그램
- Spike App v3 블록 코딩 파일(.llsp3)과 순수 Python 스크립트 동시 제공.
- 초보 학생도 쉽게 이해할 수 있는 단계별 함수 모듈화 및 풍부한 주석 포함.`,
    includedItems: [
      '3D 렌더링 디지털 조립 설명서 (PDF 파일)',
      'LEGO Spike Prime 공식 App v3 블록 코드 (.llsp3)',
      'MicroPython 원본 소스코드 (.py)',
      '오브젝트 정렬을 위한 벽면 밀착(Squaring) 함수 코드',
      '사용된 레고 부품 목록(BOM) 및 대체 부품 가이드',
    ],
    images: [
      'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=b0bA3YxZvxA',
    translations: {
      en: {
        name: 'WRO RoboMission Junior 2024 - Compact Passive Rack & Pinion Gripper Robot',
        shortDescription: 'Smart passive gear gripper mechanism eliminating extra motor weight with Spike Prime Python & Block code.',
        description: 'Compact and agile robot designed for WRO Junior 2024 missions. Utilizes innovative mechanical linkages to actuate grippers purely from chassis movement, leaving all drive motor torque intact.',
      },
    },
    createdAt: '2024-03-15',
  },
  {
    id: 'prod-cospace-rescue-2024',
    category: 'CoSpace',
    name: 'CoSpace Rescue Virtual Challenge - AI 길찾기 & 색상 수집 최적화 알고리즘',
    price: 55000,
    currency: 'KRW',
    shortDescription: 'CoSpace Rescue 가상 시뮬레이터 만점을 위한 C++ / Python 기반 동적 A* 장애물 회피 및 스와치 자동 수집 알고리즘',
    description: `CoSpace Rescue 가상 시뮬레이션 대회에서 최고 득점을 획득할 수 있도록 정밀하게 최적화된 자율주행 알고리즘 패키지입니다.

1. 핵심 알고리즘 특징
- 동적 A* (Dynamic A-Star) 및 포텐셜 필드(Potential Field)를 결합한 하이브리드 경로 탐색.
- 미지의 동적 장애물과 텔레포트 존, 감점 지대를 실시간 그리드 맵에 자동 투영하여 위험 구역을 사전에 완벽 회피.
- 색상 센서 감도에 따른 적색/녹색/흑색 오브젝트 가중치 계산으로 점수 효율이 가장 높은 최단 경로를 실시간 재계산.

2. 소스코드 및 환경 구성
- C++ 및 Python 버전 동시 제공으로 원하는 환경에서 바로 테스트 가능.
- 시뮬레이터와 1:1 연동 테스트가 가능한 튜닝 파라미터 헤더 파일 제공.`,
    includedItems: [
      'CoSpace Rescue C++ 풀 소스코드 프로젝트 파일 (.cpp / .h)',
      '시뮬레이터 연동 Python AI 알고리즘 스크립트 (.py)',
      '동적 A* (Dynamic A-Star) 패스파인딩 핵심 라이브러리',
      '장애물 회피 및 위험 존 감지 파라미터 튜닝 가이드북 (PDF)',
      '시뮬레이터 로컬 환경 세팅 및 실행 데모 비디오 가이드',
    ],
    images: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=kYJvYg_V408',
    translations: {
      en: {
        name: 'CoSpace Rescue Virtual Challenge - AI Pathfinding & Swatch Collector Algorithm',
        shortDescription: 'State-of-the-art C++ & Python Dynamic A* obstacle evasion and color swatch collection algorithm for CoSpace Rescue.',
        description: 'Comprehensive autonomous algorithm designed to maximize scoring efficiency in the CoSpace Rescue simulator. Incorporates dynamic grid mapping, hazardous teleport evasion, and intelligent multi-objective target planning.',
      },
    },
    createdAt: '2024-03-20',
  },
];

// 기본 사이트 전역 설정
export const DEFAULT_SETTINGS: StoreSettings = {
  heroTitle: 'WRO 로봇 조립도 & 소스코드\nCoSpace Rescue 알고리즘 마켓',
  heroSubtitle: '국제 대회에서 입증된 안정적인 하드웨어 설계와 미션 만점 알고리즘 소스코드를 만나보세요.',
  heroButtonText: '제품 보러가기',
  adminEmail: 'pompeii928@gmail.com',
  youtubeChannelUrl: 'https://www.youtube.com/channel/UC_o1n4QCZyABlKCdxI7cFPA',
  customLogoUrl: '/custom_logo.png',
};

// 제품 목록 불러오기
export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      // 초기 샘플 저장
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PRODUCTS;
  } catch (err) {
    console.error('제품 로딩 실패:', err);
    return DEFAULT_PRODUCTS;
  }
}

// 제품 목록 저장하기
export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('제품 저장 실패:', err);
  }
}

// 사이트 설정 불러오기
export function loadSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      customLogoUrl: parsed.customLogoUrl || DEFAULT_SETTINGS.customLogoUrl,
    };
  } catch (err) {
    console.error('설정 로딩 실패:', err);
    return DEFAULT_SETTINGS;
  }
}

// 사이트 설정 저장하기
export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('설정 저장 실패:', err);
  }
}

// SHA-256 해시 함수
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 비밀번호 설정 여부 확인
export function hasAdminPassword(): boolean {
  return !!localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
}

// 비밀번호 신규 설정
export async function setAdminPassword(password: string): Promise<void> {
  const hash = await hashString(password);
  localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, hash);
}

// 비밀번호 검증
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
  if (!storedHash) return false;
  const inputHash = await hashString(password);
  return storedHash === inputHash;
}

// 관리자 세션 상태 관리
export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) === 'true';
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }
}

// 백업 데이터 JSON 파일로 내보내기
export function exportBackupJson(): void {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    products: loadProducts(),
    settings: loadSettings(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `robo-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 백업 데이터 JSON 파일로부터 복원하기
export function importBackupJson(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.products || !Array.isArray(data.products)) {
      return { success: false, message: '올바른 백업 파일 형식이 아닙니다 (제품 목록 누락).' };
    }
    saveProducts(data.products);
    if (data.settings) {
      saveSettings(data.settings);
    }
    return { success: true, message: '성공적으로 복원되었습니다!' };
  } catch {
    return { success: false, message: 'JSON 파싱 중 오류가 발생했습니다.' };
  }
}
