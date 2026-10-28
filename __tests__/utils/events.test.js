let calculateSelectedEventData;
let calculateLatestEventStart;
let getEffectiveStart;
let toIsoDate;

beforeAll(async () => {
  const eventsMod = await import('../../src/client/utils/events.js');
  calculateSelectedEventData = eventsMod.calculateSelectedEventData;
  calculateLatestEventStart = eventsMod.calculateLatestEventStart;
  const datesMod = await import('../../src/client/utils/dates.js');
  getEffectiveStart = datesMod.getEffectiveStart;
  toIsoDate = datesMod.toIsoDate;
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

    expect(toIsoDate(latestStart)).toBe('2026-09-10');
  });

  test('picks the latest start among multiple selected events', () => {
    const earlier = { name: 'Earlier', globalStart: '2026-09-01' };
    const later = { name: 'Later', globalStart: '2026-10-15' };

    const { latestStart, daysUntilLastEvent } = calculateSelectedEventData(
      [earlier, later],
      new Set(['Earlier', 'Later'])
    );

    expect(toIsoDate(latestStart)).toBe('2026-10-15');
    expect(daysUntilLastEvent).toBeGreaterThanOrEqual(0);
  });
});

describe('filterEvents', () => {
  let filterEvents;
  beforeAll(async () => {
    ({ filterEvents } = await import('../../src/client/utils/events.js'));
  });

  const events = [
    { name: 'Limited with rewards', origPrime: 20, banner: { type: 'Limited' } },
    { name: 'Rerun with certificates', intCerts: 1000 },
    { name: 'Free pulls only', dailyFreePulls: 14, banner: { type: 'Limited' } },
    { name: 'Standard, nothing', origPrime: 0, banner: { type: 'Standard' } },
    { name: 'Limited, nothing', banner: { type: 'Limited' } },
  ];
  const names = (list) => list.map((e) => e.name);

  test('shows everything with no filters on', () => {
    expect(filterEvents(events, { rewardsOnly: false, limitedOnly: false })).toEqual(events);
  });

  test('with rewards only: any Originite Prime, permits, free pulls or certificates', () => {
    expect(names(filterEvents(events, { rewardsOnly: true, limitedOnly: false }))).toEqual([
      'Limited with rewards',
      'Rerun with certificates',
      'Free pulls only',
    ]);
  });

  test('limited only: events whose banner is Limited', () => {
    expect(names(filterEvents(events, { rewardsOnly: false, limitedOnly: true }))).toEqual([
      'Limited with rewards',
      'Free pulls only',
      'Limited, nothing',
    ]);
  });

  test('both filters together', () => {
    expect(names(filterEvents(events, { rewardsOnly: true, limitedOnly: true }))).toEqual([
      'Limited with rewards',
      'Free pulls only',
    ]);
  });
});
