import type { Event } from '../types.js';

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
export function getEffectiveStart(event: Event): Date | null {
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

export function getEffectiveEnd(event: Event): Date | null {
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
