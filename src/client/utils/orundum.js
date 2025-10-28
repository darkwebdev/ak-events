/**
 * Calculate total orundum from events, daily, and owned
 * @param {Object[]} events - Array of event objects with .orundum
 * @param {Set} selectedEvents - Set of selected event names
 * @param {number} dailyOrundum - Daily orundum income
 * @param {number} ownedOrundum - Orundum owned by player
 * @returns {number} Total orundum
 */
export function calcTotalOrundum(events, selectedEvents, dailyOrundum, ownedOrundum) {
  const totalEventsOrundum = events.reduce((sum, event) => {
    if (selectedEvents.has(event.name)) {
      return sum + event.orundum;
    }
    return sum;
  }, 0);
  return totalEventsOrundum + dailyOrundum + ownedOrundum;
}

/**
 * Calculate pulls from orundum
 * @param {number} orundum
 * @returns {number} Pulls
 */
export function pullsFromOrundum(orundum, precision = 0) {
  return Number((orundum / 600).toFixed(precision));
}
/**
 * Calculate orundum from event data
 * @param {Object} event - Event object with origPrime and hhPermits
 * @returns {number} Total orundum value
 */
export function calcEventOrundum(event) {
  return orundumFromOP(event.origPrime) + (event.hhPermits || 0) * 600;
}

export function calcDailyOrundum(settings) {
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

export function orundumFromOP(origPrime = 0) {
  return origPrime * 180;
}

export function orundumFromHH(hhPermits = 0) {
  return hhPermits * 600;
}
