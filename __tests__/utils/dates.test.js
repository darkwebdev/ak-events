let getEffectiveStart;
let getEffectiveEnd;
let formatEventDates;
let isEventRunning;
let getBannerDates;
let parseDate;
let formatLongDate;
let toIsoDate;
let formatTimeAgo;
let getCountdown;
beforeAll(async () => {
  const mod = await import('../../src/client/utils/dates.js');
  getEffectiveStart = mod.getEffectiveStart;
  getEffectiveEnd = mod.getEffectiveEnd;
  formatEventDates = mod.formatEventDates;
  isEventRunning = mod.isEventRunning;
  getBannerDates = mod.getBannerDates;
  parseDate = mod.parseDate;
  formatLongDate = mod.formatLongDate;
  toIsoDate = mod.toIsoDate;
  formatTimeAgo = mod.formatTimeAgo;
  getCountdown = mod.getCountdown;
});

describe('date utils', () => {
  test('prefers global start/end when present', () => {
    const event = {
      globalStart: '2025-10-10',
      globalEnd: '2025-10-20',
      cnStart: '2025-04-10',
      cnEnd: '2025-04-20',
    };
    expect(toIsoDate(getEffectiveStart(event))).toBe('2025-10-10');
    expect(toIsoDate(getEffectiveEnd(event))).toBe('2025-10-20');
  });

  test('estimates cn dates by +6 months when global missing', () => {
    const event = {
      globalStart: null,
      globalEnd: null,
      cnStart: '2025-04-10',
      cnEnd: '2025-04-20',
    };
    const start = getEffectiveStart(event);
    const end = getEffectiveEnd(event);
    expect(start.getMonth()).toBe(new Date(2025, 9, 10).getMonth());
    expect(end.getMonth()).toBe(new Date(2025, 9, 20).getMonth());
  });

  test('falls back to start when end missing', () => {
    const event = { globalStart: '2025-12-01', globalEnd: null };
    expect(toIsoDate(getEffectiveEnd(event))).toBe('2025-12-01');
  });

  test('formatEventDates shows estimated when using cn start', () => {
    const event = { globalStart: null, cnStart: '2025-04-10' };
    const formatted = formatEventDates(event);
    expect(formatted.includes('(estimated)')).toBe(true);
  });

  test('formatEventDates shows date when global present', () => {
    const event = { globalStart: '2025-11-11' };
    const formatted = formatEventDates(event);
    expect(formatted).toContain('2025');
  });

  test('isEventRunning is true when now falls within start/end', () => {
    const event = { globalStart: '2025-10-10', globalEnd: '2025-10-20' };
    expect(isEventRunning(event, new Date(2025, 9, 15))).toBe(true);
  });

  test('isEventRunning is true exactly on the start/end boundaries', () => {
    const event = { globalStart: '2025-10-10', globalEnd: '2025-10-20' };
    expect(isEventRunning(event, new Date(2025, 9, 10))).toBe(true);
    expect(isEventRunning(event, new Date(2025, 9, 20))).toBe(true);
  });

  test('isEventRunning is false before start or after end', () => {
    const event = { globalStart: '2025-10-10', globalEnd: '2025-10-20' };
    expect(isEventRunning(event, new Date(2025, 9, 9))).toBe(false);
    expect(isEventRunning(event, new Date(2025, 9, 21))).toBe(false);
  });

  test('isEventRunning is false when start/end cannot be determined', () => {
    expect(isEventRunning({}, new Date(2025, 9, 15))).toBe(false);
  });
});

