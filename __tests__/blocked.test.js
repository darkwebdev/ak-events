const { isBlockedHtml } = require('../src/server/lib/network');

describe('isBlockedHtml', () => {
  test('detects cloudflare challenge text', () => {
    const html = '<html><body>Attention Required! | Cloudflare</body></html>';
    expect(isBlockedHtml(html)).toBe(true);
  });
  test('detects meta refresh', () => {
    const html = '<html><head><meta http-equiv="refresh" content="0;url=/challenge"></head></html>';
    expect(isBlockedHtml(html)).toBe(true);
  });
  test('returns false for normal content', () => {
    const html = '<html><body>Welcome to the event page</body></html>';
    expect(isBlockedHtml(html)).toBe(false);
  });
});
