/**
 * @file AdminPage.tsx
 * @description 스토어 관리자 센터
 * - 마스터 비밀번호 설정 및 세션 기반 보안 로그인
 * - 제품 추가, 수정, 삭제 ("정말 삭제하시겠습니까?" 확인창)
 * - 사진 다중 업로드 (캔버스 자동 리사이징 & 압축, 순서 변경, 개별 삭제)
 * - 홈 화면 문구, 결제 요청 수신 이메일, 유튜브 채널 주소 변경
 * - 다국어 번역 입력 지원 (비워두면 한국어 폴백)
 * - JSON 백업 다운로드 및 복원
 * - 모바일 완전 반응형 지원
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  FileUp, 
  Settings, 
  Package, 
  Languages, 
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
  FolderKanban,
  Youtube,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LanguageCode, Product, StoreSettings, ProductCategory } from '../types';
import { 
  hasAdminPassword, 
  setAdminPassword, 
  verifyAdminPassword, 
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  loadProducts, 
  saveProducts, 
  loadSettings, 
  saveSettings,
  exportBackupJson,
  importBackupJson,
  DEFAULT_PRODUCTS,
  DEFAULT_SETTINGS
} from '../utils/storage';
import { compressImage } from '../utils/imageCompressor';
import { extractYoutubeId } from '../utils/youtube';

interface AdminPageProps {
  currentLang: LanguageCode;
  onExit: () => void;
  onDataChange?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ currentLang, onExit, onDataChange }) => {
  // 인증 상태
  const [isPasswordConfigured, setIsPasswordConfigured] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // 로그인/초기설정 폼 상태
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // 탭 상태
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'backup' | 'languages'>('products');

  // 데이터 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  // 카테고리 관리 상태
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // 제품 편집 모달/폼 상태
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [compressingPhotos, setCompressingPhotos] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // 제품 편집 임시 폼 필드
  const [formCategory, setFormCategory] = useState<ProductCategory>('WRO');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(45000);
  const [formCurrency, setFormCurrency] = useState('KRW');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIncludedText, setFormIncludedText] = useState('');
  const [formYoutubeUrl, setFormYoutubeUrl] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);

  // 다국어 번역 폼 탭 및 데이터
  const [selectedTransLang, setSelectedTransLang] = useState<'en' | 'ja' | 'zh' | 'es'>('en');
  const [transName, setTransName] = useState<Record<string, string>>({});
  const [transShortDesc, setTransShortDesc] = useState<Record<string, string>>({});
  const [transDesc, setTransDesc] = useState<Record<string, string>>({});
  const [transIncludedText, setTransIncludedText] = useState<Record<string, string>>({});

  // 파일 인풋 참조
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // 초기 상태 로드
  useEffect(() => {
    const configured = hasAdminPassword();
    setIsPasswordConfigured(configured);
    const authed = isAdminAuthenticated();
    setIsAuthenticated(authed);

    if (authed) {
      setProducts(loadProducts());
      setSettings(loadSettings());
    }
  }, []);

  // 피드백 알림 타이머
  const showFeedback = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  // 1. 초기 비밀번호 설정 처리
  const handleSetInitialPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!passwordInput || passwordInput.length < 4) {
      setAuthError('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setAuthError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    await setAdminPassword(passwordInput);
    setAdminAuthenticated(true);
    setIsPasswordConfigured(true);
    setIsAuthenticated(true);
    setProducts(loadProducts());
    setSettings(loadSettings());
    setAuthSuccess('관리자 비밀번호가 성공적으로 설정되었습니다!');
    setPasswordInput('');
    setConfirmPasswordInput('');
  };

  // 2. 관리자 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const isValid = await verifyAdminPassword(passwordInput);
    if (isValid) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setProducts(loadProducts());
      setSettings(loadSettings());
      setPasswordInput('');
    } else {
      setAuthError('비밀번호가 올바르지 않습니다. 다시 입력해주세요.');
    }
  };

  // 3. 로그아웃 처리
  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // 제품 등록 폼 열기
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    const availableCats = settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace'];
    setFormCategory(availableCats[0]);
    setFormName('');
    setFormPrice(45000);
    setFormCurrency('KRW');
    setFormShortDesc('');
    setFormDesc('');
    setFormIncludedText('고해상도 3D 조립 설명서 (PDF)\nLEGO Spike Prime / EV3 원본 소스코드\n센서 보정 및 경기장 튜닝 가이드');
    setFormYoutubeUrl('');
    setFormImages([]);
    setTransName({});
    setTransShortDesc({});
    setTransDesc({});
    setTransIncludedText({});
    setIsEditingProduct(true);
  };

  // 제품 수정 폼 열기
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setFormCategory(prod.category);
    setFormName(prod.name);
    setFormPrice(prod.price);
    setFormCurrency(prod.currency || 'KRW');
    setFormShortDesc(prod.shortDescription);
    setFormDesc(prod.description);
    setFormIncludedText((prod.includedItems || []).join('\n'));
    setFormYoutubeUrl(prod.youtubeUrl || '');
    setFormImages(prod.images || []);

    // 번역 데이터 로드
    const tNames: Record<string, string> = {};
    const tShorts: Record<string, string> = {};
    const tDescs: Record<string, string> = {};
    const tIncludeds: Record<string, string> = {};

    const langs: ('en' | 'ja' | 'zh' | 'es')[] = ['en', 'ja', 'zh', 'es'];
    langs.forEach((l) => {
      const item = prod.translations?.[l];
      if (item) {
        if (item.name) tNames[l] = item.name;
        if (item.shortDescription) tShorts[l] = item.shortDescription;
        if (item.description) tDescs[l] = item.description;
        if (item.includedItems) tIncludeds[l] = item.includedItems.join('\n');
      }
    });

    setTransName(tNames);
    setTransShortDesc(tShorts);
    setTransDesc(tDescs);
    setTransIncludedText(tIncludeds);
    setIsEditingProduct(true);
  };

  // [3. 사진 업로드]: 이미지 다중 선택 및 브라우저 자동 압축 처리
  const handleImageFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setCompressingPhotos(true);
    try {
      const compressedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const compressed = await compressImage(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 });
          compressedUrls.push(compressed);
        }
      }
      setFormImages((prev) => [...prev, ...compressedUrls]);
      showFeedback(`${compressedUrls.length}장의 사진이 최적화되어 등록되었습니다.`);
    } catch {
      alert('이미지 최적화 중 오류가 발생했습니다.');
    } finally {
      setCompressingPhotos(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 사진 삭제
  const handleDeleteImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 사진 순서 변경 (좌로 이동)
  const handleMoveImageLeft = (index: number) => {
    if (index === 0) return;
    setFormImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // 사진 순서 변경 (우로 이동)
  const handleMoveImageRight = (index: number) => {
    if (index >= formImages.length - 1) return;
    setFormImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // 제품 저장 처리 (추가 또는 수정)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('제품명을 입력해주세요.');
      return;
    }

    // 포함 항목 엔터 단위 파싱
    const includedItems = formIncludedText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // 번역 데이터 구조화
    const translationsData: Product['translations'] = {};
    const langs: ('en' | 'ja' | 'zh' | 'es')[] = ['en', 'ja', 'zh', 'es'];
    langs.forEach((l) => {
      const nameVal = transName[l]?.trim();
      const shortVal = transShortDesc[l]?.trim();
      const descVal = transDesc[l]?.trim();
      const incVal = transIncludedText[l]
        ? transIncludedText[l].split('\n').map((s) => s.trim()).filter((s) => s.length > 0)
        : undefined;

      if (nameVal || shortVal || descVal || incVal) {
        translationsData[l] = {
          name: nameVal || undefined,
          shortDescription: shortVal || undefined,
          description: descVal || undefined,
          includedItems: incVal || undefined,
        };
      }
    });

    let updatedList: Product[];
    if (editingProductId) {
      // 기존 수정
      updatedList = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            category: formCategory,
            name: formName,
            price: formPrice,
            currency: formCurrency,
            shortDescription: formShortDesc,
            description: formDesc,
            includedItems,
            images: formImages.length > 0 ? formImages : p.images,
            youtubeUrl: formYoutubeUrl,
            translations: translationsData,
          };
        }
        return p;
      });
      showFeedback('제품이 성공적으로 수정되었습니다.');
    } else {
      // 신규 추가
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        category: formCategory,
        name: formName,
        price: formPrice,
        currency: formCurrency,
        shortDescription: formShortDesc,
        description: formDesc,
        includedItems,
        images: formImages.length > 0 ? formImages : [
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
        ],
        youtubeUrl: formYoutubeUrl,
        translations: translationsData,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      updatedList = [newProd, ...products];
      showFeedback('새 제품이 성공적으로 등록되었습니다.');
    }

    setProducts(updatedList);
    saveProducts(updatedList);
    setIsEditingProduct(false);
    onDataChange?.();
  };

  // 제품 삭제 처리 ("정말 삭제하시겠습니까?" 확인창)
  const handleDeleteProduct = (productId: string, productName: string) => {
    const ok = window.confirm(`[확인] "${productName}" 제품을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);
    if (ok) {
      const filtered = products.filter((p) => p.id !== productId);
      setProducts(filtered);
      saveProducts(filtered);
      showFeedback('제품이 삭제되었습니다.');
      onDataChange?.();
    }
  };

  // 사이트 전역 설정 저장
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    showFeedback('사이트 설정이 성공적으로 저장되었습니다.');
    onDataChange?.();
  };

  // ==========================================
  // [카테고리 관리 핸들러]
  // ==========================================
  
  // 새 카테고리 추가
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryInput.trim();
    if (!trimmed) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    const currentCats = settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace'];
    if (currentCats.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      alert('이미 존재하는 카테고리 이름입니다.');
      return;
    }

    const updatedCats = [...currentCats, trimmed];
    const updatedSettings: StoreSettings = {
      ...settings,
      categories: updatedCats,
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    setNewCategoryInput('');
    showFeedback(`"${trimmed}" 카테고리가 새로 추가되었습니다.`);
    onDataChange?.();
  };

  // 카테고리 이름 편집 시작
  const handleStartEditCategory = (index: number, name: string) => {
    setEditingCategoryIndex(index);
    setEditingCategoryName(name);
  };

  // 카테고리 이름 수정 완료 (관련 제품 카테고리도 자동 일괄 변경)
  const handleSaveEditCategory = (oldName: string) => {
    const trimmed = editingCategoryName.trim();
    if (!trimmed) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }
    if (trimmed === oldName) {
      setEditingCategoryIndex(null);
      return;
    }

    const currentCats = settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace'];
    if (currentCats.some((c, i) => i !== editingCategoryIndex && c.toLowerCase() === trimmed.toLowerCase())) {
      alert('이미 등록된 다른 카테고리 이름입니다.');
      return;
    }

    const updatedCats = currentCats.map((c) => (c === oldName ? trimmed : c));

    // 유튜브 노출 카테고리가 해당 카테고리였을 경우 함께 업데이트
    let updatedYoutubeCat = settings.youtubeDisplayCategory;
    if (settings.youtubeDisplayCategory === oldName) {
      updatedYoutubeCat = trimmed;
    }

    const updatedSettings: StoreSettings = {
      ...settings,
      categories: updatedCats,
      youtubeDisplayCategory: updatedYoutubeCat,
    };

    // 기존 제품들 중 해당 카테고리를 쓰던 제품의 카테고리도 자동 동기화!
    let updatedProdCount = 0;
    const updatedProducts = products.map((p) => {
      if (p.category === oldName) {
        updatedProdCount++;
        return { ...p, category: trimmed };
      }
      return p;
    });

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    if (updatedProdCount > 0) {
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
    setEditingCategoryIndex(null);
    showFeedback(`카테고리명이 "${trimmed}"(으)로 변경되었습니다. (제품 ${updatedProdCount}개 자동 동기화)`);
    onDataChange?.();
  };

  // 카테고리 삭제 (제품이 있을 경우 첫 번째 카테고리로 안전 이동)
  const handleDeleteCategory = (catToDelete: string) => {
    const currentCats = settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace'];
    if (currentCats.length <= 1) {
      alert('스토어 운영을 위해 최소 1개 이상의 카테고리가 유지되어야 합니다.');
      return;
    }

    const attachedCount = products.filter((p) => p.category === catToDelete).length;
    let msg = `정말 "${catToDelete}" 카테고리를 삭제하시겠습니까?`;
    if (attachedCount > 0) {
      msg += `\n\n[안내] 이 카테고리에 속한 제품이 ${attachedCount}개 있습니다. 삭제 시 기본 카테고리로 자동 이동됩니다.`;
    }

    if (!window.confirm(msg)) return;

    const remainingCats = currentCats.filter((c) => c !== catToDelete);
    const fallbackCat = remainingCats[0];

    // 유튜브 노출 카테고리가 삭제된 경우 ALL로 리셋
    let updatedYoutubeCat = settings.youtubeDisplayCategory;
    if (settings.youtubeDisplayCategory === catToDelete) {
      updatedYoutubeCat = 'ALL';
    }

    const updatedSettings: StoreSettings = {
      ...settings,
      categories: remainingCats,
      youtubeDisplayCategory: updatedYoutubeCat,
    };

    let movedCount = 0;
    const updatedProducts = products.map((p) => {
      if (p.category === catToDelete) {
        movedCount++;
        return { ...p, category: fallbackCat };
      }
      return p;
    });

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    if (movedCount > 0) {
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }

    showFeedback(`"${catToDelete}" 카테고리가 삭제되었습니다.${movedCount > 0 ? ` (제품 ${movedCount}개 "${fallbackCat}" 카테고리로 이동)` : ''}`);
    onDataChange?.();
  };

  // 카테고리 순서 이동
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const currentCats = [...(settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace'])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentCats.length) return;

    const temp = currentCats[index];
    currentCats[index] = currentCats[targetIndex];
    currentCats[targetIndex] = temp;

    const updatedSettings: StoreSettings = {
      ...settings,
      categories: currentCats,
    };

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    showFeedback('카테고리 순서가 변경되었습니다.');
    onDataChange?.();
  };

  // 유튜브 노출 카테고리 변경
  const handleChangeYoutubeCategory = (cat: string) => {
    const updatedSettings: StoreSettings = {
      ...settings,
      youtubeDisplayCategory: cat,
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    showFeedback(
      cat === 'ALL'
        ? '유튜브 채널/영상이 모든 카테고리에서 항상 표시되도록 설정되었습니다.'
        : `유튜브 채널/영상이 "${cat}" 카테고리에 표시되도록 설정되었습니다.`
    );
    onDataChange?.();
  };

  // 커스텀 로고 업로드
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 150, quality: 0.9 });
      setSettings((prev) => ({ ...prev, customLogoUrl: compressed }));
      saveSettings({ ...settings, customLogoUrl: compressed });
      showFeedback('커스텀 로고가 적용되었습니다.');
      onDataChange?.();
    } catch {
      alert('로고 업로드에 실패했습니다.');
    }
  };

  // 커스텀 로고 초기화
  const handleResetLogo = () => {
    setSettings((prev) => {
      const copy = { ...prev };
      delete copy.customLogoUrl;
      saveSettings(copy);
      return copy;
    });
    showFeedback('기본 로고로 복원되었습니다.');
    onDataChange?.();
  };

  // 백업 파일 불러오기 처리
  const handleBackupFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupJson(content);
      if (res.success) {
        setProducts(loadProducts());
        setSettings(loadSettings());
        showFeedback(res.message);
        onDataChange?.();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    if (backupFileInputRef.current) backupFileInputRef.current.value = '';
  };

  // 초기 기본 데이터로 리셋
  const handleResetToDefaults = () => {
    const ok = window.confirm('정말 기본 샘플 데이터(제품 3종 및 기본 설정)로 초기화하시겠습니까? 현재 등록된 모든 수정사항이 덮어씌워집니다.');
    if (ok) {
      saveProducts(DEFAULT_PRODUCTS);
      saveSettings(DEFAULT_SETTINGS);
      setProducts(DEFAULT_PRODUCTS);
      setSettings(DEFAULT_SETTINGS);
      showFeedback('기본 샘플 데이터로 복원되었습니다.');
      onDataChange?.();
    }
  };

  // ==========================================
  // [A] 로그인 또는 비밀번호 초기 설정 게이트 화면
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1a1a18] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-[#232321] border border-[#383834] rounded-2xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#2e2e2a] text-[#D85A30] mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isPasswordConfigured ? '관리자 로그인' : '초기 비밀번호 설정'}
            </h1>
            <p className="text-xs text-[#a3a39e] mt-2">
              {isPasswordConfigured 
                ? '스토어 관리를 위해 설정하신 관리자 비밀번호를 입력해주세요.' 
                : '첫 방문입니다. 앞으로 사용할 마스터 관리자 비밀번호를 설정해주세요.'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {isPasswordConfigured ? (
            // 기존 로그인 폼
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d0d0cc] mb-1.5">
                  관리자 비밀번호
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a18] border border-[#3e3e3a] text-sm text-white focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none"
                  />
                  <Lock className="w-4 h-4 text-[#70706a] absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                id="admin-login-submit-btn"
                className="w-full py-3 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-sm font-bold transition-colors cursor-pointer shadow-md active:scale-[0.99]"
              >
                관리자 로그인
              </button>
            </form>
          ) : (
            // 신규 비밀번호 생성 폼
            <form onSubmit={handleSetInitialPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#d0d0cc] mb-1.5">
                  새 관리자 비밀번호 (최소 4자)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="새 비밀번호 입력"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a18] border border-[#3e3e3a] text-sm text-white focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none"
                  />
                  <Lock className="w-4 h-4 text-[#70706a] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d0d0cc] mb-1.5">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="비밀번호 다시 입력"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a18] border border-[#3e3e3a] text-sm text-white focus:border-[#D85A30] focus:ring-1 focus:ring-[#D85A30] outline-none"
                  />
                  <Lock className="w-4 h-4 text-[#70706a] absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                id="admin-init-password-btn"
                className="w-full py-3 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-sm font-bold transition-colors cursor-pointer shadow-md active:scale-[0.99]"
              >
                비밀번호 저장 및 로그인
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#333330] text-center">
            <button
              onClick={onExit}
              className="text-xs text-[#8e8e89] hover:text-white transition-colors cursor-pointer"
            >
              ← 스토어 메인으로 돌아가기
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // [B] 인증 완료된 관리자 콘솔 대시보드
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1a1a18]">
      
      {/* 관리자 헤더 */}
      <header className="sticky top-0 z-30 bg-[#1a1a18] text-white border-b border-[#2d2d2a] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg bg-[#2b2b28] hover:bg-[#383834] text-[#d0d0cc] transition-colors"
            title="스토어로 이동"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <span className="text-[#D85A30]">ROBO STORE</span>
            <span className="text-xs text-[#a3a39e] font-normal px-2 py-0.5 rounded-md bg-[#282825]">관리자 센터</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#282825] hover:bg-[#333330] text-xs font-medium text-white transition-colors"
          >
            스토어 바로가기
          </button>
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 border border-red-800 text-xs font-semibold text-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* 피드백 토스트 알림 */}
      {feedbackNotice && (
        <div className="fixed top-16 right-4 z-50 p-4 rounded-xl bg-[#1a1a18] text-white text-xs font-semibold shadow-xl border border-[#3e3e3a] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* 메인 관리 영역 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 상단 탭 네비게이션 */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e2dc] pb-4 mb-8">
          <button
            onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-[#1a1a18] text-white shadow-xs' : 'bg-white text-[#666660] hover:bg-[#ebebe6]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>제품 관리 ({products.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setIsEditingProduct(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#1a1a18] text-white shadow-xs' : 'bg-white text-[#666660] hover:bg-[#ebebe6]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>카테고리 관리 ({(settings.categories || ['WRO', 'CoSpace']).length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setIsEditingProduct(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#1a1a18] text-white shadow-xs' : 'bg-white text-[#666660] hover:bg-[#ebebe6]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>사이트 설정</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setIsEditingProduct(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'backup' ? 'bg-[#1a1a18] text-white shadow-xs' : 'bg-white text-[#666660] hover:bg-[#ebebe6]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>데이터 백업 &amp; 복원</span>
          </button>

          <button
            onClick={() => { setActiveTab('languages'); setIsEditingProduct(false); }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'languages' ? 'bg-[#1a1a18] text-white shadow-xs' : 'bg-white text-[#666660] hover:bg-[#ebebe6]'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>언어 및 운영 가이드</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* [탭 1] 제품 관리 탭 */}
        {/* ==================================================== */}
        {activeTab === 'products' && (
          <div>
            {!isEditingProduct ? (
              // 1-1. 제품 목록 뷰
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a18]">등록된 제품 목록</h2>
                    <p className="text-xs text-[#70706a] mt-0.5">
                      WRO 및 CoSpace Rescue 판매 제품을 자유롭게 추가, 수정, 삭제할 수 있습니다.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddProduct}
                    id="admin-add-product-btn"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-sm font-bold shadow-xs cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>새 제품 등록</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl border border-[#ebebe6] overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* 썸네일 */}
                        <div className="relative aspect-16/10 bg-[#f4f4f0] overflow-hidden">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#1a1a18] text-white shadow-xs">
                              {prod.category}
                            </span>
                          </div>
                          {prod.images && prod.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                              사진 {prod.images.length}장
                            </div>
                          )}
                        </div>

                        {/* 내용 */}
                        <div className="p-4">
                          <h3 className="font-bold text-base text-[#1a1a18] line-clamp-1 mb-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-[#70706a] line-clamp-2 mb-3">
                            {prod.shortDescription}
                          </p>
                          <div className="text-base font-extrabold text-[#D85A30]">
                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: prod.currency || 'KRW', maximumFractionDigits: 0 }).format(prod.price)}
                          </div>
                        </div>
                      </div>

                      {/* 하단 제어 버튼 */}
                      <div className="p-3 bg-[#fbfbfa] border-t border-[#f0f0eb] flex items-center justify-between">
                        <span className="text-xs text-[#8e8e89] font-mono">
                          {prod.createdAt}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg bg-white border border-[#deded8] hover:bg-[#f0f0eb] text-[#33332f] text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="수정"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="p-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>삭제</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 1-2. 제품 등록 및 수정 폼
              <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-6 border-b border-[#ecece8] mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#1a1a18]">
                      {editingProductId ? '제품 수정' : '새 제품 등록'}
                    </h3>
                    <p className="text-xs text-[#70706a] mt-0.5">
                      제품 정보, 사진 업로드, 유튜브 링크, 다국어 번역을 설정하세요.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingProduct(false)}
                    className="p-2 rounded-lg text-[#8e8e89] hover:bg-[#f4f4f0] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  
                  {/* 카테고리 & 가격 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#33332f] mb-1.5">카테고리 분류</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] font-medium outline-none focus:border-[#D85A30]"
                      >
                        {(settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace']).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        {/* 현재 제품의 카테고리가 목록에 없을 경우를 위한 안전 옵션 */}
                        {formCategory && !(settings.categories || ['WRO', 'CoSpace']).includes(formCategory) && (
                          <option value={formCategory}>{formCategory}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#33332f] mb-1.5">가격 (원)</label>
                      <input
                        type="number"
                        required
                        min={0}
                        step={1000}
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#33332f] mb-1.5">표시 통화</label>
                      <input
                        type="text"
                        value={formCurrency}
                        onChange={(e) => setFormCurrency(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                      />
                    </div>
                  </div>

                  {/* 기본 한국어 제품명 & 한줄 요약 */}
                  <div>
                    <label className="block text-xs font-bold text-[#33332f] mb-1.5">제품명 (한국어 기본)</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="예: WRO RoboMission Senior 2024 - 초고속 듀얼 컬러 센서 섀시"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#33332f] mb-1.5">목록 한 줄 소개 (한국어)</label>
                    <input
                      type="text"
                      required
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      placeholder="카드에 표시될 핵심 요약 문구"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#33332f] mb-1.5">상세 페이지 설명 (한국어)</label>
                    <textarea
                      rows={5}
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="기구부 특징, 알고리즘 원리, 모터 제어 방식 등 상세한 설명을 작성해주세요."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#33332f] mb-1.5">
                      패키지 포함 내용 목록 (엔터로 줄바꿈하여 구분)
                    </label>
                    <textarea
                      rows={4}
                      value={formIncludedText}
                      onChange={(e) => setFormIncludedText(e.target.value)}
                      placeholder="고해상도 3D 조립 설명서 (PDF)&#10;LEGO Spike Prime 파이썬 소스코드&#10;센서 보정 가이드"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30] resize-y"
                    />
                  </div>

                  {/* 유튜브 링크 */}
                  <div>
                    <label className="block text-xs font-bold text-[#33332f] mb-1.5 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-[#cc0000]" />
                      <span>이 로봇의 주행 영상 (YouTube 링크)</span>
                    </label>
                    <input
                      type="url"
                      value={formYoutubeUrl}
                      onChange={(e) => setFormYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... 또는 https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                    />
                    {formYoutubeUrl && extractYoutubeId(formYoutubeUrl) && (
                      <p className="text-xs text-emerald-600 mt-1 font-mono">
                        ✓ 유튜브 비디오 ID 감지됨: {extractYoutubeId(formYoutubeUrl)}
                      </p>
                    )}
                  </div>

                  {/* [3. 사진 업로드]: 로봇 사진 직접 업로드, 다중 등록, 드래그/버튼 순서 변경, 자동 리사이징 & 압축 */}
                  <div className="pt-4 border-t border-[#f0f0eb]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-[#1a1a18] block">
                          로봇 사진 등록 &amp; 관리 (첫 번째 사진이 대표 썸네일)
                        </label>
                        <p className="text-xs text-[#70706a]">
                          여러 장 업로드 가능하며, 브라우저에서 자동으로 최적화(압축 및 리사이징)되어 즉시 로딩됩니다.
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageFilesSelected}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={compressingPhotos}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a1a18] hover:bg-[#2d2d2a] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{compressingPhotos ? '압축 처리 중...' : '사진 파일 추가'}</span>
                      </button>
                    </div>

                    {/* 이미지 리스트 & 순서 변경 */}
                    {formImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#deded8] bg-[#1a1a18] group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            
                            {/* 대표 뱃지 */}
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#D85A30] text-white text-[10px] font-bold shadow-xs">
                                대표 썸네일
                              </span>
                            )}

                            {/* 컨트롤 오버레이 */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImageLeft(idx)}
                                  className="p-1.5 rounded-full bg-white/80 hover:bg-white text-black transition-colors"
                                  title="앞으로 이동"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(idx)}
                                className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                                title="사진 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              {idx < formImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImageRight(idx)}
                                  className="p-1.5 rounded-full bg-white/80 hover:bg-white text-black transition-colors"
                                  title="뒤로 이동"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-8 border-2 border-dashed border-[#deded8] rounded-xl text-center bg-[#fbfbfa] hover:bg-[#f5f5f0] cursor-pointer transition-colors"
                      >
                        <Upload className="w-8 h-8 text-[#a3a39e] mx-auto mb-2" />
                        <p className="text-xs font-semibold text-[#555550]">
                          클릭하여 로봇 사진을 업로드하세요 (여러 장 선택 가능)
                        </p>
                        <p className="text-[11px] text-[#8e8e89] mt-1">
                          자동 리사이즈 &amp; WebP 최적화 압축 지원
                        </p>
                      </div>
                    )}
                  </div>

                  {/* [6. 다국어 번역 설정] */}
                  <div className="pt-4 border-t border-[#f0f0eb]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-sm font-bold text-[#1a1a18] block">
                          다국어 번역 설정 (선택 사항)
                        </label>
                        <p className="text-xs text-[#70706a]">
                          비워둘 경우 한국어 원문이 자동으로 보여집니다.
                        </p>
                      </div>
                      
                      {/* 언어 탭 */}
                      <div className="flex items-center gap-1 bg-[#f0f0eb] p-1 rounded-lg">
                        {(['en', 'ja', 'zh', 'es'] as const).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setSelectedTransLang(lang)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                              selectedTransLang === lang ? 'bg-white text-[#1a1a18] shadow-xs' : 'text-[#70706a]'
                            }`}
                          >
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#fbfbfa] border border-[#ebebe6] space-y-3">
                      <p className="text-xs font-bold text-[#D85A30]">
                        [{selectedTransLang.toUpperCase()}] 번역 입력
                      </p>

                      <div>
                        <label className="block text-xs font-medium text-[#555550] mb-1">
                          제품명 ({selectedTransLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={transName[selectedTransLang] || ''}
                          onChange={(e) => setTransName({ ...transName, [selectedTransLang]: e.target.value })}
                          placeholder="영문/다국어 제품명 입력 (비워둘 시 한국어 사용)"
                          className="w-full px-3 py-2 rounded-lg border border-[#deded8] bg-white text-xs text-[#1a1a18] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#555550] mb-1">
                          한 줄 요약 ({selectedTransLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={transShortDesc[selectedTransLang] || ''}
                          onChange={(e) => setTransShortDesc({ ...transShortDesc, [selectedTransLang]: e.target.value })}
                          placeholder="영문/다국어 한 줄 소개"
                          className="w-full px-3 py-2 rounded-lg border border-[#deded8] bg-white text-xs text-[#1a1a18] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#555550] mb-1">
                          상세 설명 ({selectedTransLang.toUpperCase()})
                        </label>
                        <textarea
                          rows={3}
                          value={transDesc[selectedTransLang] || ''}
                          onChange={(e) => setTransDesc({ ...transDesc, [selectedTransLang]: e.target.value })}
                          placeholder="영문/다국어 상세 설명"
                          className="w-full px-3 py-2 rounded-lg border border-[#deded8] bg-white text-xs text-[#1a1a18] outline-none resize-y"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 저장 및 취소 버튼 */}
                  <div className="pt-6 border-t border-[#ecece8] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProduct(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#deded8] bg-white hover:bg-[#f0f0eb] text-xs font-bold text-[#555550] transition-colors cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      id="save-product-submit-btn"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProductId ? '수정사항 저장' : '새 제품 저장'}</span>
                    </button>
                  </div>

                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* [탭 2] 카테고리 관리 탭 */}
        {/* ==================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8 max-w-4xl">
            {/* 1. 유튜브 채널 노출 카테고리 설정 카드 */}
            <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-xs">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-2">
                    <Youtube className="w-4 h-4 text-[#cc0000]" />
                    <span>유튜브 채널 노출 위치 설정</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1a1a18]">
                    유튜브 채널이 보일 카테고리 설정
                  </h2>
                  <p className="text-xs text-[#70706a] mt-1">
                    방문자가 특정 카테고리를 선택했을 때 공식 유튜브 채널과 추천 영상 섹션이 함께 노출되도록 지정할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#fafafa] border border-[#e8e8e3] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-xs font-bold text-[#33332f] shrink-0">
                    현재 표시 위치:
                  </span>
                  <select
                    value={settings.youtubeDisplayCategory || 'ALL'}
                    onChange={(e) => handleChangeYoutubeCategory(e.target.value)}
                    className="flex-1 max-w-md px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-white text-sm font-semibold text-[#1a1a18] outline-none focus:border-[#D85A30] cursor-pointer shadow-xs"
                  >
                    <option value="ALL">
                      🌟 전체 카테고리 (홈 화면에서 항상 표시)
                    </option>
                    {(settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace']).map((cat) => (
                      <option key={cat} value={cat}>
                        🏷️ {cat} 카테고리 선택 시에만 표시
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-[#666660] bg-white p-3 rounded-lg border border-[#ecece8] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {settings.youtubeDisplayCategory === 'ALL'
                      ? '현재 "전체 카테고리"로 설정되어 있어, 방문자가 어떤 카테고리를 보더라도 하단에 유튜브 채널/영상이 항상 노출됩니다.'
                      : `현재 "${settings.youtubeDisplayCategory}" 카테고리로 설정되어 있어, 방문자가 "${settings.youtubeDisplayCategory}" 탭을 클릭했을 때 유튜브 영상 및 채널이 연동되어 표시됩니다.`}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. 전체 카테고리 목록 및 추가/수정 관리 */}
            <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a18]">
                    사이트 카테고리 전체 관리
                  </h2>
                  <p className="text-xs text-[#70706a] mt-1">
                    스토어의 모든 카테고리를 자유롭게 추가, 수정, 순서 변경, 삭제할 수 있습니다. 카테고리명 변경 시 등록된 제품들도 자동 동기화됩니다.
                  </p>
                </div>
              </div>

              {/* 새 카테고리 추가 폼 */}
              <form onSubmit={handleAddCategory} className="mb-6 p-4 rounded-xl bg-[#f7f7f4] border border-[#e8e8e1]">
                <label className="block text-xs font-bold text-[#33332f] mb-2">
                  새 카테고리 추가
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="예: FLL, FTC, 3D 파츠, 알고리즘, 교육자료 등..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-[#deded8] bg-white text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a1a18] hover:bg-[#333330] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>추가하기</span>
                  </button>
                </div>
              </form>

              {/* 카테고리 목록 테이블/카드 */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#888880] px-2 flex items-center justify-between">
                  <span>등록된 카테고리 ({(settings.categories || ['WRO', 'CoSpace']).length}개)</span>
                  <span>순서 / 수정 / 삭제</span>
                </div>

                {(settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace']).map((cat, index, arr) => {
                  const prodCount = products.filter((p) => p.category === cat).length;
                  const isEditing = editingCategoryIndex === index;
                  const isYoutube = settings.youtubeDisplayCategory === cat;

                  return (
                    <div
                      key={cat}
                      className="p-4 rounded-xl border border-[#ecece8] bg-[#fbfbfa] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#deded8]"
                    >
                      {/* 카테고리 정보 / 편집 인풋 */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-[#ebebe6] text-[#70706a] text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        {isEditing ? (
                          <div className="flex items-center gap-2 flex-1 max-w-sm">
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#D85A30] bg-white text-sm font-bold text-[#1a1a18] outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat)}
                              className="px-3 py-1.5 rounded-lg bg-[#D85A30] text-white text-xs font-bold hover:bg-[#c04e28] shrink-0 cursor-pointer"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryIndex(null)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-[#deded8] text-xs font-bold text-[#666660] hover:bg-[#f0f0eb] shrink-0 cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm sm:text-base text-[#1a1a18]">
                              {cat}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-[#ecece8] text-[#555550] font-medium">
                              제품 {prodCount}개
                            </span>
                            {isYoutube && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-[#cc0000] text-[11px] font-bold">
                                <Youtube className="w-3 h-3" />
                                <span>유튜브 연동 카테고리</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 액션 컨트롤 버튼들 */}
                      {!isEditing && (
                        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                          {/* 순서 위로 */}
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveCategory(index, 'up')}
                            className="p-1.5 rounded-lg border border-[#deded8] bg-white hover:bg-[#f0f0eb] disabled:opacity-30 disabled:cursor-not-allowed text-[#555550] transition-colors cursor-pointer"
                            title="위로 이동"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* 순서 아래로 */}
                          <button
                            type="button"
                            disabled={index === arr.length - 1}
                            onClick={() => handleMoveCategory(index, 'down')}
                            className="p-1.5 rounded-lg border border-[#deded8] bg-white hover:bg-[#f0f0eb] disabled:opacity-30 disabled:cursor-not-allowed text-[#555550] transition-colors cursor-pointer"
                            title="아래로 이동"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* 이름 수정 */}
                          <button
                            type="button"
                            onClick={() => handleStartEditCategory(index, cat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#deded8] bg-white hover:bg-[#f0f0eb] text-xs font-bold text-[#33332f] transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3 text-[#70706a]" />
                            <span>수정</span>
                          </button>

                          {/* 삭제 */}
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>삭제</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* [탭 3] 사이트 설정 탭 */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold text-[#1a1a18] mb-1">사이트 전역 설정</h2>
            <p className="text-xs text-[#70706a] mb-6">
              홈 화면 문구, 결제 요청을 받을 이메일 주소, 유튜브 채널 주소, 헤더 로고를 관리합니다.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* 결제 요청 수신 이메일 주소 */}
              <div className="p-4 rounded-xl bg-[#fdf8f5] border border-[#fae2d8]">
                <label className="block text-xs font-bold text-[#D85A30] mb-1">
                  결제 요청 수신 이메일 주소 (Gmail 자동 완성 수신자)
                </label>
                <p className="text-xs text-[#73736c] mb-2">
                  방문자가 "결제 요청" 버튼을 눌렀을 때 자동으로 입력될 관리자 이메일 주소입니다.
                </p>
                <input
                  type="email"
                  required
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  placeholder="pompeii928@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-white text-sm text-[#1a1a18] font-mono outline-none focus:border-[#D85A30]"
                />
              </div>

              {/* 유튜브 채널 주소 */}
              <div>
                <label className="block text-xs font-bold text-[#33332f] mb-1.5 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-[#cc0000]" />
                  <span>공식 유튜브 채널 URL</span>
                </label>
                <input
                  type="url"
                  required
                  value={settings.youtubeChannelUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeChannelUrl: e.target.value })}
                  placeholder="https://www.youtube.com/channel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                />
              </div>

              {/* 유튜브 채널이 표시될 카테고리 선택 */}
              <div className="p-4 rounded-xl bg-[#fdfaf8] border border-[#fae2d8]">
                <label className="block text-xs font-bold text-[#D85A30] mb-1.5 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-[#cc0000]" />
                  <span>유튜브 채널/영상이 표시될 카테고리</span>
                </label>
                <p className="text-xs text-[#70706a] mb-2.5">
                  방문자가 특정 카테고리를 선택했을 때 공식 유튜브 영상 섹션이 해당 카테고리와 함께 표시되도록 설정합니다.
                </p>
                <select
                  value={settings.youtubeDisplayCategory || 'ALL'}
                  onChange={(e) => setSettings({ ...settings, youtubeDisplayCategory: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-white text-sm font-semibold text-[#1a1a18] outline-none focus:border-[#D85A30] cursor-pointer"
                >
                  <option value="ALL">🌟 전체 카테고리 (홈 화면에서 항상 표시)</option>
                  {(settings.categories && settings.categories.length > 0 ? settings.categories : ['WRO', 'CoSpace']).map((cat) => (
                    <option key={cat} value={cat}>
                      🏷️ {cat} 카테고리 선택 시에만 표시
                    </option>
                  ))}
                </select>
              </div>

              {/* 홈 화면 히어로 배너 섹션 표시 여부 토글 */}
              <div className="p-4 rounded-xl bg-[#f7f7f5] border border-[#e2e2dc]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-[#1a1a18]">
                      홈 화면 히어로 배너 섹션 표시 여부
                    </label>
                    <p className="text-xs text-[#70706a] mt-0.5">
                      홈 상단의 큰 제목 및 소개글 배너를 표시할지 설정합니다. (끄면 방문자가 첫 화면에서 바로 제품 목록을 봅니다)
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input
                      type="checkbox"
                      checked={!!settings.showHeroSection}
                      onChange={(e) => setSettings({ ...settings, showHeroSection: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#deded8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D85A30]"></div>
                  </label>
                </div>
              </div>

              {/* 히어로 메인 타이틀 */}
              <div>
                <label className="block text-xs font-bold text-[#33332f] mb-1.5">홈 화면 메인 큰 제목</label>
                <textarea
                  rows={2}
                  required
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30] resize-y"
                />
              </div>

              {/* 히어로 한 줄 설명 */}
              <div>
                <label className="block text-xs font-bold text-[#33332f] mb-1.5">홈 화면 한 줄 소개글</label>
                <textarea
                  rows={2}
                  required
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30] resize-y"
                />
              </div>

              {/* 버튼 문구 */}
              <div>
                <label className="block text-xs font-bold text-[#33332f] mb-1.5">히어로 CTA 버튼 텍스트</label>
                <input
                  type="text"
                  required
                  value={settings.heroButtonText}
                  onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded8] bg-[#fbfbfa] text-sm text-[#1a1a18] outline-none focus:border-[#D85A30]"
                />
              </div>

              {/* 커스텀 로고 업로드 관리 */}
              <div className="pt-4 border-t border-[#f0f0eb]">
                <label className="block text-xs font-bold text-[#33332f] mb-1.5">
                  헤더 로고 이미지 변경 (투명 배경 흰색 로고 권장)
                </label>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#1a1a18] border border-[#383834] flex items-center justify-center">
                    {settings.customLogoUrl ? (
                      <img src={settings.customLogoUrl} alt="Custom Logo" className="h-8 w-auto object-contain" />
                    ) : (
                      <img src="/logo.svg" alt="Default Logo" className="h-8 w-auto object-contain" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#deded8] hover:bg-[#f0f0eb] text-xs font-bold text-[#33332f] transition-colors cursor-pointer"
                    >
                      새 로고 업로드
                    </button>
                    {settings.customLogoUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                      >
                        기본 로고로 복원
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#ecece8] flex justify-end">
                <button
                  type="submit"
                  id="save-settings-submit-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D85A30] hover:bg-[#c04e28] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <Save className="w-4 h-4" />
                  <span>설정 저장하기</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* [탭 3] 데이터 백업 & 복원 탭 */}
        {/* ==================================================== */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-sm max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a18] mb-1">데이터 영구 보관 및 백업 관리</h2>
              <p className="text-xs text-[#70706a]">
                등록하신 모든 제품, 업로드된 사진, 사이트 설정값을 단 한 번의 클릭으로 JSON 파일로 내보내거나 복원할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 백업 파일 다운로드 */}
              <div className="p-5 rounded-xl bg-[#f9f9f7] border border-[#ebebe6] flex flex-col justify-between space-y-4">
                <div>
                  <div className="p-2.5 rounded-lg bg-white text-[#D85A30] w-fit shadow-xs mb-3">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1a1a18] mb-1">JSON 백업 다운로드</h3>
                  <p className="text-xs text-[#70706a]">
                    현재 등록된 모든 제품과 설정값을 .json 백업 파일로 컴퓨터에 안전하게 저장합니다.
                  </p>
                </div>
                <button
                  onClick={exportBackupJson}
                  className="w-full py-2.5 rounded-xl bg-[#1a1a18] hover:bg-[#2d2d2a] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>백업 파일 받기 (.json)</span>
                </button>
              </div>

              {/* 백업 파일 복원 */}
              <div className="p-5 rounded-xl bg-[#f9f9f7] border border-[#ebebe6] flex flex-col justify-between space-y-4">
                <div>
                  <div className="p-2.5 rounded-lg bg-white text-emerald-600 w-fit shadow-xs mb-3">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1a1a18] mb-1">백업 파일 불러오기</h3>
                  <p className="text-xs text-[#70706a]">
                    다른 기기나 이전에 저장해둔 .json 파일을 선택하여 제품 목록과 설정을 한 번에 복원합니다.
                  </p>
                </div>
                <input
                  type="file"
                  ref={backupFileInputRef}
                  accept=".json,application/json"
                  onChange={handleBackupFileSelected}
                  className="hidden"
                />
                <button
                  onClick={() => backupFileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-white border border-[#deded8] hover:bg-[#f0f0eb] text-[#1a1a18] text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileUp className="w-3.5 h-3.5 text-[#555550]" />
                  <span>백업 파일 업로드 및 복원</span>
                </button>
              </div>

            </div>

            {/* 초기화 위험 구역 */}
            <div className="pt-6 border-t border-[#f0f0eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
              <div>
                <p className="text-xs font-bold text-red-700">초기 샘플 데이터로 리셋</p>
                <p className="text-[11px] text-red-600/80">
                  모든 데이터를 초기 기본 샘플 제품 3종과 기본 설정값으로 되돌립니다.
                </p>
              </div>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>기본값으로 초기화</span>
              </button>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* [탭 4] 언어 및 운영 안내 가이드 탭 */}
        {/* ==================================================== */}
        {activeTab === 'languages' && (
          <div className="bg-white rounded-2xl border border-[#ebebe6] p-6 sm:p-8 shadow-sm max-w-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a18] mb-1">다국어 관리 및 운영 가이드</h2>
              <p className="text-xs text-[#70706a]">
                현재 지원되는 5개 언어와 향후 언어 확장 방법에 대한 상세 안내입니다.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#1a1a18]">현재 지원 중인 언어</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-xs font-semibold">
                  🇰🇷 한국어 (기본 원문)
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-xs font-semibold">
                  🇺🇸 English (영어)
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-xs font-semibold">
                  🇯🇵 日本語 (일본어)
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-xs font-semibold">
                  🇨🇳 中文 (简体, 중국어)
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f5] border border-[#ebebe6] text-xs font-semibold">
                  🇪🇸 Español (스페인어)
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#fbfbfa] border border-[#ebebe6] text-xs text-[#444440] space-y-3 leading-relaxed">
              <p className="font-bold text-sm text-[#1a1a18]">새로운 언어를 추가하는 방법 (코드 수정 가이드)</p>
              <p>
                본 웹사이트는 다국어 번역이 <code className="bg-white px-1.5 py-0.5 rounded border border-[#deded8] font-mono text-[#D85A30]">src/locales/translations.ts</code> 파일에 깔끔하게 모듈화되어 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[#555550]">
                <li><code className="font-mono text-[#1a1a18]">src/types.ts</code>의 <code className="font-mono text-[#D85A30]">LanguageCode</code> 타입에 새 언어 코드(예: <code className="font-mono">'fr' | 'de'</code>)를 추가합니다.</li>
                <li><code className="font-mono text-[#1a1a18]">src/locales/translations.ts</code>의 <code className="font-mono text-[#D85A30]">LANGUAGES</code> 배열에 언어 이름과 국기를 추가합니다.</li>
                <li><code className="font-mono text-[#D85A30]">translations</code> 객체에 새 언어 번역 사전(메뉴, 버튼명, Gmail 이메일 양식 등)을 추가합니다.</li>
              </ol>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
