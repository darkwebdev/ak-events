import {
  limitedDebutDatesFrom,
  operatorInfoFrom,
  operatorNameKey,
  calcSparkCost,
} from '../src/server/lib/sparkCost.js';

describe('calcSparkCost', () => {
  test('returns 300 when there is no debut date (unknown operator)', () => {
    expect(calcSparkCost({ debutDate: undefined, isFestival: false })).toBe(300);
  });

  test('returns 300 when the operator debuted less than 4 years ago', () => {
    const now = new Date('2026-08-23');
    const debutDate = new Date('2023-08-24'); // just under 3 years
    expect(calcSparkCost({ debutDate, isFestival: false, now })).toBe(300);
  });

  test('returns 200 once a regular Limited operator is 4+ years past debut', () => {
    const now = new Date('2026-08-23');
    const debutDate = new Date('2022-08-01'); // just over 4 years
    expect(calcSparkCost({ debutDate, isFestival: false, now })).toBe(200);
  });

  // Regression: a Festival Limited operator uses a 5-year threshold, not 4 — an
  // operator between 4 and 5 years old must still be 300 if they're Festival.
  test('keeps a Festival Limited operator at 300 between the 4- and 5-year mark', () => {
    const now = new Date('2026-08-23');
    const debutDate = new Date('2022-08-01'); // ~4.06 years — past the 4y mark, not 5y
    expect(calcSparkCost({ debutDate, isFestival: true, now })).toBe(300);
  });

  test('returns 200 once a Festival Limited operator is 5+ years past debut', () => {
    const now = new Date('2026-08-23');
    const debutDate = new Date('2021-08-01'); // just over 5 years
    expect(calcSparkCost({ debutDate, isFestival: true, now })).toBe(200);
  });
});

describe('limitedDebutDatesFrom', () => {
  test('maps operator name to the earliest LIMITED pool openTime for their character id', () => {
    const gacha = {
      gachaPoolClient: [
        {
          gachaRuleType: 'LIMITED',
          openTime: 1690000000,
          limitParam: { limitedCharId: 'char_2023_ling' },
        },
        // A non-LIMITED pool referencing the same character must be ignored.
        {
          gachaRuleType: 'CLASSIC',
          openTime: 1700000000,
          limitParam: { limitedCharId: 'char_2023_ling' },
        },
        // A pool with no limitedCharId must be ignored, not throw.
        { gachaRuleType: 'LIMITED', openTime: 1680000000, limitParam: null },
      ],
    };
    const characters = {
      char_2023_ling: { name: 'Ling' },
    };

    const result = limitedDebutDatesFrom(gacha, characters);

    expect(result.get('Ling')).toEqual(new Date(1690000000 * 1000));
  });

  test('keeps the earliest openTime when the same character id appears in multiple LIMITED pools', () => {
    const gacha = {
      gachaPoolClient: [
        {
          gachaRuleType: 'LIMITED',
          openTime: 1700000000,
          limitParam: { limitedCharId: 'char_113_cqbw' },
        },
        {
          gachaRuleType: 'LIMITED',
          openTime: 1600000000, // earlier — the real debut
          limitParam: { limitedCharId: 'char_113_cqbw' },
        },
      ],
    };
    const characters = {
      char_113_cqbw: { name: 'W' },
    };

    const result = limitedDebutDatesFrom(gacha, characters);

    expect(result.get('W')).toEqual(new Date(1600000000 * 1000));
  });

  test('returns null if either table failed to fetch', () => {
    expect(limitedDebutDatesFrom(null, {})).toBeNull();
    expect(limitedDebutDatesFrom({ gachaPoolClient: [] }, null)).toBeNull();
  });
});

describe('operatorInfoFrom / operatorNameKey', () => {
  const info = operatorInfoFrom({
    char_113_cqbw: { name: 'W', rarity: 'TIER_6', profession: 'SNIPER' },
    char_1016_agoat2: { name: 'Eyjafjalla the Hvít Aska', rarity: 'TIER_6', profession: 'CASTER' },
    token_x: { name: 'A Token', rarity: 'TIER_1', profession: 'TOKEN' },
  });

  test("reads each operator's game spelling, rarity and class", () => {
    expect(info.get(operatorNameKey('W'))).toEqual({
      charId: 'char_113_cqbw',
      name: 'W',
      star: 6,
      class: 'Sniper',
    });
  });

  test('matches a name spelled without its accent', () => {
    expect(info.get(operatorNameKey('Eyjafjalla the Hvit Aska'))?.name).toBe(
      'Eyjafjalla the Hvít Aska'
    );
  });

  test('skips tokens and traps', () => {
    expect(info.has(operatorNameKey('A Token'))).toBe(false);
  });
});
