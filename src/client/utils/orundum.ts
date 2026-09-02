import type { Event, SelectedEvents, Settings } from '../types.js';

/**
 * Calculate total orundum from events, daily, and owned
 */
export function calcTotalOrundum(
  events: Event[],
  selectedEvents: SelectedEvents,
  dailyOrundum: number,
  ownedOrundum: number
): number {
  const totalEventsOrundum = events.reduce((sum, event) => {
    if (selectedEvents.has(event.name)) {
      return sum + calcEventOrundum(event);
    }
    return sum;
  }, 0);
  return totalEventsOrundum + dailyOrundum + ownedOrundum;
}

/**
 * Calculate pulls from orundum
 */
export function pullsFromOrundum(orundum: number, precision = 0): number {
  return Number((orundum / 600).toFixed(precision));
}

/**
 * Calculate orundum value from event data
 */
export function calcEventOrundum(event: Event): number {
  return (
    orundumFromOP(event.origPrime) +
    (event.hhPermits || 0) * 600 +
    // event.intCerts is the maximum a rerun's own page states (see
    // extractIntCertsFromHtml on the server) — a ceiling assuming the player already
    // owns every substitutable reward, not a guaranteed amount, so it's only counted
    // when the user has explicitly opted in via event.intCertsIncluded (the rerun
    // event card's own checkbox).
    (event.intCertsIncluded ? orundumFromIntCerts(event.intCerts) : 0)
  );
}

export function calcDailyOrundum(settings: Settings): number {
  return Object.values(settings).reduce((total, value) => {
    if (!value.enabled) return total;

    return (
      total +
      (value.dailyOrundum || 0) +
      (value.weeklyOrundum ? value.weeklyOrundum / 7 : 0) +
      (value.biMonthlyOrundum ? value.biMonthlyOrundum / 60 : 0) +
      (value.monthlyOP ? orundumFromOP(value.monthlyOP) / 30 : 0) +
      (value.monthlyHH ? orundumFromHH(value.monthlyHH) / 30 : 0)
    );
  }, 0);
}

export function orundumFromOP(origPrime?: number | null): number {
  return (origPrime ?? 0) * 180;
}

export function orundumFromHH(hhPermits?: number | null): number {
  return (hhPermits ?? 0) * 600;
}

// The Intelligence Store exchanges 100 Orundum for 20 Intelligence Certificates —
// confirmed against a real account's own conversion (1820 certificates -> 9100
// Orundum, exactly 5:1).
export function orundumFromIntCerts(intCerts?: number | null): number {
  return (intCerts ?? 0) * 5;
}
