import { wikiBase } from '../config.js';

// Extract a raw wiki page title from a URL (or pass a raw title through unchanged) —
// strips the wiki's own base URL and any leading slash, but preserves whatever the
// URL actually points to, Rerun suffix included. Use this when the caller wants to
// fetch exactly the page a URL names (e.g. a rerun's own "X_Rerun"/"X/Rerun" page).
function rawTitleFromUrl(fetchUrl: string | null | undefined): string | null {
  if (!fetchUrl) return null;
  let cleaned = fetchUrl;
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    /* ignore */
  }
  // If a full URL, strip the wiki base first
  if (cleaned.startsWith(wikiBase)) cleaned = cleaned.replace(wikiBase, '');
  // Ensure no leading slash remains
  if (cleaned.startsWith('/')) cleaned = cleaned.slice(1);
  return cleaned;
}

// Normalize and extract the ORIGINAL (non-rerun) page title from a URL or raw title,
// by additionally stripping common 'Rerun' suffix variants such as '/Rerun',
// '_Rerun', '-Rerun', and ' Rerun'. Use this specifically when the caller wants the
// original run's page regardless of whether the given URL/title is a rerun's own
// (e.g. the original-page fallback fetch in scrape.ts) — for fetching whatever page
// a URL actually names, use rawTitleFromUrl instead, since this discards that
// distinction on purpose.
function titleFromUrl(fetchUrl: string | null | undefined): string | null {
  const raw = rawTitleFromUrl(fetchUrl);
  if (raw == null) return null;
  // Remove any trailing Rerun variants: '/', '_', '-', space or URL-encoded space before 'Rerun'
  return raw.replace(/(?:[/_\-\s]|%20)?Rerun$/i, '');
}

function isRerunLink(fetchUrl: string | null | undefined): boolean {
  if (!fetchUrl) return false;
  let cleaned = fetchUrl;
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    /* ignore */
  }
  // Only examine the tail of the path/title for 'Rerun' variants
  return /(?:[/_\-\s]|%20)?Rerun$/i.test(cleaned);
}

function applyRerunSuffix(
  parsedType: string | null | undefined,
  link: string | null | undefined
): string | null | undefined {
  if (!parsedType) return parsedType;
  if (!link || typeof link !== 'string') return parsedType;
  if (!isRerunLink(link)) return parsedType;
  if (/\(Rerun\)$/i.test(parsedType)) return parsedType;
  return `${parsedType} (Rerun)`;
}

export { rawTitleFromUrl, titleFromUrl, isRerunLink, applyRerunSuffix };
