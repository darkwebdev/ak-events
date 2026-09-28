import type { Event } from '../types.js';

// The date fields the effective-date helpers below read — shared by events and their
// banners (a banner has its own run dates, which can differ from its event's).
export interface DateFields {
  globalStart?: string | null;
  globalEnd?: string | null;
  cnStart?: string | null;
  cnEnd?: string | null;
  start?: string | null;
  end?: string | null;
}

/**
 * Parse a scraped "YYYY-MM-DD" date as a calendar date in the viewer's own timezone.
 * `new Date('2026-09-16')` would be UTC midnight per spec, which is still the previous
 * evening anywhere west of UTC — every date would display a day early there.
 */
export function parseDate(value: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
}

/** Short date in the viewer's own locale format, e.g. 16/09/2026 or 9/16/2026. */
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

/** Long date in the viewer's own locale, with the full month name: "16 September 2026". */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(undefined, { dateStyle: 'long' });
}

/** Machine-readable local calendar date ("YYYY-MM-DD"), for <time dateTime>. */
export function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Calculate days between today and event date
 */
export function calculateDaysBetween(eventDate: string | null | undefined): number {
  if (!eventDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const eventStart = parseDate(eventDate);
  eventStart.setHours(0, 0, 0, 0); // Set to start of event day

  // If event is in the past, return 0
  if (eventStart <= today) {
    return 0;
  }

  const diffTime = eventStart.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Format event dates for display
 */
export function getEffectiveStart(event: DateFields): Date | null {
  // Prefer globalStart, fallback to estimated cnStart (+6 months), then globalStart/global (if present), then cnStart
  if (event.globalStart) return parseDate(event.globalStart);
  if (event.cnStart) {
    const d = parseDate(event.cnStart);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  if (event.start) return parseDate(event.start);
  return null;
}

export function getEffectiveEnd(event: DateFields): Date | null {
  // Prefer globalEnd, fallback to estimated cnEnd (+6 months), then end/start fallbacks
  if (event.globalEnd) return parseDate(event.globalEnd);
  if (event.cnEnd) {
    const d = parseDate(event.cnEnd);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  if (event.end) return parseDate(event.end);
  if (event.globalStart) return parseDate(event.globalStart);
  if (event.cnStart) {
    const d = parseDate(event.cnStart);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  return null;
}

/**
 * A banner's own run dates. Uses its Global dates when the wiki has them; otherwise
 * shifts its CN dates by its event's own CN→Global lag (marked `estimated`), which is
 * far closer than the generic +6 months — a banner almost always launches alongside
 * its event, and that event's lag is already known.
 */
export function getBannerDates(
  banner: DateFields,
  event: DateFields
): { start: Date | null; end: Date | null; estimated: boolean } {
  if (banner.globalStart) {
    return {
      start: parseDate(banner.globalStart),
      end: banner.globalEnd ? parseDate(banner.globalEnd) : null,
      estimated: false,
    };
  }
  const eventStart = getEffectiveStart(event);
  if (banner.cnStart && event.cnStart && eventStart) {
    const lag = eventStart.getTime() - parseDate(event.cnStart).getTime();
    // Shifted by whole days rather than raw milliseconds, so a DST change between
    // the two dates can't land the result an hour short, on the previous day.
    const lagDays = Math.round(lag / (1000 * 60 * 60 * 24));
    const shift = (d: string) => {
      const shifted = parseDate(d);
      shifted.setDate(shifted.getDate() + lagDays);
      return shifted;
    };
    return {
      start: shift(banner.cnStart),
      end: banner.cnEnd ? shift(banner.cnEnd) : null,
      estimated: true,
    };
  }
  return { start: null, end: null, estimated: false };
}

/**
 * Whether an event is currently running (today falls within its effective
 * start/end range, inclusive).
 */
export function isEventRunning(event: DateFields, now: Date = new Date()): boolean {
  const start = getEffectiveStart(event);
  const end = getEffectiveEnd(event);
  if (!start || !end) return false;
  return start <= now && now <= end;
}

export function formatEventDates(event: Event): string {
  const start = getEffectiveStart(event);
  if (start) {
    // If this is an estimated CN->global mapping, indicate estimated
    if (!event.globalStart && event.cnStart) {
      return `${formatDate(start)} (estimated)`;
    }
    return formatDate(start);
  }
  return 'Unknown';
}

// (ESM module) no CommonJS fallback

export interface Countdown {
  phase: 'starts' | 'ends';
  target: Date;
  // e.g. "3 days", or "2h 15m" in the last day when the time is exact.
  remaining: string;
}

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const unit = (value: number, u: 'day' | 'hour' | 'minute', unitDisplay: 'long' | 'narrow') =>
  new Intl.NumberFormat(undefined, { style: 'unit', unit: u, unitDisplay }).format(value);

/**
 * Time until something starts, or until it ends while it's running; null once it's
 * over. With `exact` times (a real start/end moment), the last day counts down in
 * hours and minutes. Without them — calendar dates read as local midnight — only whole
 * days are meaningful, since the real time of day is unknown.
 */
export function getCountdown(
  start: Date | null,
  end: Date | null,
  exact: boolean,
  now: Date = new Date()
): Countdown | null {
  let phase: Countdown['phase'];
  let target: Date;
  if (start && now < start) {
    phase = 'starts';
    target = start;
  } else if (end && now < end) {
    phase = 'ends';
    target = end;
  } else {
    return null;
  }
  const ms = target.getTime() - now.getTime();
  if (exact && ms < MS_PER_DAY) {
    const hours = Math.floor(ms / MS_PER_HOUR);
    const minutes = Math.max(1, Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE));
    const remaining = hours
      ? `${unit(hours, 'hour', 'narrow')} ${unit(minutes, 'minute', 'narrow')}`
      : unit(minutes, 'minute', 'narrow');
    return { phase, target, remaining };
  }
  // Whole days: floor for an exact moment; for a calendar date, the number of
  // midnights between today and it (at least 1, since it's still ahead).
  const days = exact
    ? Math.floor(ms / MS_PER_DAY)
    : Math.max(1, Math.round((target.getTime() - startOfDay(now).getTime()) / MS_PER_DAY));
  return { phase, target, remaining: unit(days, 'day', 'long') };
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Long date and time in the viewer's locale, e.g. "16 September 2026 at 16:00". */
export function formatLongDateTime(date: Date): string {
  return date.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
}
