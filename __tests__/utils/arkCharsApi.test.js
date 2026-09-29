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
      myInventory: { orundum: 1000, originitePrime: 5, headhuntingPermits: 3 },
      myRoster: [
        { charId: 'char_113_cqbw', potentialRank: 2 },
        { charId: 'char_391_rosmon', potentialRank: 0 },
        { charId: null, potentialRank: 5 },
      ],
    });

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    expect(result.roster).toEqual({ char_113_cqbw: 2, char_391_rosmon: 0 });
    expect(result.orundum).toBe(1000);
  });

  test('asks for the roster in the same single request as status and inventory', async () => {
    respond({ myStatus: null, myInventory: null, myRoster: null });

    const result = await fetchAccountData({ channelUid: 'u', yostarToken: 't', server: 'en' });

    // One request: each authenticated call logs the game session out.
    expect(fetch).toHaveBeenCalledTimes(1);
    const { query } = JSON.parse(fetch.mock.calls[0][1].body);
    expect(query).toMatch(/myRoster[\s\S]*charId[\s\S]*potentialRank/);
    expect(result.roster).toEqual({});
  });
});
