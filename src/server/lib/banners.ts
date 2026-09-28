import { JSDOM } from 'jsdom';
import { parseDateRange } from './dateRange.js';
import type { BannerDateIndex, BannerOperator, BannerType, RawBanner } from '../types.js';

const SECTION_TYPES: Record<string, BannerType> = {
  Limited_Headhunting: 'Limited',
  Standard_Headhunting: 'Standard',
  Kernel_Headhunting: 'Kernel',
  Special_Headhunting: 'Special',
};

interface Heading {
  el: Element;
  type: BannerType;
}

// Find the closest Headhunting-type section heading that precedes `el` in document order.
function typeForElement(el: Element, headings: Heading[]): BannerType | null {
  let best: BannerType | null = null;
  for (const h of headings) {
    // eslint-disable-next-line no-bitwise
    if (h.el.compareDocumentPosition(el) & 4 /* DOCUMENT_POSITION_FOLLOWING */) {
      best = h.type;
    }
  }
  return best;
}

// On Headhunting/Banners/{year}, banners are grouped under Limited/Standard/Kernel/
// Special h2 sections, and each banner's own [tag] prefix only names its subtype (e.g.
// "[Carnival]") since the type is already conveyed by the section. On
// Headhunting/Banners/Upcoming there are no such sections — every banner sits under one
// flat "List" heading — so the wiki instead spells the type out in the tag itself (e.g.
// "[Limited Headhunting ‐ Celebration]" or "[Standard Headhunting - Limited-Time]").
// Try that first since it's authoritative when present, falling back to the section
// heading for the year-archive pages where the tag alone doesn't name a type.
function typeFromTag(rawName: string): BannerType | null {
  const m = rawName.match(/^\[([^\]]+)\]/);
  if (!m) return null;
  const tag = m[1];
  if (/Limited Headhunting/i.test(tag)) return 'Limited';
  if (/Standard Headhunting/i.test(tag)) return 'Standard';
  if (/Kernel Headhunting/i.test(tag)) return 'Kernel';
  if (/Special Headhunting/i.test(tag)) return 'Special';
  return null;
}

// Parse a "Headhunting/Banners/{year}" or "Headhunting/Banners/Upcoming" wiki page
// (API parse HTML) into an array of banner records:
// { name, type, cnStart, cnEnd, globalStart, globalEnd, operators: [{ name, star, class, icon }] }
function parseBannersPage(html: string | null | undefined): RawBanner[] {
  if (!html) return [];
  const clean = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  const dom = new JSDOM(clean);
  const doc = dom.window.document;

  const headings: Heading[] = Array.from(doc.querySelectorAll('h2, h3'))
    .map((el) => {
      const headline = el.querySelector('.mw-headline');
      const id = headline && headline.id;
      return id && SECTION_TYPES[id] ? { el, type: SECTION_TYPES[id] } : null;
    })
    .filter((h): h is Heading => h !== null);

  const banners: RawBanner[] = [];
  const bannerTds = Array.from(doc.querySelectorAll('td')).filter((td) =>
    td.querySelector('.banner')
  );

  for (const td of bannerTds) {
    const nameEl = td.querySelector('.banner b');
    if (!nameEl) continue;
    const rawName = (nameEl.textContent || '').trim();
    const name = rawName.replace(/^\[[^\]]+\]\s*/, '');

    // parseDateRange scans for \d{4}[/-]\d{1,2}[/-]\d{1,2} tokens regardless of the
    // separator between them, so we just need to hand it the right substring of text
    // rather than trying to match the en-dash/hyphen between the two dates ourselves.
    const cellText = td.textContent || '';
    const cnIdx = cellText.indexOf('CN date:');
    const globalIdx = cellText.indexOf('Global date:');
    // Bound both segments defensively rather than trusting the rest of the cell's
    // text: a real date range is well under this length, so anything the wiki might
    // ever append after it (a footnote, another locale's date, stray prose) can't get
    // picked up by parseDateRange's greedy scan as a phantom extra date.
    const MAX_DATE_SEGMENT = 60;
    const cnSegment =
      cnIdx === -1
        ? null
        : cellText.slice(
            cnIdx + 'CN date:'.length,
            Math.min(
              globalIdx > cnIdx ? globalIdx : cellText.length,
              cnIdx + 'CN date:'.length + MAX_DATE_SEGMENT
            )
          );
    const globalSegment =
      globalIdx === -1
        ? null
        : cellText.slice(
            globalIdx + 'Global date:'.length,
            globalIdx + 'Global date:'.length + MAX_DATE_SEGMENT
          );
    const cnDates = parseDateRange(cnSegment);
    const globalDates = parseDateRange(globalSegment);

    const tr = td.closest('tr');
    const opTd = tr && Array.from(tr.querySelectorAll('td')).find((t) => t !== td);
    const operators: BannerOperator[] = opTd
      ? Array.from(opTd.querySelectorAll('.character-tooltip')).map((el) => {
          const img = el.querySelector('img');
          return {
            name: el.getAttribute('data-name') || null,
            star: parseInt(el.getAttribute('data-star') || '', 10) || null,
            class: el.getAttribute('data-class') || null,
            icon: img ? img.getAttribute('src') : null,
          };
        })
      : [];

    banners.push({
      name,
      type: typeFromTag(rawName) || typeForElement(td, headings),
      cnStart: cnDates.start,
      cnEnd: cnDates.end,
      globalStart: globalDates.start,
      globalEnd: globalDates.end,
      operators,
    });
  }

  return banners;
}

