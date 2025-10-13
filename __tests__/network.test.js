const https = require('https');
const { fetchHtml, fetchWikiApi } = require('../lib/network');
const config = require('../config');

jest.mock('https');

describe('network helpers', () => {
  beforeEach(() => {
    https.get.mockReset();
  });

  test('fetchHtml returns statusCode and body when https returns data', async () => {
    const fakeResponse = {
      statusCode: 200,
      on: jest.fn((ev, cb) => {
        if (ev === 'data') cb('OK');
        if (ev === 'end') cb();
      })
    };
    const mockReq = { on: jest.fn() };
    https.get.mockImplementation((url, options, cb) => { cb(fakeResponse); return mockReq; });
    const res = await fetchHtml('https://example.com/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('OK');
  });

  test('fetchWikiApi constructs URL using config.wikiApiBase', async () => {
    const fakeResponse = {
      statusCode: 200,
      on: jest.fn((ev, cb) => {
        if (ev === 'data') cb(JSON.stringify({ test: true }));
        if (ev === 'end') cb();
      })
    };
    https.get.mockImplementation((url, options, cb) => { 
      // ensure url contains config.wikiApiBase
      expect(url.startsWith(config.wikiApiBase)).toBe(true);
      cb(fakeResponse); 
      return { on: jest.fn() };
    });
    const res = await fetchWikiApi('Some_Page');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ test: true });
  });
});
