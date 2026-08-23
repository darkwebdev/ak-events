import { scrapeEvents } from '../src/server/scrape.js';

const mockFetchEventsViaApi = vi.fn();
const mockFetchUpcomingViaApi = vi.fn();
const mockFetchEventDetailsViaApi = vi.fn();
const mockDownloadImage = vi.fn();
const mockFetchBannersPageHtml = vi.fn();
const mockFetchOperatorCategories = vi.fn();
const mockFetchGachaTable = vi.fn();
const mockFetchCharacterTable = vi.fn();

vi.mock('../src/server/lib/network.js', () => ({
  fetchEventsViaApi: (...args) => mockFetchEventsViaApi(...args),
  fetchUpcomingViaApi: (...args) => mockFetchUpcomingViaApi(...args),
  fetchEventDetailsViaApi: (...args) => mockFetchEventDetailsViaApi(...args),
  downloadImage: (...args) => mockDownloadImage(...args),
  fetchBannersPageHtml: (...args) => mockFetchBannersPageHtml(...args),
  fetchOperatorCategories: (...args) => mockFetchOperatorCategories(...args),
  fetchGachaTable: (...args) => mockFetchGachaTable(...args),
  fetchCharacterTable: (...args) => mockFetchCharacterTable(...args),
}));

const mockSaveJson = vi.fn();
const mockEnsureDir = vi.fn();
const mockFileExists = vi.fn();
const mockLoadJson = vi.fn();

vi.mock('../src/server/lib/storage.js', () => ({
  saveJson: (...args) => mockSaveJson(...args),
  ensureDir: (...args) => mockEnsureDir(...args),
  fileExists: (...args) => mockFileExists(...args),
  loadJson: (...args) => mockLoadJson(...args),
}));

