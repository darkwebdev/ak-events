import {
  formatGain,
  resourceGains,
  snapshotFromFetch,
} from '../../src/client/utils/resourceGains.js';

const fetched = (overrides = {}) => ({
  nickName: 'Doctor',
  level: 120,
  avatarUrl: null,
  orundum: 1000,
  originitePrime: 5,
  headhuntingPermits: 3,
  tenHeadhuntingPermits: 0,
  roster: {},
  bannerProgress: { items: {}, pools: {} },
  sanity: 80,
  maxSanity: 135,
  threeStarStages: [],
  sanityPotions: [],
  ...overrides,
});

describe('resourceGains', () => {
  test('lists every resource that went up, with its amount', () => {
    const prev = snapshotFromFetch(fetched());
    const next = snapshotFromFetch(
      fetched({
        orundum: 2200,
        originitePrime: 6,
        headhuntingPermits: 5,
        sanityPotions: [
          { itemId: 'ap_supply_lt_010', sanity: 10, count: 2, expiresAt: null },
          { itemId: 'ap_supply_lt_120', sanity: 120, count: 1, expiresAt: 1 },
        ],
      })
    );

    expect(resourceGains(prev, next).map(formatGain)).toEqual([
      '+1,200 Orundum',
      '+1 Originite Prime',
      '+2 Headhunting Permits',
      '+3 Sanity potions',
    ]);
  });

  test('leaves out what stayed the same or was spent', () => {
    const prev = snapshotFromFetch(fetched({ orundum: 5000 }));
    const next = snapshotFromFetch(fetched({ orundum: 400, originitePrime: 5 }));

    expect(resourceGains(prev, next)).toEqual([]);
  });

  test("names banner items by kind and counts a new banner's items from zero", () => {
    const prev = snapshotFromFetch(
      fetched({ bannerProgress: { items: { LMTGS_COIN_7001: 10 }, pools: {} } })
    );
    const next = snapshotFromFetch(
      fetched({
        bannerProgress: {
          items: { LMTGS_COIN_7001: 25, LIMITED_TKT_GACHA_10_7002: 1 },
          pools: {},
        },
      })
    );

    expect(resourceGains(prev, next).map(formatGain)).toEqual([
      '+15 Headhunting Data Contracts',
      '+1 Limited ten-roll Permit',
    ]);
  });

  test('skips a fixed resource the old snapshot never had', () => {
    const next = snapshotFromFetch(fetched({ orundum: 1600 }));
    const { sanityPotions: _missing, ...prev } = snapshotFromFetch(fetched());
    next.sanityPotions = 4;

    expect(resourceGains(prev, next).map(formatGain)).toEqual(['+600 Orundum']);
  });
});
