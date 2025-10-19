/**
 * Normalize image source for proper URL handling
 * @param {string} raw - Raw image path
 * @returns {string|null} Normalized image URL
 */
export function normalizeImageSrc(raw) {
  if (!raw) return null;
  // If it's already a remote URL, just encode and return.
  if (raw.startsWith('http')) return encodeURI(raw);
  const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
  // If it's an absolute path starting with '/' and the BASE is not root,
  // prefix it with BASE so GitHub Pages project sites resolve correctly.
  if (raw.startsWith('/')) {
    if (BASE === '/' || raw.startsWith(BASE)) return encodeURI(raw);
    return encodeURI(BASE + raw.replace(/^\//, ''));
  }
  // Otherwise we expect stored images to live under /data/images/
  return encodeURI(BASE + 'data/images/' + raw.replace(/^\//, ''));
}