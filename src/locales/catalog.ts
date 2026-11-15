import { LanguageCode, ProductTranslation } from '../types';

// Complete translations for the bundled catalog, including every package item.
export const catalog: Record<string, Partial<Record<LanguageCode, ProductTranslation>>> = {
  'prod-wro-senior-2024': {
    en: {
      name: 'WRO RoboMission Senior 2024 - High-Speed Dual Color Sensor Chassis & Algorithm Package',
      shortDescription: 'High-speed chassis for WRO Senior 2024 with line-following and mission code, including PDF building instructions.',
      description: `A competition robot package designed for top results in WRO RoboMission Senior.

1. Hardware
- A low-center-of-gravity chassis provides stability during high-speed runs.
- Two SPIKE Prime color sensors at the front detect small line curves and intersections in milliseconds.
- Low-friction four-wheel caster support and direct-drive large motors minimize power loss.

2. Software
- Closed-loop proportional-integral-derivative (PID) line following.
- Automatic white/black sensor calibration for changing light and floor surfaces.
- A gyro drift filter corrects accumulated heading errors for precise turns when collecting mission objects.`,
      includedItems: ['High-resolution 3D PDF building instructions (128 steps)', 'Complete LEGO SPIKE Prime MicroPython and Pybricks source code', 'Lighting and sensor calibration tutorial (PDF)', 'Advanced PID line-following library (.py)', '2024 Senior mission sequence and strategy diagrams'],
    },
    ja: {
      name: 'WRO RoboMission Senior 2024 - 高速デュアルカラーセンサーシャーシ＆アルゴリズムセット',
      shortDescription: 'WROシニア2024向けの高速シャーシとライントレース・ミッション実行コード。PDF組立説明書付き。',
      description: `WRO RoboMissionシニア部門で好記録を目指すための競技用ロボットセットです。

1. ハードウェア
- 低重心シャーシにより高速走行時も安定します。
- 車体前方の2個のSPIKE Primeカラーセンサーが細かなカーブや交差点をミリ秒単位で検知します。
- 低摩擦の4輪キャスター支持と大型モーターの直結駆動で動力損失を抑えます。

2. ソフトウェア
- 比例・積分・微分（PID）による閉ループのライントレース制御。
- 照明や床面の変化に対応する白黒センサー自動校正。
- ジャイロの累積誤差を補正し、ミッション物体回収時の旋回角度を正確に保ちます。`,
      includedItems: ['高解像度3D PDF組立説明書（128ステップ）', 'LEGO SPIKE Prime MicroPython・Pybricksの全ソースコード', '照明・センサー校正チュートリアル（PDF）', '高度なPIDライントレースライブラリ（.py）', '2024シニアのミッション順序・戦略図'],
    },
    zh: {
      name: 'WRO RoboMission高级组2024 - 高速双颜色传感器底盘与算法套装',
      shortDescription: '适用于WRO高级组2024的高速底盘、巡线与任务执行代码，附PDF搭建说明。',
      description: `专为WRO RoboMission高级组比赛设计的机器人套装。

1. 硬件结构
- 低重心底盘保持高速行驶的稳定性。
- 车体前端的两个SPIKE Prime颜色传感器以毫秒级速度检测细小弯道和交叉路口。
- 低摩擦四轮脚轮支撑与大型电机直驱结构减少动力损耗。

2. 软件算法
- 比例、积分、微分（PID）闭环巡线控制。
- 根据照明和地面变化自动校准黑白传感器。
- 陀螺仪漂移滤波器修正累积航向误差，确保收集任务物体时准确转弯。`,
      includedItems: ['高清3D PDF搭建说明（128步）', '完整LEGO SPIKE Prime MicroPython与Pybricks源代码', '照明与传感器校准教程（PDF）', '高级PID巡线算法库（.py）', '2024高级组任务顺序与策略图'],
    },
    es: {
      name: 'WRO RoboMission Senior 2024 - Chasis rápido de doble sensor de color y algoritmos',
      shortDescription: 'Chasis rápido para WRO Senior 2024 con código de seguimiento de línea y misiones, y guía de construcción PDF.',
      description: `Paquete de robot de competición diseñado para conseguir buenos resultados en WRO RoboMission Senior.

1. Hardware
- Chasis de centro de gravedad bajo para mantener la estabilidad a alta velocidad.
- Dos sensores de color SPIKE Prime delanteros detectan curvas e intersecciones en milisegundos.
- Apoyo de cuatro ruedas con baja fricción y motores grandes de transmisión directa para reducir pérdidas de potencia.

2. Software
- Seguimiento de línea en bucle cerrado con control proporcional-integral-derivativo (PID).
- Calibración automática de blanco y negro ante cambios de iluminación y suelo.
- Filtro de deriva del giroscopio que corrige errores acumulados para realizar giros precisos al recoger objetos.`,
      includedItems: ['Guía de construcción 3D PDF de alta resolución (128 pasos)', 'Código fuente completo de LEGO SPIKE Prime MicroPython y Pybricks', 'Tutorial de calibración de iluminación y sensores (PDF)', 'Biblioteca avanzada de seguimiento de línea PID (.py)', 'Diagramas de secuencia y estrategia de misiones Senior 2024'],
    },
  },
  'prod-wro-junior-2024': {
    en: {
      name: 'WRO RoboMission Junior 2024 - Compact Passive Rack-and-Pinion Gripper Robot',
      shortDescription: 'Passive gear mechanism and SPIKE code designed to improve mission reliability without an auxiliary motor.',
      description: `A lightweight, efficient robot for gripping mission blocks and placing them accurately on the WRO Junior 2024 field.

1. Mechanism
- Uses forward/reverse chassis movement and a passive ratchet gear to hold objects firmly without an additional motor.
- A compact body less than 18 cm wide turns freely in narrow mission areas.

2. Software
- Includes both SPIKE App v3 block programs (.llsp3) and Python scripts.
- Step-by-step functions and detailed comments help beginners understand the program.`,
      includedItems: ['3D-rendered digital building instructions (PDF)', 'LEGO SPIKE Prime App v3 block program (.llsp3)', 'Original MicroPython source code (.py)', 'Wall-squaring function for object alignment', 'LEGO bill of materials (BOM) and alternative parts guide'],
    },
    ja: {
      name: 'WRO RoboMission Junior 2024 - 小型パッシブ・ラック＆ピニオングリッパーロボット',
      shortDescription: '補助モーターを使わずミッションの安定性を高めるパッシブギア機構とSPIKEコード。',
      description: `WROジュニア2024のミッションブロックをつかみ、目標位置へ正確に置くための軽量・高効率ロボットです。

1. 機構
- 車体の前進・後退とパッシブラチェットギアを利用し、追加モーターなしで物体を固定します。
- 車幅18cm未満の小型構造で、狭いミッションエリアでも自由に旋回できます。

2. ソフトウェア
- SPIKE App v3のブロックプログラム（.llsp3）とPythonスクリプトを同梱。
- 初心者にも理解しやすい段階別の関数構成と詳しいコメント付き。`,
      includedItems: ['3Dレンダリングのデジタル組立説明書（PDF）', 'LEGO SPIKE Prime App v3ブロックプログラム（.llsp3）', 'MicroPythonのオリジナルソースコード（.py）', '物体整列用の壁当て補正関数', 'LEGO部品表（BOM）と代替部品ガイド'],
    },
    zh: {
      name: 'WRO RoboMission初级组2024 - 紧凑型被动齿条齿轮夹爪机器人',
      shortDescription: '无需辅助电机的被动齿轮机构与SPIKE代码，提高任务执行稳定性。',
      description: `轻量高效的机器人，可在WRO初级组2024场地抓取任务积木并准确放置到目标位置。

1. 机械结构
- 利用底盘前进、后退及被动棘轮齿轮固定物体，无需额外电机。
- 车宽小于18厘米，可在狭窄任务区域自由转向。

2. 软件程序
- 同时提供SPIKE App v3积木程序（.llsp3）和Python脚本。
- 分步骤模块化函数与详细注释便于初学者理解。`,
      includedItems: ['3D渲染数字搭建说明（PDF）', 'LEGO SPIKE Prime App v3积木程序（.llsp3）', 'MicroPython原始源代码（.py）', '用于物体对齐的贴墙校正函数', 'LEGO零件清单（BOM）与替代零件指南'],
    },
    es: {
      name: 'WRO RoboMission Junior 2024 - Robot compacto con pinza pasiva de cremallera y piñón',
      shortDescription: 'Mecanismo pasivo de engranajes y código SPIKE para mejorar la fiabilidad sin un motor auxiliar.',
      description: `Robot ligero y eficiente para sujetar bloques y colocarlos con precisión en el campo WRO Junior 2024.

1. Mecanismo
- Usa el movimiento hacia delante y atrás del chasis y un trinquete pasivo para sujetar objetos sin motor adicional.
- Su anchura inferior a 18 cm permite girar en zonas estrechas.

2. Software
- Incluye programas de bloques SPIKE App v3 (.llsp3) y scripts Python.
- Funciones organizadas por pasos y comentarios detallados para principiantes.`,
      includedItems: ['Instrucciones de construcción digitales renderizadas en 3D (PDF)', 'Programa de bloques LEGO SPIKE Prime App v3 (.llsp3)', 'Código fuente original MicroPython (.py)', 'Función de alineación contra la pared', 'Lista de piezas LEGO (BOM) y guía de alternativas'],
    },
  },
  'prod-cospace-rescue-2024': {
    en: {
      name: 'CoSpace Rescue Virtual Challenge - AI Pathfinding & Color Collection Algorithm',
      shortDescription: 'C++ / Python dynamic A* obstacle avoidance and automatic color collection for the CoSpace Rescue simulator.',
      description: `An autonomous navigation algorithm package optimized for scoring in the CoSpace Rescue virtual competition.

1. Core algorithms
- Hybrid pathfinding combines dynamic A* with potential fields.
- Projects unknown moving obstacles, teleport zones and penalty areas onto a real-time grid map to avoid hazards.
- Recalculates efficient shortest paths using red, green and black object weights based on color sensor sensitivity.

2. Source code and setup
- Includes both C++ and Python versions for testing in your preferred environment.
- Includes a tuning-parameter header file for direct simulator integration tests.`,
      includedItems: ['Complete CoSpace Rescue C++ project (.cpp / .h)', 'Simulator-integrated Python AI scripts (.py)', 'Dynamic A* pathfinding core library', 'Obstacle avoidance and hazard detection tuning guide (PDF)', 'Local simulator setup and demonstration video guide'],
    },
    ja: {
      name: 'CoSpace Rescue Virtual Challenge - AI経路探索＆色物体収集アルゴリズム',
      shortDescription: 'CoSpace Rescue向けC++・Pythonの動的A*障害物回避と色物体自動収集アルゴリズム。',
      description: `CoSpace Rescue仮想競技での得点効率を高める自律走行アルゴリズムセットです。

1. 主なアルゴリズム
- 動的A*とポテンシャル場を組み合わせた経路探索。
- 未知の移動障害物、テレポートゾーン、減点領域をリアルタイムのグリッド地図へ反映して危険を回避。
- カラーセンサーの感度に基づき赤・緑・黒の物体に重みを付け、得点効率の高い最短経路を再計算。

2. ソースコードと環境設定
- C++版とPython版を同梱し、お好みの環境でテストできます。
- シミュレーター連携テスト用の調整パラメーターヘッダーファイル付き。`,
      includedItems: ['CoSpace Rescueの全C++プロジェクト（.cpp / .h）', 'シミュレーター連携Python AIスクリプト（.py）', '動的A*経路探索コアライブラリ', '障害物回避・危険領域検知の調整ガイド（PDF）', 'ローカル環境設定・実行デモ動画ガイド'],
    },
    zh: {
      name: 'CoSpace Rescue Virtual Challenge - AI寻路与颜色物体收集算法',
      shortDescription: '用于CoSpace Rescue的C++和Python动态A*避障及颜色物体自动收集算法。',
      description: `针对CoSpace Rescue虚拟比赛得分效率优化的自主导航算法套装。

1. 核心算法
- 结合动态A*与势场法的混合寻路。
- 将未知移动障碍物、传送区域和扣分区域实时投影到网格地图，提前规避风险。
- 根据颜色传感器灵敏度计算红、绿、黑色物体权重，实时重算得分效率较高的最短路线。

2. 源代码与环境配置
- 同时提供C++与Python版本，方便在所需环境测试。
- 提供可与模拟器直接联调的参数头文件。`,
      includedItems: ['完整CoSpace Rescue C++项目（.cpp / .h）', '模拟器联动Python AI脚本（.py）', '动态A*寻路核心算法库', '避障与危险区域检测参数调试指南（PDF）', '本地模拟器环境配置与运行演示视频指南'],
    },
    es: {
      name: 'CoSpace Rescue Virtual Challenge - Algoritmo de rutas con IA y recogida por color',
      shortDescription: 'Algoritmos C++ y Python de evasión de obstáculos con A* dinámico y recogida automática por color.',
      description: `Paquete de navegación autónoma optimizado para mejorar la puntuación en CoSpace Rescue.

1. Algoritmos principales
- Búsqueda de rutas híbrida con A* dinámico y campos potenciales.
- Proyecta obstáculos móviles desconocidos, zonas de teletransporte y penalización en un mapa de cuadrícula en tiempo real para evitar riesgos.
- Recalcula rutas cortas y eficientes ponderando los objetos rojos, verdes y negros según la sensibilidad del sensor de color.

2. Código fuente y entorno
- Incluye versiones C++ y Python para probar en el entorno preferido.
- Incluye un archivo de cabecera de parámetros de ajuste para pruebas integradas con el simulador.`,
      includedItems: ['Proyecto C++ completo de CoSpace Rescue (.cpp / .h)', 'Scripts de IA Python integrados con el simulador (.py)', 'Biblioteca principal de búsqueda A* dinámica', 'Guía de ajuste de evasión de obstáculos y detección de riesgos (PDF)', 'Guía en vídeo de configuración local y demostración del simulador'],
    },
  },
};

