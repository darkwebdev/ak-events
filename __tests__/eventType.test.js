const { extractEventTypeFromHtml } = require('../src/server/lib/parser');

test('Link only type', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type"><a href="/wiki/Event/Side_Story" title="Event/Side Story">Side Story</a></div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Side Story');
});

test('Link + dash descriptor (en-dash)', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type">\n<a href="/wiki/Event/Side_Story">Side Story</a>–Celebration</div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Side Story (Celebration)');
});

test('Link + dash descriptor (hyphen)', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type">\n<a href="/wiki/Event/Side_Story">Side Story</a>-Celebration</div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Side Story (Celebration)');
});

test('Link + multiple trailing tokens', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type">\n<a href="/wiki/Event/Side_Story">Side Story</a>–Celebration Special</div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Side Story (Celebration Special)');
});

test('Linkless type with non-breaking space', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type druid-data-nonempty">Special&nbsp;event</div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Special event');
});

test('Link + trailing Rerun token', () => {
  const html = '<div class="druid-row druid-row-type"><div class="druid-data druid-data-type">\n<a href="/wiki/Event/Side_Story">Side Story</a> Rerun</div></div>';
  expect(extractEventTypeFromHtml(html)).toBe('Side Story (Rerun)');
});
