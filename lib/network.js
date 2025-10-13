const https = require('https');
const fs = require('fs');
const config = require('../config');

// Simple HTTPS GET helper returning body as string
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // detect blocked content (Cloudflare, captcha, anti-bot)
        try {
          if (isBlockedHtml(data)) return resolve({ statusCode: res.statusCode, body: null, blocked: true });
        } catch (e) { /* ignore detector errors */ }
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

// Detects if returned HTML looks like a block / anti-bot challenge (Cloudflare, Captcha)
function isBlockedHtml(html) {
  if (!html || typeof html !== 'string') return false;
  const lowered = html.toLowerCase();
  const indicators = [
    'cloudflare', 'attention required', 'please enable javascript', 'captcha', 'ray id', 'checking your browser', 'access denied'
  ];
  for (const ind of indicators) if (lowered.includes(ind)) return true;
  // Also detect meta refresh to another challenge page
  if (/meta[^>]+http-equiv=["']?refresh["']?/i.test(html)) return true;
  return false;
}

// Fetch parsed HTML via the wiki API (action=parse) for a given page title
function fetchWikiApi(title) {
  return new Promise((resolve, reject) => {
    // Ensure title is not double-encoded (some links include percent-encoding like %27)
    let decodedTitle = title || '';
    try { decodedTitle = decodeURIComponent(decodedTitle); } catch (e) { /* keep original if decode fails */ }
    const encoded = encodeURIComponent(decodedTitle);
    const apiUrl = `${config.wikiApiBase}?action=parse&page=${encoded}&prop=text&format=json`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json'
      }
    };
    https.get(apiUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ statusCode: res.statusCode, body: json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: null });
        }
      });
    }).on('error', reject);
  });
}

const { createRenderer } = require('./renderer');

const indexUrl = config.indexUrl;

// Parse index HTML into array of event descriptors (name, dateStr, type, image, link)
function parseIndexHtml(html) {
  if (!html) return [];
  const { JSDOM } = require('jsdom');
  // strip <style> blocks to avoid jsdom CSS parsing errors for modern CSS constructs
  const cleanHtml = (html || '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const dom = new JSDOM(cleanHtml);
  const doc = dom.window.document;
  const elements = Array.from(doc.querySelectorAll('*')).filter(el => {
    const t = el.textContent || '';
    // allow detection via child anchor hrefs as well as text
    const a = el.querySelector && el.querySelector('a');
  const href = a ? (a.href || a.getAttribute('href') || '') : '';
    // require the anchor href to match the expected wiki base to avoid noisy links
  const hasWiki = href && href.startsWith(config.wikiBase) && !href.includes('#Operator_Modules');
    return hasWiki &&
      (t.includes('Event') || t.includes('Story') || t.includes('Vignette') || t.includes('Strategies') || t.includes('Contract') || t.includes('Rerun') || t.includes('Collab') || t.includes('Special')) &&
      !t.includes('Maintenance');
  });
  const events = [];
  elements.forEach(el => {
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    let splitOn = '';
    if (text.includes('Event')) splitOn = 'Event';
    else if (text.includes('Story')) splitOn = 'Story';
    else if (text.includes('Vignette')) splitOn = 'Vignette';
    else if (text.includes('Strategies')) splitOn = 'Strategies';
    else if (text.includes('Contract')) splitOn = 'Contract';
    else if (text.includes('Rerun')) splitOn = 'Rerun';
    else if (text.includes('Collab')) splitOn = 'Collab';
    else if (text.includes('Special')) splitOn = 'Special';
    if (!splitOn) return;
    // Prefer anchor text when it's human-friendly. If anchor text looks like a URL
    // (contains wiki.gg or starts with http), derive the title from the href path instead.
    const linkEl = el.tagName === 'A' ? el : el.querySelector('a');
    let name = '';
    if (linkEl) {
      const anchorText = (linkEl.textContent || '').replace(/\s+/g, ' ').trim();
      const hrefVal = linkEl.href || linkEl.getAttribute('href') || '';
      const looksLikeUrl = /https?:\/\//i.test(anchorText) || anchorText.includes('wiki.gg');
      if (anchorText && !looksLikeUrl) {
        name = anchorText;
      } else if (hrefVal) {
        // extract last path component from href and decode it. If the path ends with '/Rerun',
        // produce '<base title> (Rerun)'.
        try {
          const u = new URL(hrefVal, config.wikiBase);
          const parts = u.pathname.split('/').filter(Boolean);
          if (parts.length >= 2 && parts[parts.length - 1] === 'Rerun') {
            const base = parts.slice(0, parts.length - 1).pop() || '';
            name = decodeURIComponent(base).replace(/_/g, ' ').trim() + ' (Rerun)';
          } else {
            const last = parts[parts.length - 1] || '';
            name = decodeURIComponent(last).replace(/_/g, ' ').trim();
          }
        } catch (e) {
          name = '';
        }
      }
    }
    if (!name) {
      name = text.split(splitOn)[0].trim().replace('🔗', '').trim().replace(/\s*(limited|side)\s*$/i, '');
    }
    // discard obviously noisy/too-long names (after derivation)
    if (!name || name.length > 120) return;
    const dateMatch = text.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})/);
    let dateStr = null;
    if (dateMatch) dateStr = dateMatch[1];
    const img = el.querySelector('img');
    let image = null;
    if (img && (img.src || '').includes('/events/')) image = img.src;
  // reuse anchor element reference for href extraction
  const linkElForHref = el.tagName === 'A' ? el : el.querySelector('a');
  const link = linkElForHref ? (linkElForHref.href || linkElForHref.getAttribute('href')) : null;
    if (name && !name.includes('Arknights:') && name.length > 3) {
      events.push({ name, dateStr, type: splitOn, image, link });
    }
  });
  // Deduplicate by name
  return events.filter((e, i, arr) => arr.findIndex(e2 => e2.name === e.name) === i);
}

// Fetch rendered HTML using an abstract renderer. If renderer is provided, it must expose render(url, opts) and close().
// If no renderer is provided, a temporary Puppeteer renderer will be created and closed for this call.
async function fetchRenderedHtml(url, opts, renderer) {
  if (renderer && typeof renderer.render === 'function') {
    const html = await renderer.render(url, opts);
    if (isBlockedHtml(html)) return { statusCode: 200, body: null, blocked: true };
    return html;
  }
  // create temporary renderer
  const temp = await createRenderer();
  try {
    const html = await temp.render(url, opts);
    if (isBlockedHtml(html)) return { statusCode: 200, body: null, blocked: true };
    return html;
  } finally {
    try { await temp.close(); } catch (e) { /* ignore */ }
  }
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': config.referer || indexUrl
      }
    };
    https.get(url, options, (res) => {
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
    }).on('error', reject);
  });
}

// Thin wrappers that represent higher-level fetching operations. They call fetchRenderedHtml but are
// exported here so callers don't need to know about renderers directly.
function fetchIndexHtml(renderer) {
  return fetchRenderedHtml(config.indexUrl, { waitUntil: 'networkidle2', delay: 3000 }, renderer);
}

function fetchEventHtml(url, renderer) {
  return fetchRenderedHtml(url, { waitUntil: 'networkidle2', delay: 300 }, renderer);
}

module.exports = { indexUrl, parseIndexHtml, fetchHtml, fetchWikiApi, downloadImage, fetchRenderedHtml, fetchIndexHtml, fetchEventHtml, isBlockedHtml };
