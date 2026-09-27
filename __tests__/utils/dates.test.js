let getEffectiveStart;
let getEffectiveEnd;
let formatEventDates;
let isEventRunning;
let getBannerDates;
beforeAll(async () => {
  const mod = await import('../../src/client/utils/dates.js');
  getEffectiveStart = mod.getEffectiveStart;
  getEffectiveEnd = mod.getEffectiveEnd;
  formatEventDates = mod.formatEventDates;
  isEventRunning = mod.isEventRunning;
  getBannerDates = mod.getBannerDates;
});

describe('date utils', () => {
  test('prefers global start/end when present', () => {
    const event = {
      globalStart: '2025-10-10',
      globalEnd: '2025-10-20',
      cnStart: '2025-04-10',
      cnEnd: '2025-04-20',
    };
    expect(getEffectiveStart(event).toISOString().startsWith('2025-10-10')).toBe(true);
    expect(getEffectiveEnd(event).toISOString().startsWith('2025-10-20')).toBe(true);
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
    expect(start.getMonth()).toBe(new Date('2025-10-10').getMonth());
    expect(end.getMonth()).toBe(new Date('2025-10-20').getMonth());
  });

  test('falls back to start when end missing', () => {
    const event = { globalStart: '2025-12-01', globalEnd: null };
    expect(getEffectiveEnd(event).toISOString().startsWith('2025-12-01')).toBe(true);
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
    expect(isEventRunning(event, new Date('2025-10-15'))).toBe(true);
  });

  test('isEventRunning is true exactly on the start/end boundaries', () => {
    const event = { globalStart: '2025-10-10', globalEnd: '2025-10-20' };
    expect(isEventRunning(event, new Date('2025-10-10'))).toBe(true);
    expect(isEventRunning(event, new Date('2025-10-20'))).toBe(true);
  });

  test('isEventRunning is false before start or after end', () => {
    const event = { globalStart: '2025-10-10', globalEnd: '2025-10-20' };
    expect(isEventRunning(event, new Date('2025-10-09'))).toBe(false);
    expect(isEventRunning(event, new Date('2025-10-21'))).toBe(false);
  });

  test('isEventRunning is false when start/end cannot be determined', () => {
    expect(isEventRunning({}, new Date('2025-10-15'))).toBe(false);
  });
});

describe('getBannerDates', () => {
  const event = { globalStart: '2026-10-14', cnStart: '2026-05-01' };

  test("uses the banner's own Global dates when present, even if they differ from the event's", () => {
    const banner = { globalStart: '2026-08-20', globalEnd: '2026-09-03', cnStart: '2026-03-14' };
    const { start, end, estimated } = getBannerDates(banner, event);
    expect(start).toEqual(new Date('2026-08-20'));
    expect(end).toEqual(new Date('2026-09-03'));
    expect(estimated).toBe(false);
  });

  test("shifts CN-only banner dates by the event's own CN→Global lag, marked estimated", () => {
    const banner = { globalStart: null, cnStart: '2026-05-01', cnEnd: '2026-05-15' };
    const { start, end, estimated } = getBannerDates(banner, event);
    expect(start).toEqual(new Date('2026-10-14'));
    expect(end).toEqual(new Date('2026-10-28'));
    expect(estimated).toBe(true);
  });

  test('returns no dates for a banner without any (older data)', () => {
    expect(getBannerDates({}, event)).toEqual({ start: null, end: null, estimated: false });
  });
});
