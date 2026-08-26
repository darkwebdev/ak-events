import { useStorage } from '../hooks/useStorage.js';

const STORAGE_PREFIX = 'ak-events-flag-';
// A URL query param toggles a flag AND persists it to localStorage, so a single
// bookmarkable/sharable link (?ff_accountImport=1) can turn a feature on for a
// given browser without needing devtools — visiting it once is enough, it sticks
// across reloads after that via the same localStorage key useFeatureFlag reads.
const QUERY_PREFIX = 'ff_';

function applyQueryOverrides() {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    if (!key.startsWith(QUERY_PREFIX)) continue;
    const name = key.slice(QUERY_PREFIX.length);
    try {
      window.localStorage.setItem(
        STORAGE_PREFIX + name,
        JSON.stringify(value === '1' || value === 'true')
      );
    } catch {
      // localStorage unavailable (private mode, etc.) — the flag just won't persist.
    }
  }
}

// Runs once per page load, before any component reads a flag, so the very first
// render already reflects a query-param override rather than flipping a beat later.
applyQueryOverrides();

// Reads/writes a single feature flag, persisted in localStorage under
// `ak-events-flag-<name>`. Toggle from the browser console with e.g.
// localStorage.setItem('ak-events-flag-accountImport', 'true') and reload, or via
// the ?ff_accountImport=1 query param (see applyQueryOverrides above).
export function useFeatureFlag(name, defaultValue = false) {
  return useStorage(STORAGE_PREFIX + name, defaultValue);
}
