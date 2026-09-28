import { parseDateRange } from '../src/server/lib/dateRange.js';

describe('parseDateRange', () => {
  test('parses a start–end range separated by an en-dash', () => {
    expect(parseDateRange('2025/10/14–2025/11/04')).toEqual({
      start: '2025-10-14',
      end: '2025-11-04',
    });
  });

  test('parses a single date with no end', () => {
    expect(parseDateRange('2025/10/14')).toEqual({ start: '2025-10-14', end: null });
  });

  test('pads single-digit month/day', () => {
    expect(parseDateRange('2025/1/4–2025/2/9')).toEqual({ start: '2025-01-04', end: '2025-02-09' });
  });

  test('returns nulls for empty/missing input', () => {
    expect(parseDateRange(null)).toEqual({ start: null, end: null });
    expect(parseDateRange('')).toEqual({ start: null, end: null });
    expect(parseDateRange('TBD')).toEqual({ start: null, end: null });
  });
});
