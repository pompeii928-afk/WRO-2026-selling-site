/** Keep the gallery intact while replacing or choosing its cover image. */
export function replaceCover(images: string[], cover: string): string[] {
  return [cover, ...images.slice(1)];
}

export function chooseCover(images: string[], index: number): string[] {
  if (index < 0 || index >= images.length) return [...images];
  return [images[index], ...images.filter((_, i) => i !== index)];
}

/** Firestore rejects undefined even when it is inside an optional translation. */
export function withoutUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.filter(item => item !== undefined).map(withoutUndefined) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, withoutUndefined(item)])) as T;
  }
  return value;
}
