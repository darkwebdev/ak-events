import { parseArkpediaEventsList, parseArkpediaEventDetail } from '../src/server/lib/arkpedia.js';

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
