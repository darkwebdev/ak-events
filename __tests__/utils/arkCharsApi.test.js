import { fetchAccountData } from '../../src/client/utils/arkCharsApi.js';

describe('fetchAccountData', () => {
  afterEach(() => vi.unstubAllGlobals());

  const respond = (data) =>
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ json: async () => ({ data }) }))
    );

  test("returns the roster as each owned operator's potential rank, by game id", async () => {
    respond({
      myStatus: { nickName: 'Doctor', level: 120, avatarUrl: null },
      myInventory: {
        orundum: 1000,
        originitePrime: 5,
        headhuntingPermits: 3,
        tenHeadhuntingPermits: 2,
        bannerItems: [
          { itemId: 'LMTGS_COIN_7001', count: 150 },
          { itemId: 'LIMITED_TKT_GACHA_10_7001', count: 1 },
        ],
        limitedPools: [{ poolId: 'LIMITED_EN_40_0_4', pulls: 150, freeCharClaimed: false }],
      },
      myRoster: [
        { charId: 'char_113_cqbw', potentialRank: 2 },
        { charId: 'char_391_rosmon', potentialRank: 0 },
        { charId: null, potentialRank: 5 },
      ],
    });

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    expect(result.roster).toEqual({ char_113_cqbw: 2, char_391_rosmon: 0 });
    expect(result.orundum).toBe(1000);
    expect(result.tenHeadhuntingPermits).toBe(2);
    expect(result.bannerProgress).toEqual({
      items: { LMTGS_COIN_7001: 150, LIMITED_TKT_GACHA_10_7001: 1 },
      pools: { LIMITED_EN_40_0_4: { pulls: 150, freeCharClaimed: false } },
    });
  });

  test('asks for the roster in the same single request as status and inventory', async () => {
    respond({ myStatus: null, myInventory: null, myRoster: null });

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    // One request: each authenticated call logs the game session out.
    expect(fetch).toHaveBeenCalledTimes(1);
    const { query } = JSON.parse(fetch.mock.calls[0][1].body);
    expect(query).toMatch(/myRoster[\s\S]*charId[\s\S]*potentialRank/);
    expect(query).toMatch(/tenHeadhuntingPermits[\s\S]*bannerItems[\s\S]*limitedPools/);
    expect(result.roster).toEqual({});
    expect(result.bannerProgress).toEqual({ items: {}, pools: {} });
  });

  test('returns sanity and the stages cleared with 3 stars, in the same request', async () => {
    respond({
      myStatus: { nickName: 'Doctor', sanity: 80, maxSanity: 135 },
      myInventory: null,
      myRoster: null,
      myStages: [
        { stageId: 'main_01-07', state: 3 },
        { stageId: 'main_01-08', state: 2 },
        { stageId: 'main_01-09', state: 0 },
      ],
    });

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    expect(fetch).toHaveBeenCalledTimes(1);
    const { query } = JSON.parse(fetch.mock.calls[0][1].body);
    expect(query).toMatch(/myStages[\s\S]*stageId[\s\S]*state/);
    expect(result.sanity).toBe(80);
    expect(result.maxSanity).toBe(135);
    expect(result.threeStarStages).toEqual(['main_01-07']);
  });
});

describe('fetchAccountData against an older ak-account', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('retries without sanity/myStages when the API does not know them', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({
          data: null,
          errors: [{ message: 'Cannot query field "myStages" on type "Query".' }],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({
          data: { myStatus: { nickName: 'Doctor' }, myInventory: null, myRoster: null },
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retry = JSON.parse(fetchMock.mock.calls[1][1].body).query;
    expect(retry).not.toMatch(/myStages|sanity/);
    expect(retry).toMatch(/myRoster[\s\S]*potentialRank/);
    expect(result.nickName).toBe('Doctor');
    expect(result.sanity).toBeNull();
    expect(result.threeStarStages).toEqual([]);
  });
});
