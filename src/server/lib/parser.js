const { JSDOM } = require('jsdom');

// (Table-aware parseIndexHtml removed from this position; the exported version lives further down.)

function extractOrigPrimeFromHtml(html) {
  if (!html) return null;
  // strip tags and search text for typical phrasing
  const text = html.replace(/<[^>]+>/g, ' ');
  const m = text.match(/operations are worth\D*(\d+)/i) || text.match(/(\d+)\s*Originite Prime/i);
  if (m) return parseInt(m[1]);
  return null;
}

function extractHhPermitsFromHtml(html) {
  if (!html) return null;
  try {
    // strip <style> blocks to avoid jsdom CSS parsing errors
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;

    // 0) Prefer scanning Store tables: find a table with a 'Stock' header and return the Stock for the Headhunting Permit row.
    const allTables = Array.from(doc.querySelectorAll('table'));
  for (const table of allTables) {
      const headers = Array.from(table.querySelectorAll('th')).map(th => (th.textContent || '').trim().toLowerCase());
      const stockIdx = headers.findIndex(h => /stock/i.test(h));
      if (stockIdx >= 0) {
        const rows = Array.from(table.querySelectorAll('tr'));
        for (const row of rows) {
          const tds = Array.from(row.querySelectorAll('td'));
          if (tds.length <= stockIdx) continue;
          // detect Headhunting Permit by presence of data-name attribute inside the row
          const itemEl = row.querySelector('[data-name]');
          if (itemEl && /Headhunting Permit/i.test(itemEl.getAttribute('data-name') || '')) {
            const stockTxt = tds[stockIdx].textContent || '';
            const m = stockTxt.match(/(\d{1,5})/);
            if (m) return parseInt(m[1]);
            // if stock is infinity or non-numeric, skip
          }
        }
      }
    }

    // Prefer summing explicit .quantity values tied to item-tooltips named "Headhunting Permit".
    const tips = Array.from(doc.querySelectorAll('[data-name]')).filter(el => /Headhunting Permit/i.test(el.getAttribute('data-name') || ''));
    let sum = 0;
    for (const tip of tips) {
      // Look for a .quantity element inside the same item container
      const itemContainer = tip.closest('.item') || tip.closest('div') || tip.parentElement;
      let qEl = null;
      if (itemContainer) qEl = itemContainer.querySelector('.quantity');
      // If not found, try to find a quantity in the same table row (Stock column)
      if (!qEl) {
        const tr = tip.closest('tr');
        if (tr) {
          // try to find an element with class quantity inside the row
          qEl = tr.querySelector('.quantity');
          if (!qEl) {
            // fallback: look for a td that is likely the Stock column (small integer, avoid px)
            const tds = Array.from(tr.querySelectorAll('td'));
            for (const td of tds) {
              if (td.contains(tip)) continue;
              const txt = td.textContent || '';
              // find standalone numbers not part of 'px' or other words
              const m = txt.match(/\b(\d{1,4})\b/);
              if (m) {
                const v = parseInt(m[1]);
                // heuristics: stock values are small (<=100)
                if (!isNaN(v) && v > 0 && v <= 100) { sum += v; qEl = { _fake: true }; break; }
              }
            }
          }
        }
      }
      if (qEl && !qEl._fake) {
        const v = parseInt(qEl.textContent.trim());
        if (!isNaN(v) && v > 0) sum += v;
      }
    }
    if (sum > 0) return sum;

    // If no explicit quantities found, collect candidate numbers but ignore px-suffixed numbers (image sizes like 50px)
    const candidates = [];
    for (const table of allTables) {
      const rows = Array.from(table.querySelectorAll('tr'));
      for (const row of rows) {
        if (!/Headhunting Permit/i.test(row.textContent)) continue;
        const qEl = row.querySelector('.quantity');
        if (qEl) { const v = parseInt(qEl.textContent.trim()); if (!isNaN(v)) candidates.push(v); }
        // collect numeric tokens but filter out tokens immediately followed or preceded by 'px'
        const text = row.textContent || '';
        const nums = Array.from(text.matchAll(/\b(\d{1,4})\b/g)).map(m => parseInt(m[1]));
        for (const n of nums) {
          if (isNaN(n)) continue;
          // ensure the number isn't part of a 'px' token in the raw HTML
          const rawIndex = html.indexOf(String(n));
          // If the substring 'px' appears immediately after the number in the html, skip it
          const after = html.substr(rawIndex, 5);
          if (/\d+px/.test(after)) continue;
          candidates.push(n);
        }
      }
    }

    // Regex fallback near Headhunting Permit mentions, but avoid px
    const hhMatchAll = Array.from(html.matchAll(/Headhunting Permit[\s\S]{0,200}?(?:>(\d+)<|\b(\d+)\b)/ig));
    for (const mm of hhMatchAll) {
      const n = parseInt(mm[1] || mm[2]);
      if (!isNaN(n)) {
        // make sure this numeric occurrence isn't immediately followed by 'px' in the raw html
        const idx = html.indexOf(String(n));
        const after = html.substr(idx, 5);
        if (/\d+px/.test(after)) continue;
        candidates.push(n);
      }
    }

    if (candidates.length) {
      const small = candidates.filter(n => n > 0 && n <= 100);
      if (small.length) {
        // prefer the most frequent small value
        const freq = {};
        for (const v of small) freq[v] = (freq[v] || 0) + 1;
        let best = null, bestCount = 0;
        for (const k of Object.keys(freq)) {
          if (freq[k] > bestCount) { best = parseInt(k); bestCount = freq[k]; }
        }
        if (best != null) return best;
      }
      const positive = candidates.filter(n => n > 0);
      if (positive.length) return Math.min(...positive);
    }
  } catch (e) {
    // ignore errors and fallback to regex
  }

  // final regex fallback
  const hhMatch = html.match(/Headhunting Permit[\s\S]{0,200}?(?:Stock[\s\S]{0,50})?(?:>(\d+)<|\b(\d+)\b)/i);
  if (hhMatch) return parseInt(hhMatch[1] || hhMatch[2]);
  return null;
}

