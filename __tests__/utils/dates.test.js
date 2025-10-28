let getEffectiveStart;
let getEffectiveEnd;
let formatEventDates;
beforeAll(async () => {
  const mod = await import('../../src/client/utils/dates.js');
  getEffectiveStart = mod.getEffectiveStart;
  getEffectiveEnd = mod.getEffectiveEnd;
  formatEventDates = mod.formatEventDates;
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
});
