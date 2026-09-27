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
 * Calculate days between today and event date
 */
export function calculateDaysBetween(eventDate: string | null | undefined): number {
  if (!eventDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today

  const eventStart = new Date(eventDate);
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
  if (event.globalStart) return new Date(event.globalStart);
  if (event.cnStart) {
    const d = new Date(event.cnStart);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  if (event.start) return new Date(event.start);
  return null;
}

export function getEffectiveEnd(event: DateFields): Date | null {
  // Prefer globalEnd, fallback to estimated cnEnd (+6 months), then end/start fallbacks
  if (event.globalEnd) return new Date(event.globalEnd);
  if (event.cnEnd) {
    const d = new Date(event.cnEnd);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  if (event.end) return new Date(event.end);
  if (event.globalStart) return new Date(event.globalStart);
  if (event.cnStart) {
    const d = new Date(event.cnStart);
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
      start: new Date(banner.globalStart),
      end: banner.globalEnd ? new Date(banner.globalEnd) : null,
      estimated: false,
    };
  }
  const eventStart = getEffectiveStart(event);
  if (banner.cnStart && event.cnStart && eventStart) {
    const lag = eventStart.getTime() - new Date(event.cnStart).getTime();
    const shift = (d: string) => new Date(new Date(d).getTime() + lag);
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
      return `${start.toLocaleDateString()} (estimated)`;
    }
    return start.toLocaleDateString();
  }
  return 'Unknown';
}

// (ESM module) no CommonJS fallback
