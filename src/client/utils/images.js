/**
 * Normalize image source for proper URL handling
 * @param {string} raw - Raw image path
 * @returns {string|null} Normalized image URL
 */
export function normalizeImageSrc(raw) {
  if (!raw) return null;
  // If it's already a remote URL, just encode and return.
  if (raw.startsWith('http')) return encodeURI(raw);
  const BASE = getBase();
  // If it's an absolute path starting with '/' and the BASE is not root,
  // prefix it with BASE so GitHub Pages project sites resolve correctly.
  if (raw.startsWith('/')) {
    if (BASE === '/' || raw.startsWith(BASE)) return encodeURI(raw);
    return encodeURI(BASE + raw.replace(/^\//, ''));
  }
  // Otherwise we expect stored images to live under data/images/ (project-relative)
  const rel = raw.startsWith('data/') ? raw : `data/images/${raw.replace(/^\//, '')}`;
  return encodeURI(BASE === '/' ? `/${rel}` : `${BASE}${rel}`);
}

/**
 * Given a local image path (absolute or relative), return an object with
 * { displaySrc, originalSrc } where displaySrc prefers a .jpg sibling and
 * originalSrc is the original path.
 */
export function jpgifyLocal(raw) {
  if (!raw) return { displaySrc: null, originalSrc: null };
  const BASE = getBase();
  // normalize prefix
  let pref = raw;
  if (!raw.startsWith('/')) pref = raw.startsWith('data/') ? `/${raw}` : `/data/images/${raw}`;
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

function getBase() {
  // Safe base detection for browser (document.baseURI) and test/node (process.env)
  let BASE = '/';
  try {
    if (typeof document !== 'undefined' && document.baseURI) {
      try {
        const parsed = new URL(document.baseURI);
        BASE = parsed.pathname || '/';
      } catch (e) {
        // ignore
      }
      if (!BASE.endsWith('/')) BASE += '/';
    }
  } catch (e) {}
  if (
    (typeof BASE === 'undefined' || BASE === '/') &&
    typeof process !== 'undefined' &&
    process.env &&
    process.env.BASE_URL
  ) {
    BASE = process.env.BASE_URL;
  }
  return BASE;
}
