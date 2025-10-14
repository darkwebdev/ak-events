const fs = require('fs');
const path = require('path');
const { parseIndexHtml } = require('../src/server/lib/parser');

test('parseIndexHtml on saved Event page HTML returns non-empty event list', () => {
  const htmlPath = path.resolve(__dirname, 'debug_html', 'event_index.html');
  if (!fs.existsSync(htmlPath)) {
    // Skip test if fixture is missing (developer should run scripts/save_event_index.js)
    console.warn('Skipping saved Event page test; fixture not found:', htmlPath);
    return;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  const events = parseIndexHtml(html);
  expect(events.length).toBe(3);

  expect(events[0].name).toBe('The Masses\' Travels');
  expect(events[0].link).toBe('https://arknights.wiki.gg/wiki/The_Masses%27_Travels');
  expect(events[0].image).toBe('/images/thumb/EN_The_Masses%27_Travels_banner.png/1280px-EN_The_Masses%27_Travels_banner.png?58b930');
  expect(events[0].dateStr).toBe('Global: 2025/10/14–2025/11/04 (as the 2025 2nd Celebration event)');
});

test('table-based Event parsing extracts name, link, image and date', () => {
  const html = `
    <table>
      <tr><th>Event</th><th>Release date</th></tr>
      <tr>
        <td style="padding:0;"><div class="banner"><b><a href="/wiki/Test_Event" title="Test Event">Test Event</a></b><a href="/wiki/Test_Event"><img src="/images/test_banner.png" /></a></div></td>
        <td>Global: 2025/10/14–2025/11/04</td>
      </tr>
    </table>
  `;
  const events = parseIndexHtml(html);
  expect(events.length).toBe(1);
  expect(events[0].name).toBe('Test Event');
  expect(events[0].link).toBe('https://arknights.wiki.gg/wiki/Test_Event');
  expect(events[0].image).toBe('/images/test_banner.png');
  expect(events[0].dateStr).toBe('Global: 2025/10/14–2025/11/04');
});