// A minimal but structurally real Headhunting/Banners page fragment: a Limited
// section with one banner row (name, CN+Global dates, one rate-up operator).
function buildBannerPageHtml({
  name = 'Test Banner',
  tag = 'Carnival',
  globalDate = '2026/06/01 – 2026/06/15',
  cnDate = '2026/01/01 – 2026/01/15',
  operatorName = 'Test Operator',
} = {}) {
  return `
    <div class="mw-content-ltr mw-parser-output">
      <h2><span class="mw-headline" id="Limited_Headhunting">Limited Headhunting</span></h2>
      <table>
        <tbody>
          <tr>
            <td><div class="banner"><b>[${tag}] ${name}</b></div>
              <div>CN date: ${cnDate}</div>
              <div>Global date: ${globalDate}</div>
            </td>
            <td>
              <div class="character-tooltip" data-star="6" data-class="Guard" data-name="${operatorName}">
                <img src="/images/test_icon.png" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

describe('scrapeEvents', () => {
  let exitSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchUpcomingViaApi.mockResolvedValue(null);
    mockFileExists.mockReturnValue(false);
    // A fresh object per call, not a single shared reference — loadJson backs several
    // independent caches (operator Limited flags, operator debut events, ...), and a
    // single shared `{}` would make writes to one accidentally pollute the others.
    mockLoadJson.mockImplementation(() => ({}));
    mockFetchBannersPageHtml.mockResolvedValue(null);
    mockFetchOperatorCategories.mockResolvedValue([]);
    mockDownloadImage.mockResolvedValue(undefined);
    // Default: no game data available, so every 6★ spark cost falls back to 300 —
    // individual tests override these to give a specific operator an old-enough
    // debut date to exercise the 200-cost reduction.
    mockFetchGachaTable.mockResolvedValue(null);
    mockFetchCharacterTable.mockResolvedValue(null);
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Regression test for the bug where a blocked/failed wiki fetch caused the
  // scraper to overwrite public/data/events.json with an empty array, which the
  // daily GitHub Action then committed and pushed, wiping the deployed events list.
  test('aborts without writing any output when the wiki index fetch is blocked (returns null)', async () => {
    mockFetchEventsViaApi.mockResolvedValue(null);

    await expect(scrapeEvents()).rejects.toThrow('process.exit:1');

    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(mockSaveJson).not.toHaveBeenCalled();
  });

  test('aborts without writing any output when the wiki index fetch resolves to an empty array', async () => {
    mockFetchEventsViaApi.mockResolvedValue([]);

    await expect(scrapeEvents()).rejects.toThrow('process.exit:1');

    expect(mockSaveJson).not.toHaveBeenCalled();
  });

  test('does not abort, and still saves data, when the CN upcoming page fills in events the main index missed', async () => {
    mockFetchEventsViaApi.mockResolvedValue(null);
    mockFetchUpcomingViaApi.mockResolvedValue([
      { name: 'CN Upcoming Event', link: null, image: null },
    ]);

    await scrapeEvents();

    expect(exitSpy).not.toHaveBeenCalled();
    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    expect(eventsJsonCalls.length).toBeGreaterThan(0);
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    expect(savedEvents.map((e) => e.name)).toContain('CN Upcoming Event');
  });

  test('saves the scraped events when the index fetch succeeds normally', async () => {
    mockFetchEventsViaApi.mockResolvedValue([{ name: 'Test Event', link: null, image: null }]);

    await scrapeEvents();

    expect(exitSpy).not.toHaveBeenCalled();
    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    expect(savedEvents).toHaveLength(1);
    expect(savedEvents[0].name).toBe('Test Event');
  });

  test("attaches banner + operator data when an event's start date matches a banner", async () => {
    // Simulate "file now exists after download" so the icon path resolves like it
    // would against a real filesystem.
    const downloadedPaths = new Set();
    mockFileExists.mockImplementation((p) => downloadedPaths.has(p));
    mockDownloadImage.mockImplementation(async (url, filepath) => {
      downloadedPaths.add(filepath);
    });
    // Both the "Upcoming" and "current year" fetches return the same banner, exactly
    // as happens for real during the editorial-lag window where a banner is listed on
    // both pages — proving indexBannersByDate's name-based dedup merges them instead
    // of tripping the same-date-collision warning against itself.
    mockFetchBannersPageHtml.mockResolvedValue(buildBannerPageHtml());
    mockFetchEventsViaApi.mockResolvedValue([
      {
        name: 'Story Event',
        link: null,
        image: null,
        globalDateStr: '2026/06/01–2026/06/20',
        cnDateStr: null,
      },
    ]);

    await scrapeEvents();

    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    expect(savedEvents[0].banner).toEqual({
      name: 'Test Banner',
      type: 'Limited',
      sparkEligible: true,
      operators: [
        {
          name: 'Test Operator',
          star: 6,
          class: 'Guard',
          limited: true,
          icon: 'data/images/operators/test_icon.png',
          sparkCost: 300,
        },
      ],
    });
  });

  test("reduces a 6★ operator's spark cost to 200 once game data shows them 4+ years past their debut", async () => {
    const downloadedPaths = new Set();
    mockFileExists.mockImplementation((p) => downloadedPaths.has(p));
    mockDownloadImage.mockImplementation(async (url, filepath) => {
      downloadedPaths.add(filepath);
    });
    mockFetchBannersPageHtml.mockResolvedValue(buildBannerPageHtml());
    mockFetchEventsViaApi.mockResolvedValue([
      {
        name: 'Story Event',
        link: 'https://example.com/wiki/Story_Event',
        image: null,
        globalDateStr: '2026/06/01–2026/06/20',
        cnDateStr: null,
      },
    ]);
    mockFetchEventDetailsViaApi.mockResolvedValue({ parse: { text: { '*': '<div></div>' } } });
    mockFetchGachaTable.mockResolvedValue({
      gachaPoolClient: [
        {
          gachaRuleType: 'LIMITED',
          openTime: Math.floor(new Date('2000-01-01').getTime() / 1000), // long past 4 years old
          limitParam: { limitedCharId: 'char_test_op' },
        },
      ],
    });
    mockFetchCharacterTable.mockResolvedValue({ char_test_op: { name: 'Test Operator' } });

    await scrapeEvents();

    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    expect(savedEvents[0].banner.operators[0]).toMatchObject({
      name: 'Test Operator',
      sparkCost: 200,
    });
  });

  test("computes each operator's spark cost independently from their own debut date", async () => {
    const downloadedPaths = new Set();
    mockFileExists.mockImplementation((p) => downloadedPaths.has(p));
    mockDownloadImage.mockImplementation(async (url, filepath) => {
      downloadedPaths.add(filepath);
    });
    const twoOperatorBannerHtml = `
      <div class="mw-content-ltr mw-parser-output">
        <h2><span class="mw-headline" id="Limited_Headhunting">Limited Headhunting</span></h2>
        <table>
          <tbody>
            <tr>
              <td><div class="banner"><b>[Celebration] Test Banner</b></div>
                <div>CN date: 2026/01/01 – 2026/01/15</div>
                <div>Global date: 2026/06/01 – 2026/06/15</div>
              </td>
              <td>
                <div class="character-tooltip" data-star="6" data-class="Guard" data-name="First Operator">
                  <img src="/images/first_icon.png" />
                </div>
                <div class="character-tooltip" data-star="6" data-class="Sniper" data-name="Second Operator">
                  <img src="/images/second_icon.png" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    mockFetchBannersPageHtml.mockResolvedValue(twoOperatorBannerHtml);
    mockFetchEventsViaApi.mockResolvedValue([
      {
        name: 'Story Event',
        link: 'https://example.com/wiki/Story_Event',
        image: null,
        globalDateStr: '2026/06/01–2026/06/20',
        cnDateStr: null,
      },
    ]);
    mockFetchEventDetailsViaApi.mockResolvedValue({ parse: { text: { '*': '<div></div>' } } });
    mockFetchGachaTable.mockResolvedValue({
      gachaPoolClient: [
        {
          gachaRuleType: 'LIMITED',
          openTime: Math.floor(new Date('2000-01-01').getTime() / 1000), // long past 4 years old
          limitParam: { limitedCharId: 'char_first' },
        },
        {
          gachaRuleType: 'LIMITED',
          openTime: Math.floor(Date.now() / 1000) - 60, // debuted moments ago
          limitParam: { limitedCharId: 'char_second' },
        },
      ],
    });
    mockFetchCharacterTable.mockResolvedValue({
      char_first: { name: 'First Operator' },
      char_second: { name: 'Second Operator' },
    });

    await scrapeEvents();

    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    const { operators } = savedEvents[0].banner;
    expect(operators.find((op) => op.name === 'First Operator').sparkCost).toBe(200);
    expect(operators.find((op) => op.name === 'Second Operator').sparkCost).toBe(300);
  });

  test('gives no spark cost to an operator debuting on this event, even though they render as rate-up', async () => {
    const downloadedPaths = new Set();
    mockFileExists.mockImplementation((p) => downloadedPaths.has(p));
    mockDownloadImage.mockImplementation(async (url, filepath) => {
      downloadedPaths.add(filepath);
    });
    const twoOperatorBannerHtml = `
      <div class="mw-content-ltr mw-parser-output">
        <h2><span class="mw-headline" id="Limited_Headhunting">Limited Headhunting</span></h2>
        <table>
          <tbody>
            <tr>
              <td><div class="banner"><b>[Celebration] Test Banner</b></div>
                <div>CN date: 2026/01/01 – 2026/01/15</div>
                <div>Global date: 2026/06/01 – 2026/06/15</div>
              </td>
              <td>
                <div class="character-tooltip" data-star="6" data-class="Guard" data-name="Debuting Operator">
                  <img src="/images/debuting_icon.png" />
                </div>
                <div class="character-tooltip" data-star="6" data-class="Sniper" data-name="Carried Over Operator">
                  <img src="/images/carried_icon.png" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    mockFetchBannersPageHtml.mockResolvedValue(twoOperatorBannerHtml);
    mockFetchEventsViaApi.mockResolvedValue([
      {
        name: 'Story Event',
        link: null,
        image: null,
        globalDateStr: '2026/06/01–2026/06/20',
        cnDateStr: null,
      },
    ]);
    // fetchEventDetailsViaApi is reused for both the event page (skipped here since
    // link is null) and each operator's own page during debut resolution — key the
    // response on which operator is being asked about.
    mockFetchEventDetailsViaApi.mockImplementation(async (nameOrUrl) => {
      if (nameOrUrl === 'Debuting Operator') {
        return {
          parse: {
            text: {
              '*': `<div><h2><span class="mw-headline" id="Changelog">Changelog</span></h2>
                <ul><li><b><a href="/wiki/Story_Event" title="Story Event">Story Event</a></b> <i>Introduced.</i></li></ul>
              </div>`,
            },
          },
        };
      }
      if (nameOrUrl === 'Carried Over Operator') {
        return {
          parse: {
            text: {
              '*': `<div><h2><span class="mw-headline" id="Changelog">Changelog</span></h2>
                <ul><li><b><a href="/wiki/Story_Event" title="Story Event">Story Event</a></b>
                  <ul><li>Added into the Celebration limited headhunting banners.</li></ul></li>
                <li><b><a href="/wiki/Earlier_Event" title="Earlier Event">Earlier Event</a></b> <i>Introduced.</i></li></ul>
              </div>`,
            },
          },
        };
      }
      return null;
    });

    await scrapeEvents();

    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    const { operators } = savedEvents[0].banner;
    expect(operators.find((op) => op.name === 'Debuting Operator').sparkCost).toBeNull();
    expect(operators.find((op) => op.name === 'Carried Over Operator').sparkCost).toBe(300);
  });

  test('leaves banner null when no banner starts on the same date as the event', async () => {
    mockFetchBannersPageHtml.mockResolvedValue(buildBannerPageHtml());
    mockFetchEventsViaApi.mockResolvedValue([
      {
        name: 'Unrelated Event',
        link: null,
        image: null,
        globalDateStr: '2026/09/01–2026/09/20',
        cnDateStr: null,
      },
    ]);

    await scrapeEvents();

    const eventsJsonCalls = mockSaveJson.mock.calls.filter(
      ([path]) => path === 'public/data/events.json'
    );
    const [, savedEvents] = eventsJsonCalls[eventsJsonCalls.length - 1];
    expect(savedEvents[0].banner).toBeNull();
  });
});
