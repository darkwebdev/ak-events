import type { ResolvedBannerOperator } from '../types.js';

export type StarGroups = Array<[number, ResolvedBannerOperator[]]>;

// Groups a banner's operators by star rank, highest first, so 6★ and 5★ (and any
// other rarity present) render as visually separate rows instead of one flat mix.
// Within each rank, rate-up-only operators (not yet sparkable — sparkCost is null,
// e.g. they're debuting on this very banner) come before the ones that are also
// sparkable, since rate-up-only is the more prominent/newsworthy fact about them.
// Array#sort is stable, so ties (both sparkable, or both not) keep their original
// (wiki-listed) relative order.
export function groupOperatorsByStar(operators: ResolvedBannerOperator[] | undefined): StarGroups {
  const groups = new Map<number, ResolvedBannerOperator[]>();
  for (const op of operators || []) {
    const key = op.star ?? 0;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(op);
  }
  for (const ops of groups.values()) {
    ops.sort((a, b) => Number(a.sparkCost != null) - Number(b.sparkCost != null));
  }
  return [...groups.entries()].sort(([a], [b]) => b - a);
}

// Splits a banner's star-grouped operators into two display columns: 6★ operators
// (the ones worth sparking for) get their own column, and every lower rarity (5★, 4★,
// ...) shares the other one — each still labeled by its own star rank within it.
export function splitOperatorColumns(
  operators: ResolvedBannerOperator[] | undefined
): [StarGroups, StarGroups] {
  const groups = groupOperatorsByStar(operators);
  return [groups.filter(([star]) => star === 6), groups.filter(([star]) => star !== 6)];
}
