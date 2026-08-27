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
  // The maximum Intelligence Certificates a rerun's own page states across every
  // mission/threshold that can substitute one for an already-owned reward — see
  // extractIntCertsFromHtml in lib/parser.ts for how this is derived, and why it's a
  // ceiling rather than a guaranteed amount. null for every non-rerun event.
  intCerts?: number | null;
  datesPredicted?: boolean;
}

export interface BannerOperator {
  name: string | null;
  star: number | null;
  class: string | null;
  icon: string | null;
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
}

export interface ResolvedBanner {
  name: string;
  type: BannerType | null;
  sparkEligible: boolean;
  operators: ResolvedBannerOperator[];
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
  type: string | null;
  image: string | null;
  link: string | null;
  origPrime: number | null;
  hhPermits: number | null;
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
