import {
  normalizeEventName,
  findActivity,
  activityDateStr,
  originitePrimeFromStages,
} from '../src/server/lib/gameData.js';

describe('normalizeEventName', () => {
  test('matches names that differ by punctuation and a "Part N" suffix', () => {
    expect(normalizeEventName('Stronghold Protocol: Alliance')).toBe(
      normalizeEventName('Stronghold Protocol Alliance Part 2')
    );
  });

  test('matches names that differ by a bracketed tag and a trailing "Rerun"', () => {
    expect(normalizeEventName('When Elegies Are Ashes - Rerun')).toBe(
      normalizeEventName('[Rerun] When Elegies Are Ashes Rerun')
    );
  });

  test('does not collapse genuinely different names to the same value', () => {
    expect(normalizeEventName('Duel Channel Ivy Vine')).not.toBe(
      normalizeEventName('Thunder in the Azure Dream')
    );
  });
});

describe('findActivity', () => {
  const NOW = Date.UTC(2026, 7, 26); // 2026-08-26, matches this session's "today"
  const activityTable = {
    basicInfo: {
      act41side: {
        id: 'act41side',
        name: 'When Elegies Are Ashes',
        startTime: Date.UTC(2026, 7, 20) / 1000,
        endTime: Date.UTC(2026, 8, 6) / 1000,
      },
      act2autochess: {
        id: 'act2autochess',
        name: 'Stronghold Protocol: Alliance',
        startTime: Date.UTC(2026, 7, 20) / 1000,
        endTime: Date.UTC(2026, 9, 1) / 1000,
      },
      // A same-named event whose only activity_table entry is from a long-concluded
      // original run — real bug found by running against live data: the wiki
      // currently lists a 2026 rerun of "A Flurry to the Flame," but activity_table
      // (as of testing) only has the 2023 original, since the rerun hasn't gotten
      // its own entry there yet. Matching this would silently attach a 2023 date to
      // what's actually an upcoming 2026 event.
      act24side: {
        id: 'act24side',
        name: 'A Flurry to the Flame',
        startTime: Date.UTC(2023, 8, 7) / 1000,
        endTime: Date.UTC(2023, 8, 21) / 1000,
      },
    },
  };

  test('finds an activity by normalized name match', () => {
    const found = findActivity(activityTable, 'Stronghold Protocol Alliance Part 2', NOW);
    expect(found?.id).toBe('act2autochess');
  });

  test('returns null when no activity matches', () => {
    expect(findActivity(activityTable, 'Some Future Unreleased Event', NOW)).toBeNull();
  });

  test('rejects a match whose only activity_table entry already ended, rather than attaching a stale date', () => {
    expect(findActivity(activityTable, 'A Flurry to the Flame Rerun', NOW)).toBeNull();
  });

  test('returns null for missing/malformed input rather than throwing', () => {
    expect(findActivity(null, 'anything', NOW)).toBeNull();
    expect(findActivity({}, 'anything', NOW)).toBeNull();
    expect(findActivity(activityTable, '', NOW)).toBeNull();
  });
});

describe('activityDateStr', () => {
  test('formats startTime/endTime (Unix seconds) as YYYY/MM/DD–YYYY/MM/DD', () => {
    const activity = {
      startTime: Date.UTC(2026, 7, 20) / 1000, // 2026-08-20
      endTime: Date.UTC(2026, 9, 1) / 1000, // 2026-10-01
    };
    expect(activityDateStr(activity)).toBe('2026/08/20–2026/10/01');
  });

  test('returns null when the activity has no dates', () => {
    expect(activityDateStr({})).toBeNull();
    expect(activityDateStr(null)).toBeNull();
  });
});

describe('originitePrimeFromStages', () => {
  const stageTable = {
    stages: {
      act41side_01: { diamondOnceDrop: 1 },
      act41side_02: { diamondOnceDrop: 1 },
      act41side_ex01: { diamondOnceDrop: 1 },
      'act41side_ex01#f#': { diamondOnceDrop: 1 },
      // A differently-typed stage with no reward, to prove this sums rather than
      // just counts stages.
      act41side_st01: { diamondOnceDrop: 0 },
      // Stages belonging to a different activity whose id is a raw string-prefix of
      // "act41side" — proving the underscore boundary keeps this from collecting
      // act4's stages when asked about act41side (or vice versa).
      act4_01: { diamondOnceDrop: 999 },
    },
  };

  test('sums diamondOnceDrop across every stage belonging to the activity', () => {
    expect(originitePrimeFromStages('act41side', stageTable)).toBe(4);
  });

  test("does not collect a different activity's stages via a raw string-prefix collision", () => {
    expect(originitePrimeFromStages('act4', stageTable)).toBe(999);
  });

  test('returns null (not 0) when the activity has no matching stages at all', () => {
    expect(originitePrimeFromStages('act9nostages', stageTable)).toBeNull();
  });

  test('returns null (not 0) when matching stages exist but sum to zero — real bug found against live data: Stronghold Protocol: Alliance (an AUTOCHESS_SEASON activity) has two stage_table.json entries, both diamondOnceDrop: 0, since that mode earns Originite Prime through a season/milestone system this method cannot see', () => {
    const autochessStageTable = {
      stages: {
        act2autochess_m01: { diamondOnceDrop: 0 },
        act2autochess_m02: { diamondOnceDrop: 0 },
      },
    };
    expect(originitePrimeFromStages('act2autochess', autochessStageTable)).toBeNull();
  });

  test('returns null for missing/malformed input rather than throwing', () => {
    expect(originitePrimeFromStages(null, stageTable)).toBeNull();
    expect(originitePrimeFromStages('act41side', null)).toBeNull();
  });
});
