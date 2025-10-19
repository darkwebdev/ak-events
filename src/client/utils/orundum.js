
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
export function pullsFromOrundum(orundum, precision=0) {
  return Number((orundum / 600).toFixed(precision));
}
/**
 * Calculate orundum from event data
 * @param {Object} event - Event object with origPrime and hhPermits
 * @returns {number} Total orundum value
 */
export function calcEventOrundum(event) {
  return (event.origPrime || 0) * 180 + (event.hhPermits || 0) * 600;
}