// Extract event "Type" from the event detail API HTML.
// The markup looks like:
// <div class="druid-row druid-row-type" data-druid-section-row="Intro"><div class="druid-label druid-label-type">Type</div><div class="druid-data druid-data-type druid-data-nonempty">
// <a href="/wiki/Event/Side_Story" title="Event/Side Story">Side Story</a>–Celebration</div></div>
// We want to return: "Side Story (Celebration)"
function extractEventTypeFromHtml(html) {
  if (!html) return null;
  try {
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;
    const row = doc.querySelector('.druid-row-type');
    if (!row) return null;
    const dataEl = row.querySelector('.druid-data-type');
    if (!dataEl) return null;
    // Gather text nodes and links
    const link = dataEl.querySelector('a');
    const primary = link ? (link.textContent || '').trim() : '';
    // Normalize raw text (convert non-breaking spaces to regular spaces and collapse whitespace)
    const rawText = (dataEl.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    // The remainder (e.g. –Celebration) may be plain text or separated by an en-dash
    let remainder = rawText.replace((link && link.textContent) || '', '').trim();
    // If no link present, return the normalized raw text
    if (!link) {
      // remove leading dash characters if any
      const cleaned = rawText.replace(/^[\s\u2013\-–—]+/, '').trim();
      if (cleaned) return cleaned;
      return null;
    }
    // normalize en-dash/minus/dash characters
    remainder = remainder.replace(/^[\s\u2013\-–—]+/, '').trim();
    if (primary && remainder) return `${primary} (${remainder})`;
    if (primary) return primary;
  } catch (e) {
    // fallthrough
  }
  return null;
}

// High level parse: given an HTML string (API parse HTML), return best guesses
function parseEventFromHtml(html) {
  const result = { origPrime: null, hhPermits: null, type: null, debug: null };
  if (!html) return result;
  try {
    const op = extractOrigPrimeFromHtml(html);
    if (op != null) result.origPrime = op;
  } catch (e) {}
  try {
    const hh = extractHhPermitsFromHtml(html);
    if (hh != null) result.hhPermits = hh;
  } catch (e) {}

  try {
    const t = extractEventTypeFromHtml(html);
    if (t) result.type = t;
  } catch (e) {}

  if (result.origPrime == null) {
    // produce a small debug snippet to help locate OP in the html
    const txt = html.replace(/<[^>]+>/g, ' ');
    const idx = txt.search(/Originite|Originite Prime|operations are worth/i);
    if (idx >= 0) result.debug = txt.slice(Math.max(0, idx - 200), idx + 400);
    else result.debug = txt.slice(0, 600);
  }
  return result;
}

// Multi-source parsing was removed in favor of the API-only flow. Use
// `parseEventFromHtml(html)` directly with the API parse HTML.


// Extract events from the MediaWiki API parse HTML for the Event page.
// Returns array of { name, dateStr, type, image, link } where dateStr is the raw cell text.
function parseIndexHtml(html) {
  if (!html) return [];
  const { JSDOM } = require('jsdom');
  const clean = (html || '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const dom = new JSDOM(clean);
  const doc = dom.window.document;

  const events = [];

  const tables = Array.from(doc.querySelectorAll('table'));
  for (const table of tables) {
    const th = table.querySelector('th');
    const headerText = th ? (th.textContent || '').toLowerCase() : '';
    if (!headerText.includes('event') || !table.textContent.toLowerCase().includes('release date')) continue;

    const rows = Array.from(table.querySelectorAll('tr'));
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td'));
      if (!cells || cells.length < 1) continue;
      const first = cells[0];
      const linkEl = first.querySelector('a[href]');
      let name = '';
      let link = null;
      if (linkEl) {
        link = linkEl.getAttribute('href') || linkEl.href || null;
        name = (linkEl.getAttribute('title') || linkEl.textContent || '').trim();
      }
      if ((!name || name.length === 0) && first.querySelector('b')) {
        name = (first.querySelector('b').textContent || '').trim();
      }
      if ((!name || name.length === 0)) {
        name = (first.textContent || '').replace(/\s+/g, ' ').replace(/\[[^\]]+\]/g, '').trim();
      }

      let dateStr = null;
      let globalDateStr = null;
      let cnDateStr = null;
      
      if (cells.length >= 2) {
        const secondText = (cells[1].textContent || '').replace(/\s+/g, ' ').trim();
        if (secondText.length > 0) {
          dateStr = secondText;
          
          // Extract Global dates: look for "Global: YYYY/MM/DD–YYYY/MM/DD" or similar
          const globalMatch = secondText.match(/Global:\s*([^()]+?)(?:\s*\(|$)/i);
          if (globalMatch) {
            globalDateStr = globalMatch[1].trim();
          }
          
          // Extract CN dates: look for "CN: YYYY/MM/DD–YYYY/MM/DD" or similar
          const cnMatch = secondText.match(/CN:\s*([^()]+?)(?:\s*\(|$)/i);
          if (cnMatch) {
            cnDateStr = cnMatch[1].trim();
          }
        }
      }

      const img = first.querySelector('img');
      let image = null;
      if (img) image = img.getAttribute('src') || img.src || null;

      if (link && link.startsWith('/') ) {
        try { link = new URL(link, require('../config').wikiBase).toString(); } catch (e) { /* ignore */ }
      }

      if (name && name.length > 0 && !name.toLowerCase().includes('arknights:')) {
        events.push({ 
          name: name.replace(/\s+/g, ' ').trim(), 
          dateStr, 
          globalDateStr, 
          cnDateStr, 
          type: null, 
          image, 
          link 
        });
      }
    }
    if (events.length > 0) return events.filter((e, i, arr) => arr.findIndex(e2 => e2.name === e.name) === i);
  }
  return [];
}

// Consolidated exports: provide all public functions from this module
module.exports = {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractEventTypeFromHtml,
  parseEventFromHtml,
  parseIndexHtml
};


