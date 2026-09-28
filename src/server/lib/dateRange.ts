import type { DateRange } from '../types.js';

// Parse date strings like "2025/10/14–2025/11/04" or "2025-10-14 - 2025-11-04"
// into { start: 'YYYY-MM-DD'|null, end: 'YYYY-MM-DD'|null }.
function parseDateRange(dateStr: string | null | undefined): DateRange {
  if (!dateStr) return { start: null, end: null };

  const m = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/g);
  if (m && m.length > 0) {
    const s = m[0];
    const parts = s.split(/\D/).filter(Boolean);
    const yyyy = parts[0];
    const mm = parts[1].padStart(2, '0');
    const dd = parts[2].padStart(2, '0');
    const start = `${yyyy}-${mm}-${dd}`;

    let end: string | null = null;
    if (m.length > 1) {
      const s2 = m[1];
      const parts2 = s2.split(/\D/).filter(Boolean);
      const yyyy2 = parts2[0];
      const mm2 = parts2[1].padStart(2, '0');
      const dd2 = parts2[2].padStart(2, '0');
      end = `${yyyy2}-${mm2}-${dd2}`;
    }

    return { start, end };
  }
  return { start: null, end: null };
}

// Whole days from `start` to `end` ('YYYY-MM-DD'), or null if either is missing. A
// banner running 2026-09-16 to 2026-09-30 gives 14: it opens partway through its
// first day and closes before the last one's daily reset, so that's how many daily
// resets (and daily free pulls) it spans.
function daysBetween(
  start: string | null | undefined,
  end: string | null | undefined
): number | null {
  if (!start || !end) return null;
  const days = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000;
  return Number.isFinite(days) && days > 0 ? Math.round(days) : null;
}

export { parseDateRange, daysBetween };