// The same real banner is commonly parsed twice: once from Headhunting/Banners/Upcoming
// and once from Headhunting/Banners/{year}, during the editorial-lag window where a
// banner is listed on both pages. Dedupe by name before date-indexing so that overlap
// is merged rather than treated as two competing banners — keeping the LAST occurrence
// for a given name, so callers control priority via array order (put the more
// authoritative/complete source later). Names are compared case- and
// whitespace-insensitively, since the wiki's editors don't keep capitalisation
// consistent between the two pages (e.g. "Rage of The Many" on Upcoming vs "Rage of
// the Many" on the year page) — and a missed match here matters, because Upcoming
// lists the CN roster, which can differ from Global's in the off-rate operators.
const bannerNameKey = (name: string) => name.toLowerCase().replace(/\s+/g, ' ').trim();

function dedupeBannersByName(banners: RawBanner[]): RawBanner[] {
  const byName = new Map<string, RawBanner>();
  for (const banner of banners) {
    const key = bannerNameKey(banner.name);
    // Delete first so a replacement takes the later entry's position in the order.
    byName.delete(key);
    byName.set(key, banner);
  }
  return [...byName.values()];
}

// Index `banners` by their start date, so a scraped event can be matched to its
// banner by "does a banner start on the same day this event does". If two DIFFERENT
// banners share the same start date (e.g. a dual Limited-banner drop), the Limited
// one wins since that's what matters most for this app, and the loser is logged
// rather than silently dropped.
function indexBannersByDate(banners: RawBanner[]): BannerDateIndex {
  const deduped = dedupeBannersByName(banners);
  const byGlobalStart: Record<string, RawBanner> = {};
  const byCnStart: Record<string, RawBanner> = {};
  const indexOne = (
    index: Record<string, RawBanner>,
    dateKey: string | null,
    banner: RawBanner
  ) => {
    if (!dateKey) return;
    const existing = index[dateKey];
    if (!existing) {
      index[dateKey] = banner;
      return;
    }
    if (existing === banner) return;
    const preferred = existing.type === 'Limited' || banner.type !== 'Limited' ? existing : banner;
    const dropped = preferred === existing ? banner : existing;
    console.warn(
      `Multiple banners start on ${dateKey}: keeping "${preferred.name}" (${preferred.type}), dropping "${dropped.name}" (${dropped.type})`
    );
    index[dateKey] = preferred;
  };
  for (const banner of deduped) {
    indexOne(byGlobalStart, banner.globalStart, banner);
    indexOne(byCnStart, banner.cnStart, banner);
  }
  return { byGlobalStart, byCnStart };
}

// Looser than bannerNameKey: the wikitext's `|name =` and the rendered title differ in
// punctuation ("Joint Operation 22" vs "Joint Operation #22") and in a rerun's
// " Rerun" suffix, which only the rendered title has.
const bannerTypeKey = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+rerun\s*$/, '')
    .replace(/[^a-z0-9]/g, '');

