import { JSDOM } from 'jsdom';
import { wikiBase } from '../config.js';

// (Table-aware parseIndexHtml removed from this position; the exported version lives further down.)

function extractOrigPrimeFromHtml(html: string | null | undefined): number | null {
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
          const v = parseInt(raw, 10);
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

function extractHhPermitsFromHtml(html: string | null | undefined): number | null {
  if (!html) return null;
  try {
    // strip <style> blocks to avoid jsdom CSS parsing errors
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;

    // 0) Prefer scanning Store tables: find a table with a 'Stock' header and return the Stock for the Headhunting Permit row.
    const allTables = Array.from(doc.querySelectorAll('table'));
    // detect paid-store tables: tables that contain a header 'Price' or currency markers in headers
    const paidTables = new Set<Element>();
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
      let qEl: Element | { _fake: true; value: number } | null = null;
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
      // A reward table can also put the quantity in its own cell of the permit's row.
      if (!qEl) qEl = tip.closest('tr')?.querySelector('.quantity') ?? null;

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
        if ('_fake' in qEl) {
          sum += qEl.value * multiplier;
        } else {
          const v = parseInt((qEl.textContent || '').trim(), 10);
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
  } catch (e) {
    // ignore
  }
  // No store stock or explicit quantity for a free Headhunting Permit: report
  // "unknown", never a guess. This used to fall back to scanning for any number
  // near the words "Headhunting Permit", which picked up whatever was nearby — the
  // "39" of an HTML-escaped apostrophe (&#39;) in a paid permit's tooltip, or "The
  // 120 pulls to guarantee…" from a banner's rules — on pages whose only permits
  // were in paid packs.
  return null;
}

// Reruns replace one-time rewards (furniture, plaques, outfits) the player already
// owns from the original run with an "Intelligence Certificate" for each one —
// exchangeable at a fixed 5 Orundum each (100 Orundum per 20 certificates, per the
// in-game Intelligence Store). Every mission/threshold row that can pay out this
// substitute reward states a fixed, page-authored quantity (e.g. "Clear EA-3" pays
// 330 certificates if you already own that reward's furniture piece) — summing every
// such quantity gives the maximum a player could get from this rerun, i.e. if they
// already own every substitutable reward. This is a ceiling, not a guarantee: a
// player who doesn't already own everything gets the furniture instead of (some of)
// these certificates, same as anyone who hasn't done the original run at all. A
// non-rerun event page never mentions this item, so this naturally returns null for
// every regular event.
function extractIntCertsFromHtml(html: string | null | undefined): number | null {
  if (!html) return null;
  try {
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;
    const tips = Array.from(doc.querySelectorAll('[data-name="Intelligence Certificate"]'));
    let sum = 0;
    for (const tip of tips) {
      const container = tip.closest('td') || tip.closest('.item') || tip.parentElement;
      const qEl = container ? container.querySelector('.quantity') : null;
      if (!qEl) continue;
      const v = parseInt((qEl.textContent || '').trim(), 10);
      if (!Number.isNaN(v) && v > 0) sum += v;
    }
    return sum > 0 ? sum : null;
  } catch (e) {
    return null;
  }
}

// Extract event "Type" from the event detail API HTML.
// The markup looks like:
// <div class="druid-row druid-row-type" data-druid-section-row="Intro"><div class="druid-label druid-label-type">Type</div><div class="druid-data druid-data-type druid-data-nonempty">
// <a href="/wiki/Event/Side_Story" title="Event/Side Story">Side Story</a>–Celebration</div></div>
// We want to return: "Side Story (Celebration)"
function extractEventTypeFromHtml(html: string | null | undefined): string | null {
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
      const cleaned = rawText.replace(/^[\s–\-–—]+/, '').trim();
      if (cleaned) return cleaned;
      return null;
    }
    // normalize en-dash/minus/dash characters
    remainder = remainder.replace(/^[\s–\-–—]+/, '').trim();
    if (primary && remainder) return `${primary} (${remainder})`;
    if (primary) return primary;
  } catch (e) {
    // fallthrough
  }
  return null;
}

// An operator's own wiki page has a "How to obtain" infobox row whose value names the
// specific limited-banner category they came from, e.g. "Limited Headhunting -
// Festival", "- Carnival", "- Celebration". This is what distinguishes a Festival
// Limited operator (5-year spark-cost-reduction threshold, see lib/sparkCost.js) from
// every other Limited operator (4-year threshold) — the wiki doesn't expose a
// separate category tag for "Festival Limited", only this infobox text.
function extractObtainMethod(html: string | null | undefined): string | null {
  if (!html) return null;
  const m = html.match(
    /How to obtain<\/b>\s*<\/td>\s*<td>[\s\S]{0,300}?<span[^>]*>([^<]+)<\/span>/i
  );
  return m ? m[1].trim() : null;
}

