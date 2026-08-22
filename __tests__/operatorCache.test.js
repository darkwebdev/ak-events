import {
  isLimitedFromCategories,
  resolveOperatorLimited,
} from '../src/server/lib/operatorCache.js';

const mockFetchOperatorCategories = vi.fn();

vi.mock('../src/server/lib/network.js', () => ({
  fetchOperatorCategories: (...args) => mockFetchOperatorCategories(...args),
}));

describe('isLimitedFromCategories', () => {
  test('an operator with no "obtainable through X" categories is Limited', () => {
    // Verified against the real wiki: Pepe (a Carnival-limited operator) carries
    // none of these categories, unlike every non-exclusive operator.
    expect(isLimitedFromCategories(['Operator', 'Guard', '6-star'])).toBe(true);
  });

  test('an operator tagged Standard Headhunting Operators is not Limited', () => {
    expect(isLimitedFromCategories(['Operator', 'Standard Headhunting Operators'])).toBe(false);
  });

  test('an operator tagged Kernel Headhunting Operators is not Limited', () => {
    // Verified against the real wiki: Mudrock carries this category.
    expect(isLimitedFromCategories(['Operator', 'Kernel Headhunting Operators'])).toBe(false);
  });

  test('matches categories in the underscore-separated form the wiki API actually returns', () => {
    // Regression test: action=parse&prop=categories serializes names with underscores
    // in place of spaces (e.g. "Standard_Headhunting_Operators"), unlike the
    // space-separated display form. Verified against the real wiki for Ch'en the
    // Dawnstreak, an Alternate Operator who is NOT Limited despite appearing on a
    // Limited banner (the banner's title character, but obtainable afterward via
    // Standard Headhunting).
    expect(isLimitedFromCategories(['Operator', 'Standard_Headhunting_Operators'])).toBe(false);
    expect(isLimitedFromCategories(['Operator', 'Kernel_Headhunting_Operators'])).toBe(false);
    expect(isLimitedFromCategories(['Operator', 'Recruitment_Operators'])).toBe(false);
  });

  test('an operator tagged Recruitment Operators is not Limited', () => {
    expect(isLimitedFromCategories(['Operator', 'Recruitment Operators'])).toBe(false);
  });
});

describe('resolveOperatorLimited', () => {
  beforeEach(() => {
    mockFetchOperatorCategories.mockReset();
  });

  test('fetches and caches a name not yet in the cache', async () => {
    mockFetchOperatorCategories.mockResolvedValue(['Operator', '6-star']);
    const cache = {};

    const limited = await resolveOperatorLimited('Pepe', cache);

    expect(limited).toBe(true);
    expect(cache.Pepe).toBe(true);
    expect(mockFetchOperatorCategories).toHaveBeenCalledTimes(1);
  });

  test('reuses a cached value without fetching again', async () => {
    const cache = { Mudrock: false };

    const limited = await resolveOperatorLimited('Mudrock', cache);

    expect(limited).toBe(false);
    expect(mockFetchOperatorCategories).not.toHaveBeenCalled();
  });

  // Regression test: a failed fetch must never be cached as if it were a genuine
  // "no categories" result, or a transient network error would permanently mislabel
  // the operator as Limited (since a cache hit never re-fetches).
  test('does not cache a failed fetch (fetchOperatorCategories returns null)', async () => {
    mockFetchOperatorCategories.mockResolvedValue(null);
    const cache = {};
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const limited = await resolveOperatorLimited('Flaky Operator', cache);

    expect(limited).toBe(false);
    expect(cache).not.toHaveProperty('Flaky Operator');

    vi.restoreAllMocks();
  });
});
