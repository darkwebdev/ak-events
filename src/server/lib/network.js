import https from 'https';
import fs from 'fs';
import path from 'path';
import {
  wikiApiBase,
  wikiBase,
  indexUrl,
  gachaTableUrl,
  characterTableUrl,
  activityTableUrl,
  stageTableUrl,
  arkpediaBase,
} from '../config.js';
import { parseIndexHtml } from './parser.js';

function fetchWikiApi(title) {
  return new Promise((resolve, reject) => {
    // Ensure title is not double-encoded (some links include percent-encoding like %27)
    let decodedTitle = title || '';
    try {
      decodedTitle = decodeURIComponent(decodedTitle);
    } catch (e) {
      /* keep original if decode fails */
    }
    const encoded = encodeURIComponent(decodedTitle);
    const apiUrl = `${wikiApiBase}?action=parse&page=${encoded}&prop=text&format=json`;
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json',
      },
    };
    https
      .get(apiUrl, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          // If response looks like HTML (Cloudflare challenge or other block), indicate blocked
          if (typeof data === 'string' && data.trim().startsWith('<'))
            return resolve({ statusCode: res.statusCode, body: null, blocked: true });
          try {
            const json = JSON.parse(data);
            resolve({ statusCode: res.statusCode, body: json });
          } catch (e) {
            resolve({ statusCode: res.statusCode, body: null });
          }
        });
      })
      .on('error', reject);
  });
}

// dedupeEvents removed: index parsing and deduping handled in parseIndexHtml

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    try {
      // If url is site-relative (/images/...), resolve against wikiBase
      if (url && url.startsWith('/')) url = new URL(url, wikiBase).toString();
    } catch (e) {}
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Referer: indexUrl,
      },
    };
    https
      .get(url, options, (res) => {
        if (res.statusCode === 200) {
          const dir = path.dirname(filepath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const file = fs.createWriteStream(filepath);
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        } else {
          reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

// Fetch event details via the wiki API. Accepts either a page title or a full wiki URL.
async function fetchEventDetailsViaApi(urlOrTitle) {
  try {
    let title = urlOrTitle || '';
    // If passed a URL, try to derive the title using wiki helper
    if (/^https?:\/\//i.test(title)) {
      try {
        const wikiModule = await import('./wiki.js');
        const titleFromUrl =
          (wikiModule.default && wikiModule.default.titleFromUrl) || wikiModule.titleFromUrl;
        if (typeof titleFromUrl === 'function') title = titleFromUrl(title);
      } catch (e) {
        /* ignore */
      }
    }
    const api = await fetchWikiApi(title);
    if (api && api.statusCode === 200 && api.body) return api.body;
  } catch (e) {
    // ignore
  }
  return null;
}

// Fetch the Events index via the wiki API (action=parse on the 'Event' page) and parse it
async function fetchEventsViaApi() {
  try {
    const api = await fetchWikiApi('Event');
    if (api) {
      if (api.blocked) return null; // blocked by cloudflare or similar
      if (
        api.statusCode === 200 &&
        api.body &&
        api.body.parse &&
        api.body.parse.text &&
        api.body.parse.text['*']
      ) {
        const html = api.body.parse.text['*'];
        const events = parseIndexHtml(html);
        return events;
      }
    }
  } catch (e) {
    // ignore and fall through to null
  }
  return null;
}

// Fetch a "Headhunting/Banners/{year}" or "Headhunting/Banners/Upcoming" page's raw
// parse HTML via the wiki API. Returns the HTML string, or null on error/blocked.
async function fetchBannersPageHtml(pageTitle) {
  try {
    const api = await fetchWikiApi(pageTitle);
    if (api) {
      if (api.blocked) return null;
      if (
        api.statusCode === 200 &&
        api.body &&
        api.body.parse &&
        api.body.parse.text &&
        api.body.parse.text['*']
      ) {
        return api.body.parse.text['*'];
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Fetch an operator's MediaWiki categories (a lightweight query, no page HTML) to
// determine whether they're a Limited operator: a Limited operator is not tagged
// with any of the "obtainable through X" categories (Standard/Kernel Headhunting,
// Recruitment) that every non-exclusive operator carries.
// Returns an array of category names on success (which may legitimately be empty —
// that's exactly what marks a Limited operator), or null if the fetch/parse failed.
// Callers must NOT treat null the same as an empty array: a failed fetch is not
// evidence of anything, and caching `null` as "no categories" would permanently
// mislabel an operator based on a transient network error.
async function fetchOperatorCategories(name) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(name);
    const apiUrl = `${wikiApiBase}?action=parse&page=${encoded}&prop=categories&format=json`;
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json',
      },
    };
    https
      .get(apiUrl, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          try {
            const json = JSON.parse(data);
            if (!json || json.error || !json.parse) {
              resolve(null);
              return;
            }
            const categories = (json.parse.categories || []).map((c) => c['*']);
            resolve(categories);
          } catch (e) {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

// Fetch and JSON-parse an arbitrary URL — used for the raw ArknightsGameData tables
// (see lib/sparkCost.js). Resolves to null on any error rather than throwing/rejecting,
// since this data is used to compute a "nice to have" spark-cost display and should
// never be able to abort a whole scrape run the way a thrown error could.
function fetchJsonUrl(url) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { 'User-Agent': 'ak-events-scraper' } }, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(null);
          }
        });
      })
      .on('error', () => resolve(null));
  });
}