interface OperatorDebutEvent {
  event: string;
  introduced: boolean;
}

// An operator's own wiki page has a "Changelog" section listing every event they've
// been touched by, newest first, as a list of top-level <li> entries (each with a
// nested <ul> for that event's specific changes, e.g. an outfit release or being
// rotated into a rate-up pool). The LAST top-level entry is chronologically the
// earliest — the operator's real debut — and its direct text (excluding the nested
// list) reads "Introduced." when that's genuinely when they were released, e.g.:
//   <li><b><a href="/wiki/X" title="X">X</a></b> <i>Introduced.</i></li>
// This is what determines spark eligibility: a Limited operator is rate-up but NOT
// sparkable on the banner where they debut — only once carried over to a later one.
function extractOperatorDebutEvent(html: string | null | undefined): OperatorDebutEvent | null {
  if (!html) return null;
  try {
    const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
    const dom = new JSDOM(clean);
    const doc = dom.window.document;
    const heading = [...doc.querySelectorAll('span.mw-headline')].find(
      (el) => el.id === 'Changelog'
    );
    if (!heading) return null;
    const changelogUl = [...doc.querySelectorAll('ul')].find(
      // eslint-disable-next-line no-bitwise
      (ul) => heading.compareDocumentPosition(ul) & 4
    );
    if (!changelogUl) return null;
    const topLevelEntries = [...changelogUl.children].filter((c) => c.tagName === 'LI');
    if (!topLevelEntries.length) return null;
    const debutEntry = topLevelEntries[topLevelEntries.length - 1];
    const link = debutEntry.querySelector('a');
    if (!link) return null;
    const withoutNestedList = debutEntry.cloneNode(true) as Element;
    const nestedUl = withoutNestedList.querySelector('ul');
    if (nestedUl) nestedUl.remove();
    const directText = (withoutNestedList.textContent || '').replace(/\s+/g, ' ').trim();
    return { event: (link.textContent || '').trim(), introduced: /introduced/i.test(directText) };
  } catch (e) {
    // ignore, fall through
  }
  return null;
}

// Free pulls a Limited banner gives out, which the event page's Headhunting section
// only states in prose (there's no item or quantity to read):
// - "Every day, the player can perform one headhunting pull for free in <banner>." —
//   one pull per day the banner runs; the count itself depends on the banner's dates,
//   so this only reports that the offer exists.
// - "A single <name> Headhunting Permit can be claimed while <banner> is up." — a
//   banner-only permit worth a ten-roll: every one the wiki describes (e.g. Bountiful
//   Harmony, Song of the Sea, Elite Forces, Expert, Collaboration Limited) reads "10
//   rolls at once", and newer ones like The Hitchers are only named in plain text.
const BANNER_PERMIT_PULLS = 10;

interface BannerFreePulls {
  dailyFreePull: boolean;
  bannerPermits: number | null;
  // Whether the page describes a featured banner at all ("… banner, X, is featured")
  // — until it does, a page saying nothing about free pulls isn't evidence of none.
  headhuntingDescribed: boolean;
  // The featured Limited banner's kind as the page names it, in the wiki's own banner
  // `type` vocabulary ("The sixth Limited Headhunting - Carnival banner" → carnival,
  // "limited crossover headhunting banner" → crossover) — for events whose banner
  // isn't on the Headhunting/Banners pages yet.
  bannerKind: string | null;
}

function extractBannerFreePulls(html: string | null | undefined): BannerFreePulls {
  if (!html) {
    return {
      dailyFreePull: false,
      bannerPermits: null,
      headhuntingDescribed: false,
      bannerKind: null,
    };
  }
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ');
  const dailyFreePull = /every day,? the player can perform one headhunting pull for free/i.test(
    text
  );
  const claimable = text.match(/\bA single\s+.{0,100}?\s*Headhunting Permit\s+can be claimed/gi);
  const bannerPermits = claimable ? claimable.length * BANNER_PERMIT_PULLS : null;
  const headhuntingDescribed = /\bbanner\b[^.]{0,120}?\bis featured\b/i.test(text);
  const kind =
    text.match(/Limited Headhunting\s*[-‐–]\s*(Festival|Carnival|Celebration)\s+banner/i)?.[1] ??
    (/\blimited crossover headhunting banner\b/i.test(text) ? 'crossover' : null);
  return {
    dailyFreePull,
    bannerPermits,
    headhuntingDescribed,
    bannerKind: kind ? kind.toLowerCase() : null,
  };
}

