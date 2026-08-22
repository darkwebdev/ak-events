let calculateSelectedEventData;
let calculateLatestEventStart;
let getEffectiveStart;

beforeAll(async () => {
  const eventsMod = await import('../../src/client/utils/events.js');
  calculateSelectedEventData = eventsMod.calculateSelectedEventData;
  calculateLatestEventStart = eventsMod.calculateLatestEventStart;
  const datesMod = await import('../../src/client/utils/dates.js');
  getEffectiveStart = datesMod.getEffectiveStart;
});

describe('calculateSelectedEventData / calculateLatestEventStart', () => {
  // Regression test: the "Total Orundum by <date>" figure must use the same
  // estimated Global start (CN start + 6 months) that the event list displays
  // to the user, not the raw un-estimated cnStart. Previously these disagreed:
  // an event only known via its CN date (e.g. cnStart 2026-03-10) was shown in
  // the events list as starting 2026-09-10 (the +6 month Global estimate), but
  // the Total Orundum panel used the raw 2026-03-10 for its date and day-count
  // math, silently producing a wrong pull total.
  test('uses the same estimated Global start as the events list for a CN-only event', () => {
    const cnOnlyEvent = {
      name: 'CN Only Event',
      globalStart: null,
      cnStart: '2026-03-10',
    };
    const filteredEvents = [cnOnlyEvent];
    const selectedEvents = new Set(['CN Only Event']);

    const displayedStart = getEffectiveStart(cnOnlyEvent);
    const { latestStart } = calculateSelectedEventData(filteredEvents, selectedEvents);

    expect(latestStart.getTime()).toBe(displayedStart.getTime());
    // The estimate is +6 months from the raw CN date, not the raw CN date itself.
    expect(latestStart.getMonth()).toBe(new Date('2026-03-10').getMonth() + 6);
  });

  test('calculateLatestEventStart also uses the estimated Global start', () => {
    const cnOnlyEvent = { name: 'CN Only Event', globalStart: null, cnStart: '2026-03-10' };
    const displayedStart = getEffectiveStart(cnOnlyEvent);

    const latestStart = calculateLatestEventStart([cnOnlyEvent]);

    expect(latestStart.getTime()).toBe(displayedStart.getTime());
  });

  test('prefers the real Global start when present, over any CN estimate', () => {
    const globalEvent = { name: 'Global Event', globalStart: '2026-09-10', cnStart: '2026-03-10' };

    const { latestStart } = calculateSelectedEventData([globalEvent], new Set(['Global Event']));

    expect(latestStart.toISOString().startsWith('2026-09-10')).toBe(true);
  });

  test('picks the latest start among multiple selected events', () => {
    const earlier = { name: 'Earlier', globalStart: '2026-09-01' };
    const later = { name: 'Later', globalStart: '2026-10-15' };

    const { latestStart, daysUntilLastEvent } = calculateSelectedEventData(
      [earlier, later],
      new Set(['Earlier', 'Later'])
    );

    expect(latestStart.toISOString().startsWith('2026-10-15')).toBe(true);
    expect(daysUntilLastEvent).toBeGreaterThanOrEqual(0);
  });
});
