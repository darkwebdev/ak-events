// CommonJS copy of date helpers for Jest (Node require)
function calculateDaysBetween(eventDate) {
  if (!eventDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventStart = new Date(eventDate);
  eventStart.setHours(0, 0, 0, 0);
  if (eventStart <= today) return 0;
  const diffTime = eventStart - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function getEffectiveStart(event) {
  if (event.globalStart) return new Date(event.globalStart);
  if (event.cnStart) {
    const d = new Date(event.cnStart);
    d.setMonth(d.getMonth() + 6);
    return d;
  }
  if (event.start) return new Date(event.start);
  return null;
}

function getEffectiveEnd(event) {
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

function formatEventDates(event) {
  const start = getEffectiveStart(event);
  if (start) {
    if (!event.globalStart && event.cnStart) {
      return `${start.toLocaleDateString()} (estimated)`;
    }
    return start.toLocaleDateString();
  }
  return 'Unknown';
}

module.exports = { calculateDaysBetween, getEffectiveStart, getEffectiveEnd, formatEventDates };
