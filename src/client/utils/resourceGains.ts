// What the linked account gained between two Refresh data fetches — for the toast
// that lists "since last refresh". Compares the raw fetched counts, not
// playerStatus (which the user can also edit by hand, so it's no baseline).
import type { FetchAccountDataResult } from './arkCharsApi.js';

// The fetched counts worth comparing, by a stable key. Saved after every fetch.
export type ResourceSnapshot = Record<string, number>;

export interface ResourceGain {
  key: string;
  label: string;
  amount: number;
}

const FIXED: { key: string; label: string; plural?: string }[] = [
  { key: 'orundum', label: 'Orundum' },
  { key: 'originitePrime', label: 'Originite Prime' },
  { key: 'headhuntingPermits', label: 'Headhunting Permit', plural: 'Headhunting Permits' },
  {
    key: 'tenHeadhuntingPermits',
    label: 'Ten-roll Headhunting Permit',
    plural: 'Ten-roll Headhunting Permits',
  },
  { key: 'sanityPotions', label: 'Sanity potion', plural: 'Sanity potions' },
];

// Banner items come keyed by the game's item id — name them by kind.
function itemLabel(itemId: string, amount: number): string {
  const one = amount === 1;
  if (itemId.startsWith('LMTGS_COIN_')) {
    return one ? 'Headhunting Data Contract' : 'Headhunting Data Contracts';
  }
  if (itemId.startsWith('LIMITED_TKT_GACHA_10_')) {
    return one ? 'Limited ten-roll Permit' : 'Limited ten-roll Permits';
  }
  return itemId;
}

export function snapshotFromFetch(data: FetchAccountDataResult): ResourceSnapshot {
  const snapshot: ResourceSnapshot = {
    orundum: data.orundum,
    originitePrime: data.originitePrime,
    headhuntingPermits: data.headhuntingPermits,
    tenHeadhuntingPermits: data.tenHeadhuntingPermits,
    sanityPotions: data.sanityPotions.reduce((sum, p) => sum + p.count, 0),
  };
  for (const [itemId, count] of Object.entries(data.bannerProgress.items)) {
    snapshot[`item:${itemId}`] = count;
  }
  return snapshot;
}

// Every resource that went up from `prev` to `next`, in a fixed order (currencies
// first, then banner items). A resource missing from `prev` counts from 0 for
// banner items (a new banner's first contracts) but is skipped for the fixed ones,
// so a snapshot saved before a field existed doesn't report the whole stock as new.
export function resourceGains(prev: ResourceSnapshot, next: ResourceSnapshot): ResourceGain[] {
  const gains: ResourceGain[] = [];
  for (const { key, label, plural } of FIXED) {
    if (!(key in prev) || !(key in next)) continue;
    const amount = next[key] - prev[key];
    if (amount > 0) gains.push({ key, label: amount === 1 || !plural ? label : plural, amount });
  }
  for (const key of Object.keys(next).filter((k) => k.startsWith('item:'))) {
    const amount = next[key] - (prev[key] ?? 0);
    if (amount > 0) gains.push({ key, label: itemLabel(key.slice(5), amount), amount });
  }
  return gains;
}

export function formatGain({ label, amount }: ResourceGain): string {
  return `+${amount.toLocaleString('en-US')} ${label}`;
}
