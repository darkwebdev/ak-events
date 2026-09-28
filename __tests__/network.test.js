import https from 'https';
import { fetchWikiApi, fetchOperatorCategories } from '../src/server/lib/network.js';
import { wikiApiBase } from '../src/server/config.js';

vi.mock('https');

// A stand-in for http.ClientRequest: every request gets an inactivity timeout, so the
// mock needs setTimeout/destroy as well as on().
function fakeRequest() {
  const req = { on: vi.fn(() => req), setTimeout: vi.fn(), destroy: vi.fn() };
  return req;
}

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
      return fakeRequest();
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
      return fakeRequest();
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toEqual(['Operator', '6-star']);
  });

  // Regression test: a non-200 response must resolve null, not [], so a transient
  // failure is never mistaken for "this operator genuinely has no categories".
  test('fetchOperatorCategories returns null (not []) on a non-200 response', async () => {
    const fakeResponse = {
      statusCode: 429,
      resume: vi.fn(),
      on: vi.fn((ev, cb) => {
        if (ev === 'data') cb('rate limited');
        if (ev === 'end') cb();
      }),
    };
    https.get.mockImplementation((url, options, cb) => {
      cb(fakeResponse);
      return fakeRequest();
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
    // The unread body must be drained, or its socket keeps the scrape process alive.
    expect(fakeResponse.resume).toHaveBeenCalled();
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
      return fakeRequest();
    });

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
  });

  test('fetchOperatorCategories returns null on a request error', async () => {
    https.get.mockImplementation(() => ({
      ...fakeRequest(),
      on: (ev, cb) => {
        if (ev === 'error') cb(new Error('network down'));
      },
    }));

    const categories = await fetchOperatorCategories('Pepe');

    expect(categories).toBeNull();
  });

  test('a request that stalls is destroyed after the timeout, and resolves null instead of hanging', async () => {
    let onTimeout;
    let onError;
    const req = {
      on: vi.fn((ev, cb) => {
        if (ev === 'error') onError = cb;
        return req;
      }),
      setTimeout: vi.fn((ms, cb) => {
        onTimeout = cb;
      }),
      // What a real request does on destroy(err): emit 'error' with that err.
      destroy: vi.fn((err) => onError(err)),
    };
    // Never calls the response callback — the server never answers.
    https.get.mockImplementation(() => req);

    const pending = fetchOperatorCategories('Pepe');
    expect(req.setTimeout).toHaveBeenCalledWith(expect.any(Number), expect.any(Function));
    onTimeout();

    await expect(pending).resolves.toBeNull();
    expect(req.destroy).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/Timed out/) })
    );
  });
});