interface ParsedEventFromHtml {
  origPrime: number | null;
  hhPermits: number | null;
  dailyFreePull: boolean;
  bannerPermits: number | null;
  headhuntingDescribed: boolean;
  bannerKind: string | null;
  intCerts: number | null;
  type: string | null;
  debug: string | null;
}

// High level parse: given an HTML string (API parse HTML), return best guesses
function parseEventFromHtml(html: string | null | undefined): ParsedEventFromHtml {
  const result: ParsedEventFromHtml = {
    origPrime: null,
    hhPermits: null,
    dailyFreePull: false,
    bannerPermits: null,
    headhuntingDescribed: false,
    bannerKind: null,
    intCerts: null,
    type: null,
    debug: null,
  };
  if (!html) return result;
  try {
    const op = extractOrigPrimeFromHtml(html);
    if (op != null) result.origPrime = op;
  } catch (e) {
    /* ignore */
  }
  try {
    const hh = extractHhPermitsFromHtml(html);
    if (hh != null) result.hhPermits = hh;
  } catch (e) {
    /* ignore */
  }
  try {
    Object.assign(result, extractBannerFreePulls(html));
  } catch (e) {
    /* ignore */
  }
  try {
    const ic = extractIntCertsFromHtml(html);
    if (ic != null) result.intCerts = ic;
  } catch (e) {
    /* ignore */
  }

  try {
    const t = extractEventTypeFromHtml(html);
    if (t) result.type = t;
  } catch (e) {
    /* ignore */
  }

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

export interface ParsedIndexEvent {
  name: string;
  dateStr: string | null;
  globalDateStr: string | null;
  cnDateStr: string | null;
  type: string | null;
  image: string | null;
  link: string | null;
}

// Extract events from the MediaWiki API parse HTML for the Event page.
// Returns array of { name, dateStr, type, image, link } where dateStr is the raw cell text.
function parseIndexHtml(html: string | null | undefined): ParsedIndexEvent[] {
  if (!html) return [];
  const clean = (html || '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const dom = new JSDOM(clean);
  const doc = dom.window.document;

  const events: ParsedIndexEvent[] = [];

  const tables = Array.from(doc.querySelectorAll('table'));
  for (const table of tables) {
    // The wiki has used both "Event"/"Release date" and (currently) "Event"/"Date" as
    // column headers for this table, so match on the first column being "Event" and
    // ANY header column mentioning "date" (a substring match covers both wordings),
    // rather than requiring the literal phrase "release date" anywhere in the table.
    // This also excludes unrelated tables on the same page, like the "Commemorates"/
    // "CN event"/"Global event" seasonal-events tables, whose first column isn't "Event".
    const headerCells = Array.from(table.querySelectorAll('th')).map((headerCell) =>
      (headerCell.textContent || '').trim().toLowerCase()
    );
    const looksLikeEventsTable =
      headerCells[0] === 'event' && headerCells.some((h) => h.includes('date'));
    if (!looksLikeEventsTable) continue;

    const rows = Array.from(table.querySelectorAll('tr'));
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].querySelectorAll('td'));
      if (!cells || cells.length < 1) continue;
      const first = cells[0];
      const linkEl = first.querySelector('a[href]');
      let name = '';
      let link: string | null = null;
      if (linkEl) {
        link = linkEl.getAttribute('href') || (linkEl as HTMLAnchorElement).href || null;
        name = (linkEl.getAttribute('title') || linkEl.textContent || '').trim();
      }
      if ((!name || name.length === 0) && first.querySelector('b')) {
        name = (first.querySelector('b')?.textContent || '').trim();
      }
      if (!name || name.length === 0) {
        name = (first.textContent || '')
          .replace(/\s+/g, ' ')
          .replace(/\[[^\]]+\]/g, '')
          .trim();
      }

      let dateStr: string | null = null;
      let globalDateStr: string | null = null;
      let cnDateStr: string | null = null;

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
      let image: string | null = null;
      if (img) image = img.getAttribute('src') || (img as HTMLImageElement).src || null;

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
  extractBannerFreePulls,
  extractIntCertsFromHtml,
  extractEventTypeFromHtml,
  extractObtainMethod,
  extractOperatorDebutEvent,
  parseEventFromHtml,
  parseIndexHtml,
};
