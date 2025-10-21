/**
 * Filter events to only show upcoming events (ending today or later)
 * @param {Object[]} events - Array of event objects
 * @param {Date} today - Today's date
 * @returns {Object[]} Filtered events
 */
export function filterUpcomingEvents(events, today) {
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  return events.filter(event => {
    const eventEnd = getEffectiveEnd(event);
    if (!eventEnd) return false;
    return eventEnd >= endOfToday;
  });
}

/**
 * Calculate data for selected events
 * @param {Object[]} filteredEvents - Filtered upcoming events
 * @param {Set} selectedEvents - Set of selected event names
 * @returns {Object} { selectedList, selectedEventStarts, latestStart, daysUntilLastEvent }
 */
export function calculateSelectedEventData(filteredEvents, selectedEvents) {
  const selectedList = filteredEvents.filter(ev => selectedEvents.has(ev.name));
  const selectedEventStarts = selectedList.map(event => {
    const start = event.globalStart || event.cnStart ? new Date(event.globalStart || event.cnStart) : null;
    return start;
  }).filter(Boolean);
  const latestStart = selectedEventStarts.length > 0 ? new Date(Math.max(...selectedEventStarts.map(s => s.getTime()))) : null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysUntilLastEvent = latestStart ? Math.max(0, Math.ceil((latestStart - now) / (1000 * 60 * 60 * 24))) : 0;
  return { selectedList, selectedEventStarts, latestStart, daysUntilLastEvent };
}

/**
 * Calculate latest event start from selected events
 * @param {Object[]} selectedList - Selected events
 * @returns {Date|null} Latest start date
 */
export function calculateLatestEventStart(selectedList) {
  const eventStarts = selectedList.map(event => {
    const start = event.globalStart || event.cnStart ? new Date(event.globalStart || event.cnStart) : null;
    return start;
  }).filter(Boolean);
  return eventStarts.length > 0 ? new Date(Math.max(...eventStarts.map(start => start.getTime()))) : null;
}

// Import getEffectiveEnd from dates.js
import { getEffectiveEnd } from './dates.js';