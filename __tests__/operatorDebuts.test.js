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

function withObtainMethod(html, method) {
  return `${html}<table><tbody><tr><td><b>How to obtain</b></td>
    <td><div><span>${method}</span></div></td></tr></tbody></table>`;
}

describe('resolveOperatorDebutEvent', () => {
  beforeEach(() => {
    mockFetchEventDetailsViaApi.mockReset();
  });

  test('fetches and caches a name not yet in the cache', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(
      apiHtml(withObtainMethod(introducedHtml, 'Limited Headhunting - Carnival'))
    );
    const cache = {};

    const result = await resolveOperatorDebutEvent('New Operator', cache);

    expect(result).toEqual({ event: 'Some Event', isFestival: false });
    expect(cache['New Operator']).toEqual({ event: 'Some Event', isFestival: false });
    expect(mockFetchEventDetailsViaApi).toHaveBeenCalledTimes(1);
  });

  test('marks isFestival true when the "How to obtain" text names a Festival Limited banner', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(
      apiHtml(withObtainMethod(introducedHtml, 'Limited Headhunting - Festival'))
    );
    const cache = {};

    const result = await resolveOperatorDebutEvent('Festival Operator', cache);

    expect(result).toEqual({ event: 'Some Event', isFestival: true });
  });

  test('reuses a cached value without fetching again', async () => {
    const cache = { 'Old Operator': { event: 'Earlier Event', isFestival: false } };

    const result = await resolveOperatorDebutEvent('Old Operator', cache);

    expect(result).toEqual({ event: 'Earlier Event', isFestival: false });
    expect(mockFetchEventDetailsViaApi).not.toHaveBeenCalled();
  });

  // Regression test: an older cache (before isFestival was tracked) stored a bare
  // string|null instead of this object shape — that must be treated as stale and
  // re-resolved, not returned as-is (which would hand callers a shape without
  // `isFestival` and break the `.event`/`.isFestival` accessors they now use).
  test('re-resolves a cached entry left over from the old string|null cache shape', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(
      apiHtml(withObtainMethod(introducedHtml, 'Limited Headhunting - Carnival'))
    );
    const cache = { 'Legacy Operator': 'Some Event' };

    const result = await resolveOperatorDebutEvent('Legacy Operator', cache);

    expect(result).toEqual({ event: 'Some Event', isFestival: false });
    expect(mockFetchEventDetailsViaApi).toHaveBeenCalledTimes(1);
  });

  test('caches a null event (and does not re-fetch) when the page has no confident debut, since the fetch itself succeeded', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(apiHtml('<div><p>No changelog here.</p></div>'));
    const cache = {};

    const result = await resolveOperatorDebutEvent('Ambiguous Operator', cache);

    expect(result).toEqual({ event: null, isFestival: false });
    expect(cache['Ambiguous Operator']).toEqual({ event: null, isFestival: false });
  });

  // Regression test: a failed fetch must never be cached as if it were a genuine
  // result, or a transient network error would permanently and wrongly block that
  // operator from ever sparking (since a cache hit never re-fetches).
  test('does not cache a failed fetch (fetchEventDetailsViaApi returns null)', async () => {
    mockFetchEventDetailsViaApi.mockResolvedValue(null);
    const cache = {};
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await resolveOperatorDebutEvent('Flaky Operator', cache);

    expect(result).toBeNull();
    expect(cache).not.toHaveProperty('Flaky Operator');

    vi.restoreAllMocks();
  });
});
