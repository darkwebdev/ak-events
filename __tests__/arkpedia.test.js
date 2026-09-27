import {
  parseArkpediaEventsList,
  parseArkpediaEventNames,
  parseArkpediaEventDetail,
  arkpediaNameKey,
} from '../src/server/lib/arkpedia.js';

function wrapNextData(pageProps) {
  const json = JSON.stringify({ props: { pageProps } });
  return `<html><body><script id="__NEXT_DATA__" type="application/json">${json}</script></body></html>`;
}

describe('parseArkpediaEventsList', () => {
  test('extracts name/dateStr/isPredicted from the embedded __NEXT_DATA__ events array', () => {
    const html = wrapNextData({
      events: [
        { name: 'Confirmed Event', dateRange: '2026/08/20–2026/10/02', isPredicted: false },
        { name: 'Predicted Event', dateRange: '2026/10/08–2026/10/22', isPredicted: true },
      ],
    });

    const events = parseArkpediaEventsList(html);

    expect(events).toEqual([
      { name: 'Confirmed Event', dateStr: '2026/08/20–2026/10/02', isPredicted: false },
      { name: 'Predicted Event', dateStr: '2026/10/08–2026/10/22', isPredicted: true },
    ]);
  });

  test('reads eventRows on the /schedule layout, ignoring its per-server events array', () => {
    const html = wrapNextData({
      events: [
        {
          name: '[Side Story] People, A People',
          cn: { dateRange: '2026/04/07–2026/04/21' },
          global: { dateRange: '2026/09/16–2026/09/30' },
        },
      ],
      eventRows: [
        {
          name: '[Side Story] People, A People',
          dateRange: '2026/09/16–2026/09/30',
          isPredicted: false,
        },
      ],
    });

    expect(parseArkpediaEventsList(html)).toEqual([
      {
        name: '[Side Story] People, A People',
        dateStr: '2026/09/16–2026/09/30',
        isPredicted: false,
      },
    ]);
  });

  test('skips entries missing a name or dateRange rather than throwing', () => {
    const html = wrapNextData({
      events: [{ name: 'No Date' }, { dateRange: '2026/08/20–2026/10/02' }],
    });

    expect(parseArkpediaEventsList(html)).toEqual([]);
  });

  test('returns an empty array when the page has no __NEXT_DATA__ at all', () => {
    expect(parseArkpediaEventsList('<html><body>blocked or changed layout</body></html>')).toEqual(
      []
    );
    expect(parseArkpediaEventsList(null)).toEqual([]);
  });
});

describe('parseArkpediaEventNames', () => {
  test('collects unique names from both the full history and the upcoming rows', () => {
    const html = wrapNextData({
      events: [{ name: '[Side Story] Old Event' }, { name: '[Side Story] People, A People' }],
      eventRows: [{ name: '[Side Story] People, A People' }, { name: 'Duel Channel: Ivy Vine' }],
    });

    expect(parseArkpediaEventNames(html)).toEqual([
      '[Side Story] Old Event',
      '[Side Story] People, A People',
      'Duel Channel: Ivy Vine',
    ]);
  });

  test('returns an empty array without __NEXT_DATA__', () => {
    expect(parseArkpediaEventNames(null)).toEqual([]);
  });
});

describe('arkpediaNameKey', () => {
  test("matches the wiki's name to arkpedia's tagged, differently-punctuated name", () => {
    expect(arkpediaNameKey('[Side Story] People, A People')).toBe(
      arkpediaNameKey('People, A People')
    );
    expect(arkpediaNameKey('Duel Channel: Ivy Vine')).toBe(
      arkpediaNameKey('Duel Channel Ivy Vine')
    );
  });

  test('keeps a rerun distinct from its original run', () => {
    expect(arkpediaNameKey('[Rerun] Ato Rerun')).not.toBe(arkpediaNameKey('[Side Story] Ato'));
    expect(arkpediaNameKey('[Rerun] Ato Rerun')).toBe(arkpediaNameKey('Ato Rerun'));
  });
});

describe('parseArkpediaEventDetail', () => {
  test('sums Headhunting Permit quantity × stock across reward stores', () => {
    const html = wrapNextData({
      dateRange: '2026/08/27–2026/09/06',
      isPredicted: false,
      bannerName: '[Celebration] Test Banner',
      featuredOperators: [{ name: 'Test Operator', rarity: 6, percent: 35 }],
      rewardStores: [
        {
          name: 'Test Store',
          type: 'Events Store',
          items: [
            { name: 'Headhunting Permit', quantity: 1, stock: '3' },
            { name: 'LMD', quantity: '5K', stock: '20' },
          ],
        },
      ],
    });

    const detail = parseArkpediaEventDetail(html);

    expect(detail).toMatchObject({
      dateStr: '2026/08/27–2026/09/06',
      isPredicted: false,
      bannerName: '[Celebration] Test Banner',
      featuredOperators: [{ name: 'Test Operator', rarity: 6, percent: 35 }],
      headhuntingPermits: 3,
    });
  });

  test('sums a Headhunting Permit item appearing more than once (e.g. at multiple price tiers)', () => {
    const html = wrapNextData({
      rewardStores: [
        {
          name: 'Test Store',
          type: 'Events Store',
          items: [
            { name: 'Headhunting Permit', quantity: 1, stock: '2' },
            { name: 'Headhunting Permit', quantity: 1, stock: '1' },
          ],
        },
      ],
    });

    expect(parseArkpediaEventDetail(html).headhuntingPermits).toBe(3);
  });

  test('ignores an infinite-stock entry rather than treating it as a huge finite number', () => {
    const html = wrapNextData({
      rewardStores: [
        {
          name: 'Test Store',
          type: 'Events Store',
          items: [{ name: 'Headhunting Permit', quantity: 1, stock: '∞' }],
        },
      ],
    });

    expect(parseArkpediaEventDetail(html).headhuntingPermits).toBeNull();
  });

  test('returns null headhuntingPermits (not 0) when no store sells any', () => {
    const html = wrapNextData({
      rewardStores: [{ name: 'Test Store', type: 'Events Store', items: [{ name: 'LMD' }] }],
    });

    expect(parseArkpediaEventDetail(html).headhuntingPermits).toBeNull();
  });

  test('returns null when the page has no __NEXT_DATA__ at all', () => {
    expect(parseArkpediaEventDetail('<html><body>404</body></html>')).toBeNull();
    expect(parseArkpediaEventDetail(null)).toBeNull();
  });
});
