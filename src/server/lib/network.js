import https from 'https';
import fs from 'fs';
import { wikiApiBase, wikiBase, indexUrl } from '../config.js';
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
          const dir = require('path').dirname(filepath);
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
};
