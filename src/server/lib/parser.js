import { JSDOM } from 'jsdom';
import { wikiBase } from '../config.js';

// (Table-aware parseIndexHtml removed from this position; the exported version lives further down.)

function extractOrigPrimeFromHtml(html) {
  if (!html) return null;
  // strip tags and search text for typical phrasing
  // First, try conservative text regexes for explicit phrasing like "All X operations are worth N Originite Prime"
  // or "N Originite Prime" which commonly appears in the intro paragraph. These are more authoritative than
  // incidental .quantity elements shown elsewhere on the page.
  try {
    const text = html.replace(/<[^>]+>/g, ' ');
    const m =
      text.match(/operations are worth\D*(\d{1,4})\b/i) ||
      text.match(/\b(\d{1,4})\s*Originite Prime\b/i);
    if (m) {
      const [, numStr] = m;
      return parseInt(numStr, 10);
    }
  } catch (e) {
    // ignore and continue to DOM-based extraction
  }

  // Prefer a robust DOM-based extraction to avoid accidental matches in raw HTML (e.g. image sizes like '50px' or
  // large numeric tokens with 'K' suffix). Only if DOM search fails do we try other conservative text regexes.
  try {
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;

    const candidates = Array.from(doc.querySelectorAll('[data-name]')).filter((el) =>
      /Originite Prime/i.test(el.getAttribute('data-name') || '')
    );
    for (const el of candidates) {
      const td = el.closest('td');
      const itemContainer = el.closest('.item') || el.parentElement || el.closest('div');

      // detect if this td/tr/table looks like a paid store (contains Price or currency markers)
      const enclosingTr = td ? td.closest('tr') : null;
      const enclosingTable = td ? td.closest('table') : null;
      const isPaidContainer =
        (enclosingTr && /price|\$|US\$|USD|€|£/i.test(enclosingTr.textContent || '')) ||
        (enclosingTable && /price|\$|US\$|USD|€|£/i.test(enclosingTable.textContent || ''));

      // If this quantity is inside a paid pack/table, skip it — paid-store quantities are not authoritative for OP.
      if (isPaidContainer) continue;

      // 1) Prefer a .quantity element that follows the item container inside the same TD
      if (td) {
        const quantities = Array.from(td.querySelectorAll('.quantity'));
        if (itemContainer && quantities.length) {
          for (const q of quantities) {
            try {
              // DOCUMENT_POSITION_FOLLOWING = 4
              // Use a narrow eslint-disable-next-line to allow the single bitwise check here.
              // The check ensures q is following itemContainer in document order.
              /* eslint-disable-next-line no-bitwise */
              if (itemContainer.compareDocumentPosition(q) & 4) {
                const raw = (q.textContent || '').trim();
                const v = parseInt(raw, 10);
                if (!Number.isNaN(v) && v > 0 && v <= 10000) return v;
              }
            } catch (e) {
              // ignore and continue
            }
          }
        }
        // 2) fallback to first .quantity in td
        if (quantities.length) {
          const raw = (quantities[0].textContent || '').trim();
          const v = parseInt(raw);
          if (!Number.isNaN(v) && v > 0 && v <= 10000) return v;
        }

        // 3) if no .quantity, try to extract a small integer token from the TD text while ignoring tokens with 'K', 'px' or currency
        const tdText = (td.textContent || '')
          .replace(/\u00A0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (tdText && !/price|\$|US\$|USD|€|£/i.test(tdText)) {
          // find 1-4 digit tokens only (likely actual counts)
          const nums = Array.from(tdText.matchAll(/\b(\d{1,4})\b/g)).map((m) => parseInt(m[1], 10));
          for (const n of nums) {
            if (Number.isNaN(n)) continue;
            // ensure the token isn't part of a 'px' or 'K' suffix in the raw HTML nearby
            const idx = html.indexOf(String(n));
            const rawAfter = html.substr(idx, 6);
            if (/\d+px/.test(rawAfter)) continue;
            // skip tokens that are immediately followed by 'K' (e.g. '16700K') or preceded by 'K'
            const afterChar = html.substr(idx + String(n).length, 1);
            if (/K/i.test(afterChar)) continue;
            if (n > 0 && n <= 10000) return n;
          }
        }
      } else if (itemContainer) {
        const q = itemContainer.querySelector('.quantity');
        if (q) {
          const v = parseInt((q.textContent || '').trim(), 10);
          if (!Number.isNaN(v) && v > 0 && v <= 10000) return v;
        }
      }
    }
  } catch (e) {
    // fallthrough to conservative text regex
  }

  // Conservative text-based fallback: look for explicit phrasing but avoid matching large tokens or 'K'/'px'/currency
  try {
    const text = html.replace(/<[^>]+>/g, ' ');
    const m1 = text.match(/operations are worth\D*(\d{1,4})\b/i);
    if (m1) return parseInt(m1[1], 10);
    const m2 = text.match(/\b(\d{1,4})\s*Originite Prime\b/i);
    if (m2) return parseInt(m2[1], 10);
  } catch (e) {
    // ignore
  }
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
    // detect paid-store tables: tables that contain a header 'Price' or currency markers in headers
    const paidTables = new Set();
    for (const table of allTables) {
      const headerText = Array.from(table.querySelectorAll('th'))
        .map((th) => (th.textContent || '').trim())
        .join(' | ');
      const tableText = (table.textContent || '').trim();
      // mark as paid if header mentions Price or the table body/text contains price/currency markers
      if (
        /price/i.test(headerText) ||
        /price/i.test(tableText) ||
        /\$|US\$|USD|€|£/.test(headerText) ||
        /\$|US\$|USD|€|£/.test(tableText)
      )
        paidTables.add(table);
    }
    for (const table of allTables) {
      const headers = Array.from(table.querySelectorAll('th')).map((th) =>
        (th.textContent || '').trim().toLowerCase()
      );
      const stockIdx = headers.findIndex((h) => /stock/i.test(h));
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
            if (m) {
              // debug: found Stock column value
              // eslint-disable-next-line no-console
              const [, stockStr] = m;
              console.debug('extractHhPermitsFromHtml: stock table value ->', stockStr);
              // If this item is a Ten-roll permit, multiply by 10
              const name = itemEl.getAttribute('data-name') || '';
              const multiplier = /Ten-?roll/i.test(name) ? 10 : 1;
              return parseInt(stockStr, 10) * multiplier;
            }
            // if stock is infinity or non-numeric, skip
          }
        }
      }
    }

    // Prefer summing explicit .quantity values tied to item-tooltips named "Headhunting Permit".
    const tips = Array.from(doc.querySelectorAll('[data-name]')).filter((el) =>
      /Headhunting Permit/i.test(el.getAttribute('data-name') || '')
    );
    let sum = 0;
    for (const tip of tips) {
      // If the tip is inside a paid table, skip it
      const tipTable = tip.closest('table');
      if (tipTable && paidTables.has(tipTable)) continue;
      // Find the closest enclosing <td> (if any) and prefer a .quantity that is adjacent to the item element
      const td = tip.closest('td');
      const itemContainer = tip.closest('.item') || tip.parentElement || tip.closest('div');
      let qEl = null;
      if (td) {
        // prefer a .quantity that appears after the itemContainer in DOM order inside this td
        const quantities = Array.from(td.querySelectorAll('.quantity'));
        if (itemContainer) {
          for (const q of quantities) {
            try {
              // DOCUMENT_POSITION_FOLLOWING = 4
              /* eslint-disable-next-line no-bitwise */
              if (itemContainer.compareDocumentPosition(q) & 4) {
                qEl = q;
                break;
              }
            } catch (e) {
              // fallback: ignore compare failures
            }
          }
        }
        // fallback to first quantity in the td
        /* eslint-disable-next-line prefer-destructuring */
        if (!qEl && quantities.length) qEl = quantities[0];
      } else if (itemContainer) {
        qEl = itemContainer.querySelector('.quantity');
      }

      // If we still don't have a .quantity, try to extract a small integer from the same td only
      if (!qEl && td) {
        const tdTxt = td.textContent || '';
        // avoid extracting from tds that look like paid pack columns
        if (!/price|\$|US\$|USD|€|£/i.test(tdTxt)) {
          const m = tdTxt.match(/\b(\d{1,4})\b/);
          if (m) {
            const [, numStr] = m;
            const v = parseInt(numStr, 10);
            if (!Number.isNaN(v) && v > 0 && v <= 100) {
              // mark as synthetic
              qEl = { _fake: true, value: v };
            }
          }
        }
      }

      if (qEl) {
        // multiplier: Ten-roll permits count as 10 each
        const tipName = tip.getAttribute('data-name') || '';
        const multiplier = /Ten-?roll/i.test(tipName) ? 10 : 1;
        if (qEl._fake) {
          sum += qEl.value * multiplier;
        } else {
          const v = parseInt(qEl.textContent.trim());
          if (!Number.isNaN(v) && v > 0) sum += v * multiplier;
        }
      }
    }
    if (sum > 0) {
      // debug: summed explicit .quantity values
      // eslint-disable-next-line no-console
      console.debug('extractHhPermitsFromHtml: summed quantities ->', sum);
      return sum;
    }

    // If no explicit quantities found, collect candidate numbers but ignore px-suffixed numbers (image sizes like 50px)
    const candidates = [];
    for (const table of allTables) {
      // skip entire paid tables from consideration
      if (paidTables.has(table)) continue;
      const rows = Array.from(table.querySelectorAll('tr'));
      for (const row of rows) {
        if (!/Headhunting Permit/i.test(row.textContent)) continue;
        // If this row belongs to a paid table, skip it
        if (paidTables.has(table)) continue;
        // restrict numeric scanning to the td that contains the permit mention to avoid nearby unrelated numbers
        const td = Array.from(row.querySelectorAll('td')).find((t) =>
          /Headhunting Permit/i.test(t.textContent || '')
        );
        if (!td) continue;
        // skip td if it contains price markers (e.g., 'Price', '$', 'US$')
        if (/price|\$|US\$|USD|€|£/.test(td.textContent || '')) continue;
        const qEl = td.querySelector('.quantity');
        if (qEl) {
          const v = parseInt(qEl.textContent.trim());
          if (!Number.isNaN(v)) {
            const itemEl = td.querySelector('[data-name]');
            const multiplier =
              itemEl && /Ten-?roll/i.test(itemEl.getAttribute('data-name') || '') ? 10 : 1;
            candidates.push(v * multiplier);
          }
        }
        // collect numeric tokens inside this td but filter out tokens immediately followed or preceded by 'px'
        const text = td.textContent || '';
        const nums = Array.from(text.matchAll(/\b(\d{1,4})\b/g)).map((m) => parseInt(m[1], 10));
        for (const n of nums) {
          if (Number.isNaN(n)) continue;
          // ensure the number isn't part of a 'px' token in the raw HTML nearby
          const rawIndex = html.indexOf(String(n));
          const after = html.substr(rawIndex, 5);
          if (/\d+px/.test(after)) continue;
          // apply Ten-roll multiplier if the td contains a Ten-roll permit
          const itemEl = td.querySelector('[data-name]');
          const multiplier =
            itemEl && /Ten-?roll/i.test(itemEl.getAttribute('data-name') || '') ? 10 : 1;
          candidates.push(n * multiplier);
        }
      }
    }

    // Regex fallback near Headhunting Permit mentions, but avoid px
    const hhMatchAll = Array.from(
      html.matchAll(/Headhunting Permit[\s\S]{0,200}?(?:>(\d+)<|\b(\d+)\b)/gi)
    );
    for (const mm of hhMatchAll) {
      const [, g1, g2] = mm;
      const n = parseInt(g1 || g2, 10);
      if (!Number.isNaN(n)) {
        const matchStr = mm[0] || '';
        // ignore currency/price matches like 'US$25.99' or decimal numbers '25.99'
        if (/\$|US\$|USD|€|£/.test(matchStr)) continue;
        if (/\d+\.\d+/.test(matchStr)) continue;
        // make sure this numeric occurrence isn't immediately followed by 'px' in the raw html
        const idx = html.indexOf(String(n));
        const after = html.substr(idx, 5);
        if (/\d+px/.test(after)) continue;
        // if the matchStr contains Ten-roll, multiply
        const multiplier = /Ten-?roll/i.test(matchStr) ? 10 : 1;
        candidates.push(n * multiplier);
      }
    }

    if (candidates.length) {
      const small = candidates.filter((n) => n > 0 && n <= 100);
      if (small.length) {
        // prefer the most frequent small value
        const freq = {};
        for (const v of small) freq[v] = (freq[v] || 0) + 1;
        let best = null;
        let bestCount = 0;
        for (const k of Object.keys(freq)) {
          if (freq[k] > bestCount) {
            best = parseInt(k);
            bestCount = freq[k];
          }
        }
        if (best != null) {
          // debug: most frequent small candidate
          // eslint-disable-next-line no-console
          console.debug(
            'extractHhPermitsFromHtml: most frequent candidate ->',
            best,
            'counts:',
            bestCount
          );
          return best;
        }
      }
      const positive = candidates.filter((n) => n > 0);
      if (positive.length) {
        // debug: no small frequent candidate, returning min positive
        // eslint-disable-next-line no-console
        console.debug('extractHhPermitsFromHtml: min positive candidate ->', Math.min(...positive));
        return Math.min(...positive);
      }
    }
  } catch (e) {
    // ignore errors and fallback to regex
  }

  // final regex fallback
  const hhMatch = html.match(
    /Headhunting Permit[\s\S]{0,200}?(?:Stock[\s\S]{0,50})?(?:>(\d+)<|\b(\d+)\b)/i
  );
  if (hhMatch) {
    // debug: final regex fallback
    // eslint-disable-next-line no-console
    const matchedStr = hhMatch[0] || '';
    // avoid currency/price matches like 'US$25.99' or decimal numbers
    if (/\$|US\$|USD|€|£/.test(matchedStr)) return null;
    if (/\d+\.\d+/.test(matchedStr)) return null;
    // avoid px-based numeric tokens (image widths like '50px')
    if (/\d+px/.test(matchedStr)) return null;
    // debug: final regex fallback
    // eslint-disable-next-line no-console
    console.debug('extractHhPermitsFromHtml: regex fallback ->', hhMatch[1] || hhMatch[2]);
    return parseInt(hhMatch[1] || hhMatch[2]);
  }
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
    const rawText = (dataEl.textContent || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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
  const clean = (html || '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const dom = new JSDOM(clean);
  const doc = dom.window.document;

  const events = [];

  const tables = Array.from(doc.querySelectorAll('table'));
  for (const table of tables) {
    const th = table.querySelector('th');
    const headerText = th ? (th.textContent || '').toLowerCase() : '';
    if (!headerText.includes('event') || !table.textContent.toLowerCase().includes('release date'))
      continue;

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
      if (!name || name.length === 0) {
        name = (first.textContent || '')
          .replace(/\s+/g, ' ')
          .replace(/\[[^\]]+\]/g, '')
          .trim();
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

      if (link && link.startsWith('/')) {
        try {
          link = new URL(link, wikiBase).toString();
        } catch (e) {
          /* ignore */
        }
      }

      if (name && name.length > 0 && !name.toLowerCase().includes('arknights:')) {
        events.push({
          name: name.replace(/\s+/g, ' ').trim(),
          dateStr,
          globalDateStr,
          cnDateStr,
          type: null,
          image,
          link,
        });
      }
    }
    if (events.length > 0)
      return events.filter((e, i, arr) => arr.findIndex((e2) => e2.name === e.name) === i);
  }
  return [];
}

// Consolidated exports: provide all public functions from this module
export {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractEventTypeFromHtml,
  parseEventFromHtml,
  parseIndexHtml,
};
