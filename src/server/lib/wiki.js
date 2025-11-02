import { wikiBase } from '../config.js';

// Normalize and extract a wiki page title from a URL or raw title.
// This strips common 'Rerun' suffix variants such as '/Rerun', '_Rerun', '-Rerun', and ' Rerun'.
function titleFromUrl(fetchUrl) {
  if (!fetchUrl) return null;
  let cleaned = fetchUrl;
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {
    /* ignore */
  }
  // If a full URL, strip the wiki base first
  if (cleaned.startsWith(wikiBase)) cleaned = cleaned.replace(wikiBase, '');
  // Remove any trailing Rerun variants: '/', '_', '-', space or URL-encoded space before 'Rerun'
  cleaned = cleaned.replace(/(?:[/_\-\s]|%20)?Rerun$/i, '');
  // Ensure no leading slash remains
  if (cleaned.startsWith('/')) cleaned = cleaned.slice(1);
  return cleaned;
}

function isRerunLink(fetchUrl) {
  if (!fetchUrl) return false;
  let cleaned = fetchUrl;
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (e) {}
  // Only examine the tail of the path/title for 'Rerun' variants
  return /(?:[/_\-\s]|%20)?Rerun$/i.test(cleaned);
}

function applyRerunSuffix(parsedType, link) {
  if (!parsedType) return parsedType;
  if (!link || typeof link !== 'string') return parsedType;
  if (!isRerunLink(link)) return parsedType;
  if (/\(Rerun\)$/i.test(parsedType)) return parsedType;
  return `${parsedType} (Rerun)`;
}

export { titleFromUrl, isRerunLink, applyRerunSuffix };
