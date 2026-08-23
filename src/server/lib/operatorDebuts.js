import { fetchEventDetailsViaApi } from './network.js';
import { extractOperatorDebutEvent } from './parser.js';
import { loadJson, saveJson } from './storage.js';

const CACHE_PATH = 'public/data/operator_debuts.json';

function loadOperatorDebutCache() {
  return loadJson(CACHE_PATH, {});
}

function saveOperatorDebutCache(cache) {
  saveJson(CACHE_PATH, cache);
}

// Resolve the event `name` first debuted on (or null if that can't be determined),
// using `cache` to avoid re-fetching operators already resolved in a past run. This is
// what separates "rate-up" from "sparkable": a Limited operator is rate-up on the
// banner where they debut, but only spark-purchasable once carried over to a LATER
// banner — so the caller compares this against the CURRENT banner's event name.
// Mutates `cache` with any newly-resolved entry, including a `null` result when the
// operator's page was fetched successfully but no confident debut could be read from
// it (an ambiguous-but-successful result, worth caching so it isn't re-fetched every
// run) — but NOT when the fetch itself failed, since caching a guess from a transient
// network error would permanently and wrongly block that operator from ever sparking.
async function resolveOperatorDebutEvent(name, cache) {
  if (Object.prototype.hasOwnProperty.call(cache, name)) return cache[name];
  const apiJson = await fetchEventDetailsViaApi(name);
  const html = apiJson?.parse?.text?.['*'] || '';
  if (!html) {
    console.error('Failed to fetch page for operator', name, '- leaving debut event uncached');
    return null;
  }
  const debut = extractOperatorDebutEvent(html);
  const debutEvent = debut && debut.introduced ? debut.event : null;
  cache[name] = debutEvent;
  return debutEvent;
}

export { loadOperatorDebutCache, saveOperatorDebutCache, resolveOperatorDebutEvent };
