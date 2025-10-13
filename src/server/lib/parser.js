const { JSDOM } = require('jsdom');

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

// High level parse: given an HTML string (rendered/printable/API), return best guesses
function parseEventFromHtml(html) {
  const result = { origPrime: null, hhPermits: null, debug: null };
  if (!html) return result;
  try {
    const op = extractOrigPrimeFromHtml(html);
    if (op != null) result.origPrime = op;
  } catch (e) {}
  try {
    const hh = extractHhPermitsFromHtml(html);
    if (hh != null) result.hhPermits = hh;
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

// Given multiple possible HTML sources, try them in order and merge missing fields.
function parseFromSources(sources = {}) {
  // sources: { renderedHtml, printableHtml, apiJson }
  const out = { origPrime: null, hhPermits: null, debug: null };
  try {
    if (sources.renderedHtml) {
      const r = parseEventFromHtml(sources.renderedHtml);
      if (r.origPrime != null) out.origPrime = r.origPrime;
      if (r.hhPermits != null) out.hhPermits = r.hhPermits;
      if (r.debug) out.debug = r.debug;
    }
    if ((out.origPrime == null || out.hhPermits == null) && sources.printableHtml) {
      const p = parseEventFromHtml(sources.printableHtml);
      if (out.origPrime == null && p.origPrime != null) out.origPrime = p.origPrime;
      if (out.hhPermits == null && p.hhPermits != null) out.hhPermits = p.hhPermits;
      if (!out.debug && p.debug) out.debug = p.debug;
    }
    if ((out.origPrime == null || out.hhPermits == null) && sources.apiJson) {
      const htmlText = sources.apiJson?.parse?.text?.['*'] || '';
      if (htmlText) {
        const a = parseEventFromHtml(htmlText);
        if (out.origPrime == null && a.origPrime != null) out.origPrime = a.origPrime;
        if (out.hhPermits == null && a.hhPermits != null) out.hhPermits = a.hhPermits;
        if (!out.debug && a.debug) out.debug = a.debug;
      }
    }
  } catch (e) {
    // swallow and fall through to best-effort result
  }
  // If still missing origPrime, produce small debug snippet from first available source
  if (out.origPrime == null) {
    const src = sources.renderedHtml || sources.printableHtml || (sources.apiJson?.parse?.text?.['*']) || '';
    const txt = (src || '').replace(/<[^>]+>/g, ' ');
    const idx = txt.search(/Originite|Originite Prime|operations are worth/i);
    if (idx >= 0) out.debug = txt.slice(Math.max(0, idx - 200), idx + 400);
    else out.debug = txt.slice(0, 600);
  }
  return out;
}

module.exports = { extractOrigPrimeFromHtml, extractHhPermitsFromHtml, parseEventFromHtml, parseFromSources };

// Extract events from the oldwell index HTML. Returns array of { name, dateStr, type, image, link }
function parseIndexHtml(html) {
  if (!html) return [];
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const elements = Array.from(doc.querySelectorAll('*')).filter(el => {
    const t = el.textContent || '';
    return t.includes('wiki.gg') &&
      (t.includes('Event') || t.includes('Story') || t.includes('Vignette') || t.includes('Strategies') || t.includes('Contract') || t.includes('Rerun') || t.includes('Collab') || t.includes('Special')) &&
      !t.includes('Maintenance');
  });
  const events = [];
  elements.forEach(el => {
    const text = el.textContent || '';
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
    const name = text.split(splitOn)[0].trim().replace('🔗', '').trim().replace(/\s*(limited|side)\s*$/i, '');
    const dateMatch = text.match(/Date:\s*(\d{2}\.\d{2}\.\d{4})/);
    let dateStr = null;
    if (dateMatch) dateStr = dateMatch[1];
    const img = el.querySelector('img');
    let image = null;
    if (img && (img.src || '').includes('/events/')) image = img.src;
    const linkEl = el.tagName === 'A' ? el : el.querySelector('a');
    const link = linkEl ? (linkEl.href || linkEl.getAttribute('href')) : null;
    if (name && !name.includes('Arknights:') && name.length > 3) {
      events.push({ name, dateStr, type: splitOn, image, link });
    }
  });
  // Deduplicate by name
  const unique = events.filter((e, i, arr) => arr.findIndex(e2 => e2.name === e.name) === i);
  return unique;
}


