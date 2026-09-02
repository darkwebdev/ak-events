import { getEffectiveEnd, getEffectiveStart } from './dates.js';
import type { Event, SelectedEvents } from '../types.js';

/**
 * Filter events to only show upcoming events (ending today or later)
 */
export function filterUpcomingEvents(events: Event[], today: Date): Event[] {
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  return events.filter((event) => {
    const eventEnd = getEffectiveEnd(event);
    if (!eventEnd) return false;
    return eventEnd >= endOfToday;
  });
}

interface SelectedEventData {
  selectedList: Event[];
  selectedEventStarts: Date[];
  latestStart: Date | null;
  daysUntilLastEvent: number;
}

/**
 * Calculate data for selected events
 */
export function calculateSelectedEventData(
  filteredEvents: Event[],
  selectedEvents: SelectedEvents
): SelectedEventData {
  const selectedList = filteredEvents.filter((ev) => selectedEvents.has(ev.name));
  const selectedEventStarts = selectedList
    .map((event) => getEffectiveStart(event))
    .filter((d): d is Date => d != null);
  const latestStart =
    selectedEventStarts.length > 0
      ? new Date(Math.max(...selectedEventStarts.map((s) => s.getTime())))
      : null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysUntilLastEvent = latestStart
    ? Math.max(0, Math.ceil((latestStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  return { selectedList, selectedEventStarts, latestStart, daysUntilLastEvent };
}

/**
 * Calculate latest event start from selected events
 */
export function calculateLatestEventStart(selectedList: Event[]): Date | null {
  const eventStarts = selectedList
    .map((event) => getEffectiveStart(event))
    .filter((d): d is Date => d != null);
  return eventStarts.length > 0
    ? new Date(Math.max(...eventStarts.map((start) => start.getTime())))
    : null;
}
