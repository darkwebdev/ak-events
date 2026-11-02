import {
  isAvailableNow,
  opForSanity,
  sanityNow,
  summarizeStageOp,
} from '../../src/client/utils/stageOp.js';

const st = (id, ap, mode = 'standard') => ({ id, code: id, name: id, ap, op: 1, mode });

const data = {
  groups: [
    {
      id: 'episode_1',
      kind: 'main',
      name: 'Episode 1',
      stages: [st('a', 6), st('b', 9), st('c', 0)],
    },
    { id: 'supply', kind: 'supply', name: 'Supply', stages: [st('d', 30)] },
    // On from t=1000s to t=2000s.
    {
      id: 'ev',
      kind: 'event',
      name: 'Event',
      startTime: 1000,
      endTime: 2000,
      stages: [st('e', 12)],
    },
  ],
};

describe('isAvailableNow', () => {
  test('permanent groups always, events only while they run', () => {
    const at = (s) => new Date(s * 1000);
    expect(isAvailableNow(data.groups[0], at(0))).toBe(true);
    expect(isAvailableNow(data.groups[2], at(999))).toBe(false);
    expect(isAvailableNow(data.groups[2], at(1500))).toBe(true);
    expect(isAvailableNow(data.groups[2], at(2001))).toBe(false);
    expect(isAvailableNow({ ...data.groups[2], startTime: null, endTime: null }, at(1500))).toBe(
      false
    );
  });
});

describe('sanityNow', () => {
  const fetchedAt = '2026-11-02T12:00:00Z';
  const after = (minutes) => new Date(Date.parse(fetchedAt) + minutes * 60000);

  test('adds 1 per 6 minutes since the fetch, up to the cap', () => {
    const p = { claimed: [], sanity: 100, maxSanity: 135, fetchedAt };
    expect(sanityNow(p, after(5))).toBe(100);
    expect(sanityNow(p, after(60))).toBe(110);
    expect(sanityNow(p, after(6000))).toBe(135);
  });

  test('sanity over the cap stays as it is; unknown is null', () => {
    expect(sanityNow({ claimed: [], sanity: 300, maxSanity: 135, fetchedAt }, after(600))).toBe(
      300
    );
    expect(
      sanityNow({ claimed: [], sanity: null, maxSanity: null, fetchedAt }, after(1))
    ).toBeNull();
    expect(sanityNow(null, after(1))).toBeNull();
  });
});

describe('opForSanity', () => {
  test('clears the cheapest stages first, within the budget', () => {
    expect(opForSanity([st('x', 20), st('y', 6), st('z', 0), st('w', 10)], 16)).toEqual({
      op: 3,
      sanity: 16,
      stages: 3,
    });
    expect(opForSanity([st('x', 20)], 19)).toEqual({ op: 0, sanity: 0, stages: 0 });
  });
});

describe('summarizeStageOp', () => {
  const now = new Date(5000 * 1000); // the event is over
  const progress = { claimed: ['a'], sanity: 10, maxSanity: 10, fetchedAt: now.toISOString() };

  test('counts unclaimed stages you can play now; ended events only as rerun-only', () => {
    const s = summarizeStageOp(data, progress, { now, days: 0, sanityPerDay: 240 });
    expect(s.available.map((g) => [g.group.id, g.op, g.sanity])).toEqual([
      ['episode_1', 2, 9],
      ['supply', 1, 30],
    ]);
    expect(s.ended.map((g) => g.group.id)).toEqual(['ev']);
    expect(s.opLeft).toBe(3);
    expect(s.sanityLeft).toBe(39);
    expect(s.endedOp).toBe(1);
    expect(s.totalGameOp).toBe(5);
    // 10 sanity now: c (0) and b (9).
    expect(s.sanity).toEqual({ now: 10, byDeadline: 10 });
    expect(s.stagesLeft).toBe(3);
    expect(s.plan).toEqual({ op: 2, sanity: 9, stages: 2 });
  });

  test('adds sanity per day until the deadline', () => {
    const s = summarizeStageOp(data, progress, { now, days: 1, sanityPerDay: 30 });
    expect(s.sanity).toEqual({ now: 10, byDeadline: 40 });
    expect(s.plan).toEqual({ op: 3, sanity: 39, stages: 3 });
    // With only the 10 on hand now.
    expect(s.planNow).toEqual({ op: 2, sanity: 9, stages: 2 });
  });

  test('without account progress every stage counts', () => {
    const s = summarizeStageOp(data, null, { now, days: 0, sanityPerDay: 240 });
    expect(s.opLeft).toBe(4);
    expect(s.sanity.byDeadline).toBe(0);
    expect(s.plan.op).toBe(1); // the 0-sanity stage
  });

  test('groups with nothing left are left out', () => {
    const s = summarizeStageOp(
      data,
      { ...progress, claimed: ['d'] },
      { now, days: 0, sanityPerDay: 0 }
    );
    expect(s.available.map((g) => g.group.id)).toEqual(['episode_1']);
  });
});

describe('minigame events and potions', () => {
  const now = new Date(5000 * 1000);
  const withDuel = {
    groups: [
      ...data.groups,
      {
        id: 'duel',
        kind: 'event',
        name: 'Duel',
        story: false,
        startTime: 1,
        endTime: 2,
        stages: [st('v', 0)],
      },
      {
        id: 'duelNow',
        kind: 'event',
        name: 'Duel 2',
        story: false,
        startTime: 4000,
        endTime: 6000,
        stages: [st('w', 0)],
      },
    ],
  };

  test('ended minigame events are listed apart from story events; one running now counts', () => {
    const s = summarizeStageOp(withDuel, null, { now, days: 0, sanityPerDay: 0 });
    expect(s.ended.map((g) => g.group.id)).toEqual(['ev']);
    expect(s.endedOther.map((g) => g.group.id)).toEqual(['duel']);
    expect(s.endedOtherOp).toBe(1);
    expect(s.available.map((g) => g.group.id)).toContain('duelNow');
  });

  test('unexpired potions add to the budget', () => {
    const progress = {
      claimed: [],
      sanity: 0,
      maxSanity: 135,
      fetchedAt: now.toISOString(),
      potions: [
        { sanity: 80, count: 2, expiresAt: 6000 },
        { sanity: 120, count: 1, expiresAt: 4000 }, // expired
        { sanity: 10, count: 1, expiresAt: null },
      ],
    };
    const s = summarizeStageOp(data, progress, {
      now,
      days: 2,
      sanityPerDay: 100,
      potionSanityPerDay: 80,
    });
    expect(s.potions).toEqual({ now: 170, byDeadline: 330 });
    expect(s.sanity).toEqual({ now: 0, byDeadline: 200 });
  });
});

test('an event whose rerun starts later is upcoming, not ended', () => {
  const s = summarizeStageOp(data, null, { now: new Date(500 * 1000), days: 0, sanityPerDay: 0 });
  expect(s.upcoming.map((g) => g.group.id)).toEqual(['ev']);
  expect(s.ended).toEqual([]);
});
