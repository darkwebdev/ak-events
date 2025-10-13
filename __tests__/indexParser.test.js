const fs = require('fs');
const path = require('path');
const { parseIndexHtml } = require('../lib/network');

describe('parseIndexHtml', () => {
  test('parses a simple index fixture into events', () => {
  const html = fs.readFileSync(path.join(__dirname, 'debug_html', 'index_fixture.html'), 'utf8');
    const events = parseIndexHtml(html);
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThanOrEqual(1);
    const sample = events.find(e => e.name.includes('Sample'));
    expect(sample).toBeDefined();
    expect(sample.link).toMatch(/arknights.wiki.gg/);
    expect(sample.dateStr).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});
