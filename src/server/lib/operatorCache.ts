import { fetchOperatorCategories } from './network.js';
import { loadJson, saveJson } from './storage.js';
import type { OperatorCache } from '../types.js';

const CACHE_PATH = 'public/data/operators.json';

// Categories that mark an operator as obtainable through some non-exclusive means.
// An operator is a Limited (exclusive) operator precisely when NONE of these apply —
// the wiki has no direct "Limited" category, so this is determined by absence.
const NON_LIMITED_CATEGORIES = new Set([
  'Headhunting Operators',
  'Standard Headhunting Operators',
  'Kernel Headhunting Operators',
  'Recruitment Operators',
]);

function isLimitedFromCategories(categories: string[]): boolean {
  // The MediaWiki API serializes category names with underscores in place of spaces
  // (e.g. "Standard_Headhunting_Operators") when returned via prop=categories, unlike
  // the space-separated display form used elsewhere (e.g. list=allcategories) — so
  // normalize before comparing rather than assuming either form.
  return !categories.some((c) => NON_LIMITED_CATEGORIES.has(c.replace(/_/g, ' ')));
}

function loadOperatorCache(): OperatorCache {
  return loadJson<OperatorCache>(CACHE_PATH, {});
}

function saveOperatorCache(cache: OperatorCache): void {
  saveJson(CACHE_PATH, cache);
}

// Resolve whether `name` is a Limited operator, using `cache` (as returned by
// loadOperatorCache) to avoid re-fetching operators already resolved in a past run.
// Mutates `cache` with any newly-resolved entry — but only on a successful fetch.
// A failed fetch (fetchOperatorCategories returns null) is NOT cached: caching a
// guess from a transient network error would permanently mislabel the operator,
// since a cache hit short-circuits before ever fetching again.
async function resolveOperatorLimited(name: string, cache: OperatorCache): Promise<boolean> {
  if (Object.prototype.hasOwnProperty.call(cache, name)) return cache[name];
  const categories = await fetchOperatorCategories(name);
  if (categories == null) {
    console.error('Failed to fetch categories for operator', name, '- leaving uncached');
    return false;
  }
  const limited = isLimitedFromCategories(categories);
  cache[name] = limited;
  return limited;
}

export { loadOperatorCache, saveOperatorCache, resolveOperatorLimited, isLimitedFromCategories };
