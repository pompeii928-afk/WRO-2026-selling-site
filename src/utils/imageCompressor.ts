/**
 * @file imageCompressor.ts
 * @description 관리자 페이지에서 업로드된 이미지를 브라우저 캔버스를 이용해 자동으로 리사이즈 및 압축하는 유틸리티
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 ~ 1.0
  mimeType?: string; // 'image/webp' or 'image/jpeg'
}

/**
 * File 객체를 읽어 최대 가로/세로 제한 및 퀄리티 압축을 거쳐 DataURL(Base64)로 변환합니다.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // 1. 파일 리더로 파일 읽기
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지 로딩에 실패했습니다.'));
      img.onload = () => {
        // 2. 비율 유지 리사이징 계산
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // 3. 캔버스에 그리기
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('캔버스 컨텍스트를 가져올 수 없습니다.'));
          return;
        }

        // 고품질 보간 적용
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // 4. WebP 지원 여부 확인 후 압축 데이터 URL 추출
        try {
          const dataUrl = canvas.toDataURL(mimeType, quality);
          // 브라우저가 webp를 지원하지 않아 png로 폴백된 경우 jpeg로 재시도
          if (mimeType === 'image/webp' && dataUrl.startsWith('data:image/png') && file.type !== 'image/png') {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(dataUrl);
          }
        } catch {
          // 폴백: JPEG로 변환
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
