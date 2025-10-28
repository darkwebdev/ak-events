/**
 * Normalize image source for proper URL handling
 * @param {string} raw - Raw image path
 * @returns {string|null} Normalized image URL
 */
export function normalizeImageSrc(raw) {
  if (!raw) return null;
  // If it's already a remote URL, just encode and return.
  if (raw.startsWith('http')) return encodeURI(raw);
  const BASE = '/';
  // If it's an absolute path starting with '/' and the BASE is not root,
  // prefix it with BASE so GitHub Pages project sites resolve correctly.
  if (raw.startsWith('/')) {
    if (BASE === '/' || raw.startsWith(BASE)) return encodeURI(raw);
    return encodeURI(BASE + raw.replace(/^\//, ''));
  }
  // Otherwise we expect stored images to live under /data/images/
  return encodeURI(`${BASE}data/images/${raw.replace(/^\//, '')}`);
}

/**
 * Given a local image path (absolute or relative), return an object with
 * { displaySrc, originalSrc } where displaySrc prefers a .jpg sibling and
 * originalSrc is the original path.
 */
export function jpgifyLocal(raw) {
  if (!raw) return { displaySrc: null, originalSrc: null };
  const isRemote = raw.startsWith('http');
  const BASE = '/';
  // normalize prefix
  let pref = raw;
  if (!isRemote && !raw.startsWith('/')) pref = `/data/images/${raw}`;
  // If remote, just return same for both
  if (isRemote) return { displaySrc: encodeURI(pref), originalSrc: encodeURI(pref) };
  // derive jpg path
  const parts = pref.split('/');
  const last = parts.pop();
  const dot = last.lastIndexOf('.');
  const name = dot !== -1 ? last.slice(0, dot) : last;
  const jpg = parts.concat([`${name}.jpg`]).join('/');
  // If BASE isn't root, ensure prefixing
  const display = BASE === '/' || jpg.startsWith(BASE) ? jpg : BASE + jpg.replace(/^\//, '');
  const original = BASE === '/' || pref.startsWith(BASE) ? pref : BASE + pref.replace(/^\//, '');
  return { displaySrc: encodeURI(display), originalSrc: encodeURI(original) };
}

// (ESM module) no CommonJS fallback to avoid duplicated logic
