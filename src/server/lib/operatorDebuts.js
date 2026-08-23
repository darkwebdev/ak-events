import { fetchEventDetailsViaApi } from './network.js';
import { extractOperatorDebutEvent, extractObtainMethod } from './parser.js';
import { loadJson, saveJson } from './storage.js';

const CACHE_PATH = 'public/data/operator_debuts.json';

function loadOperatorDebutCache() {
  return loadJson(CACHE_PATH, {});
}

function saveOperatorDebutCache(cache) {
  saveJson(CACHE_PATH, cache);
}

// Resolve `{ event, isFestival }` for the operator `name` (or null if the debut event
// can't be determined), using `cache` to avoid re-fetching operators already resolved
// in a past run. `event` is what separates "rate-up" from "sparkable": a Limited
// operator is rate-up on the banner where they debut, but only spark-purchasable once
// carried over to a LATER banner — so the caller compares this against the CURRENT
// banner's event name. `isFestival` is whether their "How to obtain" infobox text
// names them as a Festival Limited operator (vs. Carnival/Celebration/etc), which
// determines a 5-year rather than 4-year spark-cost-reduction threshold — see
// lib/sparkCost.js.
// Mutates `cache` with any newly-resolved entry, including one with `event: null` when
// the operator's page was fetched successfully but no confident debut could be read
// from it (an ambiguous-but-successful result, worth caching so it isn't re-fetched
// every run) — but NOT when the fetch itself failed, since caching a guess from a
// transient network error would permanently and wrongly block that operator from ever
// sparking.
async function resolveOperatorDebutEvent(name, cache) {
  // Older cache entries (before isFestival was tracked) are a bare string|null rather
  // than this object shape — treat those as stale and re-resolve instead of returning
  // a shape callers now assume has an `isFestival` field.
  if (
    Object.prototype.hasOwnProperty.call(cache, name) &&
    cache[name] !== null &&
    typeof cache[name] === 'object'
  ) {
    return cache[name];
  }
  const apiJson = await fetchEventDetailsViaApi(name);
  const html = apiJson?.parse?.text?.['*'] || '';
  if (!html) {
    console.error('Failed to fetch page for operator', name, '- leaving debut event uncached');
    return null;
  }
  const debut = extractOperatorDebutEvent(html);
  const event = debut && debut.introduced ? debut.event : null;
  const obtainMethod = extractObtainMethod(html);
  const isFestival = obtainMethod != null && /festival/i.test(obtainMethod);
  cache[name] = { event, isFestival };
  return cache[name];
}

export { loadOperatorDebutCache, saveOperatorDebutCache, resolveOperatorDebutEvent };