// Each {{Banners cell}} on a Headhunting/Banners page's wikitext, with the keys it can
// be looked up by (see bannerLookup): named cells by bannerTypeKey(name); numbered ones
// (Joint Operation, Orienteering…) have no `|name =` — the page generates their titles
// from `|no =` — so they're keyed by start date instead ("global:" / "cn:" +
// YYYY-MM-DD), the same dates events are matched to banners by.
function bannerCells(
  wikitext: string | null | undefined
): { keys: string[]; field: (key: string) => string }[] {
  if (!wikitext) return [];
  return [...wikitext.matchAll(/\{\{\s*Banners cell([^{}]*(?:\{\{[^{}]*\}\}[^{}]*)*)\}\}/gi)].map(
    (m) => {
      const field = (key: string) =>
        m[1].match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^|\\n}]*)`))?.[1].trim() ?? '';
      const name = field('name');
      if (name) return { keys: [bannerTypeKey(name)], field };
      const day = (value: string) => value.match(/\d{4}\/\d{2}\/\d{2}/)?.[0].replace(/\//g, '-');
      const globalDay = day(field('globalstart'));
      const cnDay = day(field('cnstart'));
      return {
        keys: [globalDay && `global:${globalDay}`, cnDay && `cn:${cnDay}`].filter(
          (k): k is string => !!k
        ),
        field,
      };
    }
  );
}

// Look `banner` up in a record built from bannerCells: by name, or for a numbered
// banner, by its start date.
function bannerLookup<T>(banner: RawBanner, record: Record<string, T>): T | null {
  return (
    record[bannerTypeKey(banner.name)] ??
    (banner.globalStart ? record[`global:${banner.globalStart}`] : undefined) ??
    (banner.cnStart ? record[`cn:${banner.cnStart}`] : undefined) ??
    null
  );
}

// Each banner's kind: the `|type =` field of its {{Banners cell |type = festival |name
// = … }} template. This is the wiki's own vocabulary (festival, carnival, celebration,
// crossover, special, jo, rerun…), which bannerRules.ts is keyed by; the rendered page
// only shows a [Tag] that, for a crossover, is the collaboration's name.
function parseBannerTypesFromWikitext(wikitext: string | null | undefined): Record<string, string> {
  const types: Record<string, string> = {};
  for (const { keys, field } of bannerCells(wikitext)) {
    const type = field('type').toLowerCase();
    if (type) for (const key of keys) types[key] = type;
  }
  return types;
}

// The wiki `type` of `banner`, from parseBannerTypesFromWikitext's result.
function bannerWikiType(banner: RawBanner, types: Record<string, string>): string | null {
  return bannerLookup(banner, types);
}

// A wikitext date-time like "2026/08/20 09:00:00" — Global server time, UTC-7 (as the
// in-game banners state: "August 20, 09:00 – October 1, 03:59 (UTC-7)") — as an ISO
// timestamp. Null for a bare date: the rendered pages carry dates only, and a
// countdown in hours needs the real time, not a guessed midnight.
function wikiTimeToIso(value: string): string | null {
  const m = value.match(/(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h, mi, sec = '00'] = m;
  return new Date(`${y}-${mo}-${d}T${h}:${mi}:${sec}-07:00`).toISOString();
}

export interface BannerTimes {
  globalStartAt: string;
  globalEndAt: string;
}

// Each banner's exact Global start and end, where the wikitext gives times (not just
// dates) for both.
function parseBannerTimesFromWikitext(
  wikitext: string | null | undefined
): Record<string, BannerTimes> {
  const times: Record<string, BannerTimes> = {};
  for (const { keys, field } of bannerCells(wikitext)) {
    const globalStartAt = wikiTimeToIso(field('globalstart'));
    const globalEndAt = wikiTimeToIso(field('globalend'));
    if (!globalStartAt || !globalEndAt) continue;
    for (const key of keys) times[key] = { globalStartAt, globalEndAt };
  }
  return times;
}

// A Limited series banner (Festival, Carnival or Celebration) from the wikitext, with
// the limited operators it debuted — its {{Banners cell}}'s `|limited =` field codes
// each of `|operators =` as 1 (debuts here), 2 (a returning limited rate-up) or 0 (not
// limited).
export interface SeriesBanner {
  type: string;
  key: string;
  cnStart: string;
  debuts: string[];
}

const SERIES_TYPES = new Set(['festival', 'carnival', 'celebration']);

// Every Limited series banner across the given Headhunting/Banners pages' wikitexts,
// oldest first (by CN start — both servers run a series in the same order), each once
// even when listed on more than one page.
function parseSeriesBanners(wikitexts: (string | null | undefined)[]): SeriesBanner[] {
  const byKey = new Map<string, SeriesBanner>();
  for (const wikitext of wikitexts) {
    for (const { keys, field } of bannerCells(wikitext)) {
      const type = field('type').toLowerCase();
      const cnStart = field('cnstart').match(/\d{4}\/\d{2}\/\d{2}/)?.[0];
      if (!SERIES_TYPES.has(type) || !cnStart || !field('name')) continue;
      const operators = field('operators')
        .split(',')
        .map((n) => n.trim());
      const codes = field('limited')
        .split(',')
        .map((c) => c.trim());
      const debuts = operators.filter((name, i) => name && codes[i] === '1');
      byKey.set(keys[0], { type, key: keys[0], cnStart, debuts });
    }
  }
  return [...byKey.values()].sort((a, b) => a.cnStart.localeCompare(b.cnStart));
}

// The limited operators `banner`'s Headhunting Data Contract Store sells: every
// operator its series debuted before it, once they've joined the series. Per the wiki's
// Headhunting/Banners page, a Festival or Carnival debut joins from the series' next
// banner, a Celebration debut only from the one after that ("a year's gap"). Null for a
// banner that isn't in a series (crossover, standard…).
function seriesStoreOperators(
  banner: RawBanner,
  series: SeriesBanner[]
): { type: string; names: string[] } | null {
  const key = bannerTypeKey(banner.name);
  const current = series.find((b) => b.key === key);
  if (!current) return null;
  const sameSeries = series.filter((b) => b.type === current.type);
  const index = sameSeries.indexOf(current);
  const gap = current.type === 'celebration' ? 2 : 1;
  return {
    type: current.type,
    names: sameSeries.slice(0, Math.max(0, index - gap + 1)).flatMap((b) => b.debuts),
  };
}

export {
  parseSeriesBanners,
  seriesStoreOperators,
  parseBannersPage,
  indexBannersByDate,
  dedupeBannersByName,
  parseBannerTypesFromWikitext,
  bannerWikiType,
  parseBannerTimesFromWikitext,
  bannerLookup,
};
