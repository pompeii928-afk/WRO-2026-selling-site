/**
 * @file youtube.ts
 * @description 유튜브 링크 파싱 및 임베드 URL 변환 헬퍼
 */

/**
 * 다양한 형태의 유튜브 URL에서 11자리 비디오 ID를 추출합니다.
 */
export function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  
  // 정규식 매칭 (watch?v=, youtu.be/, embed/, shorts/)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * 비디오 ID 또는 URL로부터 반응형 임베드 iframe src URL을 생성합니다.
 */
export function getYoutubeEmbedUrl(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const id = urlOrId.length === 11 ? urlOrId : extractYoutubeId(urlOrId);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=0`;
}

/**
 * 비디오 썸네일 고화질 이미지 URL을 반환합니다.
 */
export function getYoutubeThumbnailUrl(urlOrId?: string): string {
  if (!urlOrId) return '';
  const id = urlOrId.length === 11 ? urlOrId : extractYoutubeId(urlOrId);
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
