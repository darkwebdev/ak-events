// Groups a banner's operators by star rank, highest first, so 6★ and 5★ (and any
// other rarity present) render as visually separate rows instead of one flat mix.
export function groupOperatorsByStar(operators) {
  const groups = new Map();
  for (const op of operators || []) {
    const key = op.star ?? 0;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(op);
  }
  return [...groups.entries()].sort(([a], [b]) => b - a);
}