export const videoTitles: Record<Exclude<LanguageCode, 'ko'>, string[]> = {
  en: ['WRO RoboMission Senior 2024 - Full-score course demonstration (Dual Color Sensor PID Run)', 'WRO RoboMission Junior 2024 - Passive rack-and-pinion gripper loading test', 'CoSpace Rescue Virtual Challenge - Dynamic A* obstacle avoidance simulation', 'LEGO SPIKE Prime - Gyro drift correction and line-following tutorial', 'WRO - High-speed motor gear ratios and torque optimization guide', 'CoSpace Rescue - Color sensor calibration and teleport zone detection'],
  ja: ['WRO RoboMission Senior 2024 - 満点コース走行デモ（デュアルカラーセンサーPID走行）', 'WRO RoboMission Junior 2024 - パッシブ・ラック＆ピニオングリッパーの積載テスト', 'CoSpace Rescue Virtual Challenge - 動的A*障害物回避シミュレーション', 'LEGO SPIKE Prime - ジャイロ累積誤差補正とライントレース解説', 'WRO - 高速モーターのギア比選定とトルク最適化ガイド', 'CoSpace Rescue - カラーセンサー校正とテレポートゾーン検知'],
  zh: ['WRO RoboMission高级组2024 - 满分全程演示（双颜色传感器PID巡线）', 'WRO RoboMission初级组2024 - 被动齿条齿轮夹爪装载测试', 'CoSpace Rescue Virtual Challenge - 动态A*避障模拟演示', 'LEGO SPIKE Prime - 陀螺仪累积漂移校正与巡线教程', 'WRO - 高速电机齿轮比选择与扭矩优化指南', 'CoSpace Rescue - 颜色传感器校准与传送区域检测'],
  es: ['WRO RoboMission Senior 2024 - Demostración de recorrido completo (PID con doble sensor de color)', 'WRO RoboMission Junior 2024 - Prueba de carga de pinza pasiva de cremallera y piñón', 'CoSpace Rescue Virtual Challenge - Simulación de evasión de obstáculos con A* dinámico', 'LEGO SPIKE Prime - Corrección de deriva del giroscopio y seguimiento de línea', 'WRO - Guía de relaciones de engranajes y optimización de par del motor', 'CoSpace Rescue - Calibración del sensor de color y detección de teletransporte'],
};
