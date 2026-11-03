import { normalizeEventName } from './gameData.js';
import type { ProcessedEvent } from '../types.js';

// When arkpedia.net is down, upcoming events that only it dates (predicted Global
// dates from the CN run) come back with no start and get filtered out — on Nov 3
// 2026 that took the site from 16 events to 4 overnight. In that case keep the
// previous run's entry for each such event that hasn't ended yet, so one bad day at
// a supplementary source doesn't empty the schedule.
export function carryOverEvents(
  processed: ProcessedEvent[],
  previous: unknown,
  today: string
): ProcessedEvent[] {
  if (!Array.isArray(previous)) return [];
  const have = new Set(processed.map((e) => normalizeEventName(e.name)));
  return (previous as ProcessedEvent[]).filter(
    (e) =>
      e &&
      typeof e.name === 'string' &&
      e.start &&
      !have.has(normalizeEventName(e.name)) &&
      (e.end == null || e.end >= today)
  );
}
