import { scrapeEvents } from '../src/server/scrape.js';

const mockFetchEventsViaApi = jest.fn();
const mockFetchUpcomingViaApi = jest.fn();
const mockFetchEventDetailsViaApi = jest.fn();
const mockDownloadImage = jest.fn();

jest.mock('../src/server/lib/network.js', () => ({
  fetchEventsViaApi: (...args) => mockFetchEventsViaApi(...args),
  fetchUpcomingViaApi: (...args) => mockFetchUpcomingViaApi(...args),
  fetchEventDetailsViaApi: (...args) => mockFetchEventDetailsViaApi(...args),
  downloadImage: (...args) => mockDownloadImage(...args),
}));

const mockSaveJson = jest.fn();
const mockEnsureDir = jest.fn();
const mockFileExists = jest.fn();

jest.mock('../src/server/lib/storage.js', () => ({
  saveJson: (...args) => mockSaveJson(...args),
  ensureDir: (...args) => mockEnsureDir(...args),
  fileExists: (...args) => mockFileExists(...args),
}));

describe('scrapeEvents', () => {
  let exitSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchUpcomingViaApi.mockResolvedValue(null);
    mockFileExists.mockReturnValue(false);
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit:${code}`);
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
});
