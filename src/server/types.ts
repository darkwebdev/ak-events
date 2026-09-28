// Shared data shapes for the scraper pipeline. Deliberately loose in a few places
// (e.g. `[key: string]: unknown` on the raw game-data tables) rather than fully
// modeling third-party JSON we only read a handful of fields from — the point is to
// type what this codebase actually touches, not to re-describe someone else's schema.

export type BannerType = 'Limited' | 'Standard' | 'Kernel' | 'Special';

export interface DateRange {
  start: string | null;
  end: string | null;
}

// An event as gathered from the index/upcoming pages and enriched in place through
// the scrape pipeline, before the final `start`/`end`/`banner` shape is derived.
export interface RawEvent {
  name: string;
  dateStr?: string | null;
  globalDateStr?: string | null;
  cnDateStr?: string | null;
  type?: string | null;
  image?: string | null;
  link?: string | null;
  origPrime?: number | null;
  hhPermits?: number | null;
  // Free pulls the event's Limited banner gives out, stated in prose on the event's
  // own page — see extractBannerFreePulls in lib/parser.ts. Never taken from a rerun,
  // whose wiki fetch reads the original run's page.
  dailyFreePull?: boolean;
  bannerPermits?: number | null;
  headhuntingDescribed?: boolean;
  bannerKind?: string | null;
  sparkDiscounts?: SparkDiscount[];
  // The maximum Intelligence Certificates a rerun's own page states across every
  // mission/threshold that can substitute one for an already-owned reward — see
  // extractIntCertsFromHtml in lib/parser.ts for how this is derived, and why it's a
  // ceiling rather than a guaranteed amount. null for every non-rerun event.
  intCerts?: number | null;
  datesPredicted?: boolean;
  // Exact Global start/end (ISO), from the game's activity table — see ProcessedEvent.
  globalStartAt?: string | null;
  globalEndAt?: string | null;
}

export interface BannerOperator {
  name: string | null;
  star: number | null;
  class: string | null;
  icon: string | null;
}

// An operator a banner's Headhunting Data Contract Store sells at a reduced spark cost,
// as the event page names it — see extractSparkDiscounts in lib/parser.ts.
export interface SparkDiscount {
  name: string;
  cost: number;
}

export interface ResolvedBannerOperator {
  name: string;
  star: number | null;
  class: string | null;
  limited: boolean;
  icon: string | null;
  sparkCost: number | null;
}

// As parsed from a Headhunting/Banners page — before spark-cost/Limited-status
// resolution, which is what turns `operators` into ResolvedBannerOperator[].
export interface RawBanner {
  name: string;
  type: BannerType | null;
  cnStart: string | null;
  cnEnd: string | null;
  globalStart: string | null;
  globalEnd: string | null;
  operators: BannerOperator[];
  // The wiki's own kind for this banner (festival, crossover, special…), from the
  // banner pages' wikitext — see parseBannerTypesFromWikitext. Keys bannerRules.ts.
  wikiType?: string | null;
  // Exact Global start/end (ISO), where the banner page's wikitext gives times.
  globalStartAt?: string | null;
  globalEndAt?: string | null;
}

export interface ResolvedBanner {
  name: string;
  type: BannerType | null;
  sparkEligible: boolean;
  operators: ResolvedBannerOperator[];
  // Operators this banner's Headhunting Data Contract Store sells at a discount (200)
  // that aren't on its rate-up list — each new Limited banner discounts its series'
  // oldest limited operator (see extractSparkDiscounts). A discounted rate-up operator
  // just gets the lower sparkCost in `operators` instead.
  storeDiscounts?: ResolvedBannerOperator[];
  // The banner's own run dates, from the wiki banner pages — usually the same as its
  // matched event's, but a banner can end earlier or later than the event does.
  // Optional since event data scraped before these were added doesn't have them.
  globalStart?: string | null;
  globalEnd?: string | null;
  cnStart?: string | null;
  cnEnd?: string | null;
  // Exact Global start/end (ISO), where the banner page's wikitext gives times — lets
  // the client count down in hours and minutes, not just days.
  globalStartAt?: string | null;
  globalEndAt?: string | null;
}

export interface BannerDateIndex {
  byGlobalStart: Record<string, RawBanner>;
  byCnStart: Record<string, RawBanner>;
}

// The final shape written to public/data/events.json.
export interface ProcessedEvent {
  name: string;
  start: string | null;
  end: string | null;
  globalStart: string | null;
  globalEnd: string | null;
  cnStart: string | null;
  cnEnd: string | null;
  datesPredicted: boolean;
  // Exact Global start/end (ISO), from the game's activity table, when the event is
  // already on the EN client. The date fields above are calendar dates only; these let
  // the client count down in hours and minutes.
  globalStartAt?: string | null;
  globalEndAt?: string | null;
  type: string | null;
  image: string | null;
  link: string | null;
  origPrime: number | null;
  hhPermits: number | null;
  // One free pull per day the banner runs (null when the banner has no such offer;
  // 14 for every Limited banner so far), and the banner-only ten-roll permit
  // claimable once (10 pulls). Counted separately from hhPermits
  // (store and reward permits) so the UI can show where each pull comes from.
  // Optional since event data scraped before these were added doesn't have them.
  dailyFreePulls?: number | null;
  bannerPermits?: number | null;
  // True when those come from the banner type's rule (lib/bannerRules.ts) because the
  // event's page doesn't describe its banner yet.
  freePullsEstimated?: boolean;
  intCerts: number | null;
  banner?: ResolvedBanner | null;
}

// --- Official game data (activity_table.json / stage_table.json) ---

export interface ActivityTableEntry {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  [key: string]: unknown;
}

export interface ActivityTable {
  basicInfo: Record<string, ActivityTableEntry>;
  [key: string]: unknown;
}

export interface StageEntry {
  diamondOnceDrop?: number;
  [key: string]: unknown;
}

export interface StageTable {
  stages: Record<string, StageEntry>;
  [key: string]: unknown;
}

// --- arkpedia.net ---

export interface ArkpediaListEvent {
  name: string;
  dateStr: string;
  isPredicted: boolean;
}

export interface ArkpediaFeaturedOperator {
  name: string;
  rarity: number;
  percent: number | null;
}

export interface ArkpediaEventDetail {
  dateStr: string | null;
  isPredicted: boolean;
  bannerName: string | null;
  featuredOperators: ArkpediaFeaturedOperator[];
  headhuntingPermits: number | null;
}

// --- Operator caches (public/data/operators.json, operator_debuts.json) ---

export type OperatorCache = Record<string, boolean>;

export interface OperatorDebutInfo {
  event: string | null;
  isFestival: boolean;
}

// Older cache entries (before isFestival was tracked) are a bare string|null rather
// than the object shape — see operatorDebuts.js's own handling of this.
export type OperatorDebutCacheEntry = OperatorDebutInfo | string | null;
export type OperatorDebutCache = Record<string, OperatorDebutCacheEntry>;

// --- Gacha/character game data (spark cost) ---

export interface GachaPoolEntry {
  gachaRuleType: string;
  openTime: number;
  limitParam?: { limitedCharId?: string };
  [key: string]: unknown;
}

export interface GachaTable {
  gachaPoolClient: GachaPoolEntry[];
  [key: string]: unknown;
}

export interface CharacterTable {
  [charId: string]: { name: string; [key: string]: unknown };
}