// Fetch the game's own gacha pool data — this is what tells us exactly when each
// Limited 6★ operator debuted (an authoritative alternative to the wiki, which
// doesn't state debut dates directly): every LIMITED-type pool's `limitParam` names
// the one operator it debuted, alongside an exact `openTime` timestamp. See
// lib/sparkCost.js for what this is used for.
function fetchGachaTable() {
  return fetchJsonUrl(gachaTableUrl);
}

// Fetch the game's own character data — used only to map the gacha table's numeric
// character ids (e.g. "char_2023_ling") back to the operator names our own scraped
// banner data uses (e.g. "Ling").
function fetchCharacterTable() {
  return fetchJsonUrl(characterTableUrl);
}

// Fetch an arbitrary URL's raw text body — used for arkpedia.net pages (see
// lib/arkpedia.js), which embed their data as a `__NEXT_DATA__` JSON script tag
// rather than exposing it at a stable API endpoint. Resolves to null on any error
// rather than throwing, same as fetchJsonUrl above: a supplementary source should
// never be able to abort a whole scrape run.
function fetchTextUrl(url) {
  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        },
        (res) => {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', () => resolve(null));
  });
}

// Fetch the game's own activity data — the primary source for event dates now (see
// lib/gameData.js). Only contains events already added to the EN client.
function fetchActivityTable() {
  return fetchJsonUrl(activityTableUrl);
}

// Fetch the game's own per-stage data — used to compute an event's total Originite
// Prime reward from its stages' diamondOnceDrop fields (see lib/gameData.js). This
// file is large (~20MB); only fetched once per scrape run.
function fetchStageTable() {
  return fetchJsonUrl(stageTableUrl);
}

// Fetch arkpedia.net's events listing page and return its raw HTML (for
// lib/arkpedia.js to parse the embedded __NEXT_DATA__ JSON out of). Resolves to null
// on any error — arkpedia is a supplementary source, never one that should be able to
// abort a whole scrape run.
async function fetchArkpediaEventsHtml() {
  try {
    return await fetchTextUrl(`${arkpediaBase}/events`);
  } catch (e) {
    return null;
  }
}

// Fetch a single arkpedia.net event's own detail page HTML by its exact page name
// (as found in the events listing's own `name` field — arkpedia's event URLs are
// literally /events/<name>, not a separate slug).
async function fetchArkpediaEventDetailHtml(name) {
  try {
    return await fetchTextUrl(`${arkpediaBase}/events/${encodeURIComponent(name)}`);
  } catch (e) {
    return null;
  }
}

// Fetch the Upcoming events page (CN upcoming list) via the wiki API and parse it
async function fetchUpcomingViaApi() {
  try {
    const api = await fetchWikiApi('Event/Upcoming');
    if (api) {
      if (api.blocked) return null;
      if (
        api.statusCode === 200 &&
        api.body &&
        api.body.parse &&
        api.body.parse.text &&
        api.body.parse.text['*']
      ) {
        const html = api.body.parse.text['*'];
        const events = parseIndexHtml(html);
        return events;
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export {
  fetchWikiApi,
  downloadImage,
  fetchEventDetailsViaApi,
  fetchEventsViaApi,
  fetchUpcomingViaApi,
  fetchBannersPageHtml,
  fetchOperatorCategories,
  fetchGachaTable,
  fetchCharacterTable,
  fetchActivityTable,
  fetchStageTable,
  fetchArkpediaEventsHtml,
  fetchArkpediaEventDetailHtml,
};
