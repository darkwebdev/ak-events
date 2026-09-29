import type { CharacterTable, GachaTable } from '../types.js';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// Maps operator name -> debut Date, for every Limited 6★ operator's premiere banner
// — computed from the game's own gacha pool data (every LIMITED-type pool's
// `limitParam.limitedCharId` names the one operator it debuted, alongside an exact
// `openTime` timestamp) rather than scraped from the wiki, which doesn't state debut
// dates directly. Returns null if either table failed to fetch.
function limitedDebutDatesFrom(
  gacha: GachaTable | null,
  characters: CharacterTable | null
): Map<string, Date> | null {
  if (!gacha || !characters) return null;

  const debutTimeByCharId = new Map<string, number>();
  for (const pool of gacha.gachaPoolClient || []) {
    if (pool.gachaRuleType !== 'LIMITED') continue;
    const charId = pool.limitParam?.limitedCharId;
    if (!charId || typeof pool.openTime !== 'number') continue;
    const existing = debutTimeByCharId.get(charId);
    // A carried-over rate-up on a later banner would re-mention the same charId —
    // keep the earliest (their actual premiere), not whichever pool happens last.
    if (existing == null || pool.openTime < existing) {
      debutTimeByCharId.set(charId, pool.openTime);
    }
  }

  const debutDateByName = new Map<string, Date>();
  for (const [charId, openTime] of debutTimeByCharId) {
    const name = characters[charId]?.name;
    if (name) debutDateByName.set(name, new Date(openTime * 1000));
  }
  return debutDateByName;
}

interface CalcSparkCostArgs {
  debutDate: Date | null | undefined;
  isFestival: boolean;
  now?: Date;
}

// The wiki's Store/Certificate and Headhunting pages state the general rule: "From
// Absolved Will Be the Seekers onward, the number of Headhunting Contracts required
// to purchase limited 6★ Operators that were initially released at least 4 years ago
// (5 years for Festival Limited Operators) was reduced from 300 to 200." `now` should
// be when the banner runs, not when the scrape does. Separately, each Limited event
// page names the one operator its banner discounts ("…needed to buy X in the
// Headhunting Data Contract Store is reduced to 200"), usually one no longer on the
// rate-up list — see extractSparkDiscounts in lib/parser.ts, which takes precedence.
function calcSparkCost({ debutDate, isFestival, now = new Date() }: CalcSparkCostArgs): number {
  if (!debutDate) return 300;
  const ageYears = (now.getTime() - debutDate.getTime()) / MS_PER_YEAR;
  const threshold = isFestival ? 5 : 4;
  return ageYears >= threshold ? 200 : 300;
}

const CLASS_BY_PROFESSION: Record<string, string> = {
  PIONEER: 'Vanguard',
  WARRIOR: 'Guard',
  TANK: 'Defender',
  SNIPER: 'Sniper',
  CASTER: 'Caster',
  MEDIC: 'Medic',
  SUPPORT: 'Supporter',
  SPECIAL: 'Specialist',
};

// A key for matching an operator's name across sources that spell it slightly
// differently — the banner pages' wikitext writes "Eyjafjalla the Hvit Aska" where the
// game data has "Hvít".
function operatorNameKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

interface OperatorInfo {
  // The game's own id (e.g. "char_113_cqbw" for W) — what an account's roster lists.
  charId: string;
  // The game's own spelling (e.g. "Eyjafjalla the Hvít Aska"), which the wiki's icon
  // file names use too.
  name: string;
  star: number | null;
  class: string | null;
}

// Each operator's rarity and class from the game's character table, keyed by
// operatorNameKey — for operators the banner pages don't describe (a contract store's
// non-rate-up stock).
function operatorInfoFrom(characters: CharacterTable | null): Map<string, OperatorInfo> {
  const info = new Map<string, OperatorInfo>();
  for (const [charId, character] of Object.entries(characters ?? {})) {
    const profession = String(character.profession ?? '');
    if (!CLASS_BY_PROFESSION[profession]) continue; // tokens, traps
    const star = Number(String(character.rarity ?? '').match(/TIER_(\d)/)?.[1]) || null;
    info.set(operatorNameKey(character.name), {
      charId,
      name: character.name,
      star,
      class: CLASS_BY_PROFESSION[profession],
    });
  }
  return info;
}

export { limitedDebutDatesFrom, operatorInfoFrom, operatorNameKey, calcSparkCost };