describe('getBannerDates', () => {
  const event = { globalStart: '2026-10-14', cnStart: '2026-05-01' };

  test("uses the banner's own Global dates when present, even if they differ from the event's", () => {
    const banner = { globalStart: '2026-08-20', globalEnd: '2026-09-03', cnStart: '2026-03-14' };
    const { start, end, estimated } = getBannerDates(banner, event);
    expect(start).toEqual(new Date(2026, 7, 20));
    expect(end).toEqual(new Date(2026, 8, 3));
    expect(estimated).toBe(false);
  });

  test("shifts CN-only banner dates by the event's own CN→Global lag, marked estimated", () => {
    const banner = { globalStart: null, cnStart: '2026-05-01', cnEnd: '2026-05-15' };
    const { start, end, estimated } = getBannerDates(banner, event);
    expect(start).toEqual(new Date(2026, 9, 14));
    expect(end).toEqual(new Date(2026, 9, 28));
    expect(estimated).toBe(true);
  });

  test('returns no dates for a banner without any (older data)', () => {
    expect(getBannerDates({}, event)).toEqual({ start: null, end: null, estimated: false });
  });
});

describe('parseDate', () => {
  // Would fail west of UTC with new Date('2026-09-16'), which is UTC midnight — still
  // the 15th locally there. `yarn test` runs in the machine's own timezone; run with
  // e.g. TZ=America/Los_Angeles to exercise that case.
  test('parses a YYYY-MM-DD date as that calendar day in the local timezone', () => {
    const d = parseDate('2026-09-16');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 8, 16, 0]);
  });

  test('round-trips through toIsoDate', () => {
    expect(toIsoDate(parseDate('2026-01-05'))).toBe('2026-01-05');
  });
});

describe('formatLongDate', () => {
  test('includes the full month name', () => {
    expect(formatLongDate(new Date(2026, 8, 16))).toMatch(/September/);
  });
});

describe('getCountdown', () => {
  const now = new Date(2026, 8, 28, 12, 0); // 28 Sep 2026, 12:00 local
  const at = (d, h = 0, m = 0) => new Date(2026, 8, d, h, m);

  test('counts whole days to an upcoming start', () => {
    const c = getCountdown(at(30, 16), at(40), true, now);
    expect(c.phase).toBe('starts');
    expect(c.remaining).toMatch(/^2 days?$/);
  });

  test('counts down to the end while running', () => {
    const c = getCountdown(at(20), at(30, 12), true, now);
    expect(c.phase).toBe('ends');
    expect(c.target).toEqual(at(30, 12));
  });

  test('switches to hours and minutes in the last day when the time is exact', () => {
    const c = getCountdown(at(20), at(28, 14, 15), true, now);
    expect(c.remaining).toMatch(/2.*h.*15.*m/);
  });

  test('shows only minutes in the last hour', () => {
    expect(getCountdown(at(20), at(28, 12, 40), true, now).remaining).toMatch(/^40\s?m/);
  });

  // Calendar dates are read as local midnight; the real time of day is unknown, so an
  // hours countdown to midnight would be wrong by hours.
  test('stays in whole days for calendar dates, even on the last day', () => {
    const c = getCountdown(at(20), at(29), false, now);
    expect(c).toMatchObject({ phase: 'ends' });
    expect(c.remaining).toMatch(/^1 day$/);
  });

  test('counts calendar days between midnights for a date-only start', () => {
    expect(getCountdown(at(1 + 30), at(45), false, now).remaining).toMatch(/^3 days$/);
  });

  test('is null once it has ended', () => {
    expect(getCountdown(at(10), at(20), true, now)).toBeNull();
    expect(getCountdown(null, null, false, now)).toBeNull();
  });
});

describe('formatTimeAgo', () => {
  const now = new Date(2026, 8, 28, 15, 0);
  const ago = (ms) => formatTimeAgo(new Date(now.getTime() - ms), now, 'en');
  const MIN = 60000;

  test('"now" under a minute', () => {
    expect(ago(30000)).toBe('now');
  });

  test('minutes, then hours, then days', () => {
    expect(ago(5 * MIN)).toBe('5 minutes ago');
    expect(ago(3 * 60 * MIN)).toBe('3 hours ago');
    expect(ago(26 * 60 * MIN)).toBe('yesterday');
    expect(ago(12 * 24 * 60 * MIN)).toBe('12 days ago');
  });
});
