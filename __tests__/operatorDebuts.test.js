import { resolveOperatorDebutEvent } from '../src/server/lib/operatorDebuts.js';

const mockFetchEventDetailsViaApi = vi.fn();

vi.mock('../src/server/lib/network.js', () => ({
  fetchEventDetailsViaApi: (...args) => mockFetchEventDetailsViaApi(...args),
}));

function apiHtml(html) {
  return { parse: { text: { '*': html } } };
}

const introducedHtml = `<div class="mw-content-ltr mw-parser-output">
  <h2><span class="mw-headline" id="Changelog">Changelog</span></h2>
  <ul><li><b><a href="/wiki/Some_Event" title="Some Event">Some Event</a></b> <i>Introduced.</i></li></ul>
</div>`;

describe('resolveOperatorDebutEvent', () => {
  beforeEach(() => {
    mockFetchEventDetailsViaApi.mockReset();
  });

  test('fetches and caches a name not yet in the cache', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(apiHtml(introducedHtml));
    const cache = {};

    const debutEvent = await resolveOperatorDebutEvent('New Operator', cache);

    expect(debutEvent).toBe('Some Event');
    expect(cache['New Operator']).toBe('Some Event');
    expect(mockFetchEventDetailsViaApi).toHaveBeenCalledTimes(1);
  });

  test('reuses a cached value without fetching again', async () => {
    const cache = { 'Old Operator': 'Earlier Event' };

    const debutEvent = await resolveOperatorDebutEvent('Old Operator', cache);

    expect(debutEvent).toBe('Earlier Event');
    expect(mockFetchEventDetailsViaApi).not.toHaveBeenCalled();
  });

  test('caches null (and does not re-fetch) when the page has no confident debut, since the fetch itself succeeded', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(apiHtml('<div><p>No changelog here.</p></div>'));
    const cache = {};

    const debutEvent = await resolveOperatorDebutEvent('Ambiguous Operator', cache);

    expect(debutEvent).toBeNull();
    expect(cache).toHaveProperty('Ambiguous Operator', null);
  });

  // Regression test: a failed fetch must never be cached as if it were a genuine
  // result, or a transient network error would permanently and wrongly block that
  // operator from ever sparking (since a cache hit never re-fetches).
  test('does not cache a failed fetch (fetchEventDetailsViaApi returns null)', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(null);
    const cache = {};
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const debutEvent = await resolveOperatorDebutEvent('Flaky Operator', cache);

    expect(debutEvent).toBeNull();
    expect(cache).not.toHaveProperty('Flaky Operator');

    vi.restoreAllMocks();
  });
});
