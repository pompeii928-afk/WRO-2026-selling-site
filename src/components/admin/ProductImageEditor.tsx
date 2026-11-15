import React, { useRef, useState } from 'react';
import { Upload, ImagePlus, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { chooseCover, replaceCover } from '../../utils/productMedia';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  onBusyChange: (busy: boolean) => void;
  disabled?: boolean;
}

export function ProductImageEditor({ images, onChange, onBusyChange, disabled = false }: Props) {
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const locked = busy || disabled;

  const upload = async (event: React.ChangeEvent<HTMLInputElement>, mode: 'cover' | 'gallery') => {
    const input = event.target;
    const files = Array.from(input.files || []).filter(file => file.type.startsWith('image/'));
    if (!files.length) { input.value = ''; return; }
    setBusy(true); onBusyChange(true); setError('');
    try {
      const uploaded: string[] = [];
      for (const file of (mode === 'cover' ? files.slice(0, 1) : files)) {
        uploaded.push(await compressImage(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 }));
      }
      onChange(mode === 'cover' ? replaceCover(images, uploaded[0]) : [...images, ...uploaded]);
    } catch {
      setError('사진을 불러오지 못했습니다. 다른 이미지 파일로 다시 시도해주세요.');
    } finally {
      input.value = ''; setBusy(false); onBusyChange(false);
    }
  };
  const move = (index: number, offset: number) => {
    const next = [...images];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };

  return <section className="pt-4 border-t border-[#f0f0eb] space-y-4" aria-label="상품 사진 및 대표 썸네일">
    <div>
      <h3 className="text-sm font-bold">대표 썸네일 및 상품 사진</h3>
      <p className="text-xs text-[#70706a] mt-1">대표 사진 변경은 첫 번째 사진을 교체합니다. 사진 추가는 상세 갤러리에 추가합니다. 변경 후 아래 저장 버튼을 눌러주세요.</p>
    </div>
    <input ref={coverInput} type="file" accept="image/*" aria-label="대표 사진 파일" onChange={event => upload(event, 'cover')} className="hidden" disabled={locked}/>
    <input ref={galleryInput} type="file" accept="image/*" multiple aria-label="갤러리 사진 파일" onChange={event => upload(event, 'gallery')} className="hidden" disabled={locked}/>
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={locked} onClick={() => coverInput.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D85A30] text-white rounded-xl text-xs font-bold disabled:opacity-50"><ImagePlus size={16}/>대표 사진 변경</button>
      <button type="button" disabled={locked} onClick={() => galleryInput.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1a1a18] text-white rounded-xl text-xs font-bold disabled:opacity-50"><Upload size={16}/>갤러리 사진 추가</button>
      {busy && <span role="status" className="text-xs self-center text-[#70706a]">사진 최적화 중...</span>}
    </div>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
    {images.length ? <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {images.map((image, index) => <div key={index} className="rounded-xl border border-[#deded8] overflow-hidden bg-white">
        <div className="relative aspect-4/3 bg-[#f4f4f0]">
          <img src={image} alt={`상품 사진 ${index + 1}`} className="w-full h-full object-contain"/>
          {index === 0 && <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#D85A30] text-white text-[10px] font-bold">대표 썸네일</span>}
        </div>
        <div className="p-2 space-y-2">
          <button type="button" disabled={locked || index === 0} onClick={() => onChange(chooseCover(images, index))} className="w-full flex items-center justify-center gap-1 py-2 rounded-lg bg-[#f4f4f0] text-[11px] font-bold disabled:opacity-50">{index === 0 && <Check size={12}/>} {index === 0 ? '현재 대표 사진' : '대표 사진으로 설정'}</button>
          <div className="flex justify-between gap-1">
            <button type="button" disabled={locked || index === 0} onClick={() => move(index, -1)} aria-label={`사진 ${index + 1} 앞으로 이동`} className="p-2 rounded-lg hover:bg-[#f4f4f0] disabled:opacity-30"><ArrowLeft size={14}/></button>
            <button type="button" disabled={locked} onClick={() => onChange(images.filter((_, i) => i !== index))} aria-label={`사진 ${index + 1} 삭제`} className="p-2 rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-30"><Trash2 size={14}/></button>
            <button type="button" disabled={locked || index === images.length - 1} onClick={() => move(index, 1)} aria-label={`사진 ${index + 1} 뒤로 이동`} className="p-2 rounded-lg hover:bg-[#f4f4f0] disabled:opacity-30"><ArrowRight size={14}/></button>
          </div>
        </div>
      </div>)}
    </div> : <p className="rounded-xl border border-dashed border-[#deded8] p-6 text-xs text-[#70706a]">대표 사진을 업로드해주세요.</p>}
  </section>;
}
