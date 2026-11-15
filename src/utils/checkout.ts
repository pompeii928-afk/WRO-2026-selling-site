/** Only reusable HTTPS product links from Lemon Squeezy are accepted. */
export function normalizeCheckoutUrl(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    if (!/^[a-z0-9-]+\.lemonsqueezy\.com$/i.test(url.hostname)) return null;
    if (!/^\/checkout\/buy\/[a-z0-9-]+\/?$/i.test(url.pathname)) return null;
    if (['1', 'true'].includes(url.searchParams.get('test_mode') || '')) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}
