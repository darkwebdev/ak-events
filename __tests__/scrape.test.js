import { scrapeEvents } from '../src/server/scrape.js';

const mockFetchEventsViaApi = vi.fn();
const mockFetchUpcomingViaApi = vi.fn();
const mockFetchEventDetailsViaApi = vi.fn();
const mockDownloadImage = vi.fn();
const mockFetchBannersPageHtml = vi.fn();
const mockFetchOperatorCategories = vi.fn();

vi.mock('../src/server/lib/network.js', () => ({
  fetchEventsViaApi: (...args) => mockFetchEventsViaApi(...args),
  fetchUpcomingViaApi: (...args) => mockFetchUpcomingViaApi(...args),
  fetchEventDetailsViaApi: (...args) => mockFetchEventDetailsViaApi(...args),
  downloadImage: (...args) => mockDownloadImage(...args),
  fetchBannersPageHtml: (...args) => mockFetchBannersPageHtml(...args),
  fetchOperatorCategories: (...args) => mockFetchOperatorCategories(...args),
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
    mockLoadJson.mockReturnValue({});
    mockFetchBannersPageHtml.mockResolvedValue(null);
    mockFetchOperatorCategories.mockResolvedValue([]);
    mockDownloadImage.mockResolvedValue(undefined);
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

  test("reduces a 6★ operator's spark cost to 200 when the wiki names it as currently discounted", async () => {
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
    mockFetchEventDetailsViaApi.mockResolvedValue({
      parse: {
        text: {
          '*': `<div class="mw-content-ltr mw-parser-output"><ul><li>The amount of
            Headhunting Data Contracts needed to buy Test Operator in the Headhunting
            Data Contract Store is reduced to 200.</li></ul></div>`,
        },
      },
    });

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
