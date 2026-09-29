import type { ArkpediaEventDetail, ArkpediaListEvent } from '../types.js';

// Parses arkpedia.net's Next.js pages, which embed their full data as a
// `__NEXT_DATA__` JSON script tag rather than exposing a stable API endpoint (the
// site's own `/_next/data/<buildId>/...` route works too, but buildId changes on
// every deploy, so it's not something to depend on directly — parsing the tag out of
// a normal page fetch is what stays correct across arkpedia's own redeploys).
function extractNextData(html: string | null | undefined): unknown {
  if (!html) return null;
  const m = html.match(/__NEXT_DATA__"\s*type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch (e) {
    return null;
  }
}

interface ArkpediaServerDates {
  dateRange?: string | null;
  note?: string | null;
}

interface ArkpediaPageEntry {
  name?: string;
  dateRange?: unknown;
  isPredicted?: boolean;
  // Only in the /schedule page's full-history `events`: per-server dates, where the
  // Global `note` is what marks an estimate now.
  cn?: ArkpediaServerDates;
  global?: ArkpediaServerDates;
}

interface NextDataShape {
  props?: {
    pageProps?: {
      events?: ArkpediaPageEntry[];
      eventRows?: ArkpediaPageEntry[];
      [key: string]: unknown;
    };
  };
}

// Parse arkpedia.net/schedule's upcoming/ongoing rows (`pageProps.eventRows`) into an
// array of { name, dateStr, isPredicted } — `dateStr` is already the plain
// "YYYY/MM/DD–YYYY/MM/DD" shape parseDateRange accepts directly (no "Global:"/"CN:"
// label to strip, unlike the wiki's own combined-cell format). `isPredicted: true`
// marks a CN→Global lag estimate for an event not yet confirmed for Global, rather
// than an official date — callers should surface that distinction to the user rather
// than presenting it as confirmed. `name` is arkpedia's own, which carries a type tag
// (e.g. "[Side Story] People, A People") — match it via normalizeEventName, which
// strips tags. Falls back to `pageProps.events` for the pre-/schedule page layout,
// whose `events` array had these same fields (the /schedule page's `events` is a
// different, full-history per-server shape, which the filter below skips anyway).
function parseArkpediaEventsList(html: string | null | undefined): ArkpediaListEvent[] {
  const data = extractNextData(html) as NextDataShape | null;
  const pageProps = data?.props?.pageProps;
  const events = pageProps?.eventRows ?? pageProps?.events;
  if (!Array.isArray(events)) return [];
  // The same events' per-server detail, by name. The rows' own `isPredicted` is now
  // always false: arkpedia marks an estimated Global date only in that date's note
  // ("ESTIMATED Global date, not officially confirmed").
  const detail = new Map(
    (Array.isArray(pageProps?.events) ? pageProps.events : [])
      .filter((e) => e?.name)
      .map((e) => [e.name as string, e] as const)
  );
  return events
    .filter((e): e is ArkpediaPageEntry & { name: string; dateRange: string } =>
      Boolean(e && e.name && typeof e.dateRange === 'string')
    )
    .map((e) => {
      const { cn, global } = detail.get(e.name) ?? {};
      return {
        name: e.name,
        dateStr: e.dateRange,
        isPredicted: !!e.isPredicted || /\bestimated\b/i.test(global?.note ?? ''),
        cnDateStr: cn?.dateRange ?? null,
      };
    });
}

// Every event name arkpedia.net/schedule knows about — the full history
// (`pageProps.events`) plus the upcoming/ongoing rows (`pageProps.eventRows`). Detail
// pages live at /events/<arkpedia's own name>, tag prefix included, so this is how a
// wiki event name gets turned into a fetchable URL (see arkpediaNameKey).
function parseArkpediaEventNames(html: string | null | undefined): string[] {
  const data = extractNextData(html) as NextDataShape | null;
  const pageProps = data?.props?.pageProps;
  const names = [pageProps?.events, pageProps?.eventRows]
    .flatMap((list) => (Array.isArray(list) ? list : []))
    .map((e) => e?.name)
    .filter((name): name is string => typeof name === 'string' && name.length > 0);
  return [...new Set(names)];
}

// Key for matching a wiki event name to arkpedia's name for the same event: drops
// arkpedia's leading "[Side Story]"-style tag, punctuation the two sites disagree on
// ("Duel Channel: Ivy Vine" vs "Duel Channel Ivy Vine"), case and spacing. Unlike
// normalizeEventName it keeps "Rerun", since a rerun's detail page has its own reward
// store and must not be confused with the original run's.
function arkpediaNameKey(name: string): string {
  return name
    .replace(/^\s*\[[^\]]*\]\s*/, '')
    .replace(/[:,'’"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

interface ArkpediaRewardItem {
  name?: string;
  quantity?: number | string;
  stock?: number | string;
}

interface ArkpediaRewardStore {
  items?: ArkpediaRewardItem[];
}

interface ArkpediaEventDetailProps {
  dateRange?: string;
  isPredicted?: boolean;
  bannerName?: string;
  featuredOperators?: { name: string; rarity: number; percent: number | null }[];
  rewardStores?: ArkpediaRewardStore[];
}

// Parse a single arkpedia.net event detail page (arkpedia.net/events/<arkpedia name>) into
// { dateStr, isPredicted, bannerName, featuredOperators, headhuntingPermits }.
// featuredOperators is [{ name, rarity, percent }] — percent is the rate-up chance,
// which the wiki's own banner pages don't expose. headhuntingPermits is summed from
// any reward-store item literally named "Headhunting Permit" (quantity × stock);
// null if the page has no such item, which callers should treat as "unknown" (fall
// back to the wiki), not "zero" — most events simply don't sell permits at all.
function parseArkpediaEventDetail(html: string | null | undefined): ArkpediaEventDetail | null {
  const data = extractNextData(html) as NextDataShape | null;
  const props = data?.props?.pageProps as ArkpediaEventDetailProps | undefined;
  if (!props) return null;

  let headhuntingPermits: number | null = null;
  for (const store of props.rewardStores || []) {
    for (const item of store.items || []) {
      if (item.name !== 'Headhunting Permit') continue;
      if (item.stock === '∞' || item.stock == null) continue;
      const stock = parseInt(String(item.stock), 10);
      const quantity = parseInt(String(item.quantity), 10);
      if (Number.isNaN(stock) || Number.isNaN(quantity)) continue;
      headhuntingPermits = (headhuntingPermits || 0) + stock * quantity;
    }
  }

  return {
    dateStr: props.dateRange || null,
    isPredicted: !!props.isPredicted,
    bannerName: props.bannerName || null,
    featuredOperators: Array.isArray(props.featuredOperators) ? props.featuredOperators : [],
    headhuntingPermits,
  };
}

export {
  parseArkpediaEventsList,
  parseArkpediaEventNames,
  parseArkpediaEventDetail,
  arkpediaNameKey,
};
