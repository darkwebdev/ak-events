import https from 'https';
import { fetchWikiApi, fetchOperatorCategories } from '../src/server/lib/network.js';
import { wikiApiBase } from '../src/server/config.js';

vi.mock('https');

describe('network helpers', () => {
  beforeEach(() => {
    https.get.mockReset();
  });

  test('fetchWikiApi constructs URL using config.wikiApiBase', async () => {
    const fakeResponse = {
      statusCode: 200,
      on: vi.fn((ev, cb) => {
        if (ev === 'data') cb(JSON.stringify({ test: true }));
        if (ev === 'end') cb();
      }),
    };
    https.get.mockImplementation((url, options, cb) => {
      // ensure url contains config.wikiApiBase
      expect(url.startsWith(wikiApiBase)).toBe(true);
      cb(fakeResponse);
      return { on: vi.fn() };
    });
    const res = await fetchWikiApi('Some_Page');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ test: true });
  });

  test('fetchOperatorCategories returns the category names on a successful response', async () => {
    const fakeResponse = {
      statusCode: 200,
      on: vi.fn((ev, cb) => {
        if (ev === 'data')
          cb(JSON.stringify({ parse: { categories: [{ '*': 'Operator' }, { '*': '6-star' }] } }));
        if (ev === 'end') cb();
      }),
    };
    https.get.mockImplementation((url, options, cb) => {
      cb(fakeResponse);
      return { on: vi.fn() };
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toEqual(['Operator', '6-star']);
  });

  // Regression test: a non-200 response must resolve null, not [], so a transient
  // failure is never mistaken for "this operator genuinely has no categories".
  test('fetchOperatorCategories returns null (not []) on a non-200 response', async () => {
    const fakeResponse = {
      statusCode: 429,
      on: vi.fn((ev, cb) => {
        if (ev === 'data') cb('rate limited');
        if (ev === 'end') cb();
      }),
    };
    https.get.mockImplementation((url, options, cb) => {
      cb(fakeResponse);
      return { on: vi.fn() };
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
  });

  test('fetchOperatorCategories returns null on unparseable JSON', async () => {
    const fakeResponse = {
      statusCode: 200,
      on: vi.fn((ev, cb) => {
        if (ev === 'data') cb('not json');
        if (ev === 'end') cb();
      }),
    };
    https.get.mockImplementation((url, options, cb) => {
      cb(fakeResponse);
      return { on: vi.fn() };
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
  });

  test('fetchOperatorCategories returns null on a request error', async () => {
    https.get.mockImplementation(() => ({
      on: (ev, cb) => {
        if (ev === 'error') cb(new Error('network down'));
      },
    }));

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
  });
});
