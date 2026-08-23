import { fetchGachaTable, fetchCharacterTable } from './network.js';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

// Maps operator name -> debut Date, for every Limited 6★ operator's premiere banner
// — computed from the game's own gacha pool data (every LIMITED-type pool's
// `limitParam.limitedCharId` names the one operator it debuted, alongside an exact
// `openTime` timestamp) rather than scraped from the wiki, which doesn't state debut
// dates directly. Returns null if either table failed to fetch.
async function fetchLimitedDebutDates() {
  const [gacha, characters] = await Promise.all([fetchGachaTable(), fetchCharacterTable()]);
  if (!gacha || !characters) return null;

  const debutTimeByCharId = new Map();
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

  const debutDateByName = new Map();
  for (const [charId, openTime] of debutTimeByCharId) {
    const name = characters[charId]?.name;
    if (name) debutDateByName.set(name, new Date(openTime * 1000));
  }
  return debutDateByName;
}

// The wiki's Headhunting Data Contract Store page states the actual rule: "From
// Absolved Will Be the Seekers onward, the number of Headhunting Contracts required
// to purchase limited 6★ Operators that were initially released at least 4 years ago
// (5 years for Festival Limited Operators) was reduced from 300 to 200." This
// replaced an older per-operator promotion the wiki used to separately announce on
// event pages (which this project's scraper used to look for a sentence about) —
// that announcement sentence doesn't appear on current event pages anymore, which is
// why relying on it had silently stopped finding any reduced-cost operator at all.
function calcSparkCost({ debutDate, isFestival, now = new Date() }) {
  if (!debutDate) return 300;
  const ageYears = (now - debutDate) / MS_PER_YEAR;
  const threshold = isFestival ? 5 : 4;
  return ageYears >= threshold ? 200 : 300;
}

export { fetchLimitedDebutDates, calcSparkCost };
