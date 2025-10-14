const https = require('https');
const { fetchWikiApi } = require('../src/server/lib/network');
const config = require('./../src/server/config');

jest.mock('https');

describe('network helpers', () => {
  beforeEach(() => {
    https.get.mockReset();
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
