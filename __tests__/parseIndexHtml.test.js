import fs from 'fs';
import path from 'path';
import { parseIndexHtml } from '../src/server/lib/parser.js';

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

  expect(events[0].name).toBe("The Masses' Travels");
  expect(events[0].link).toBe('https://arknights.wiki.gg/wiki/The_Masses%27_Travels');
  expect(events[0].image).toBe(
    '/images/thumb/EN_The_Masses%27_Travels_banner.png/1280px-EN_The_Masses%27_Travels_banner.png?58b930'
  );
  expect(events[0].dateStr).toBe(
    'Global: 2025/10/14–2025/11/04 (as the 2025 2nd Celebration event)'
  );
});

// Regression test: the wiki changed the events table's column header from
// "Release date" to plain "Date" at some point, which silently broke the table
// detection heuristic (it required the literal phrase "release date" somewhere in
// the table) — every scrape from then on returned zero events for the live "Event"
// page. This fixture is a real, current capture of that table.
test('parseIndexHtml handles the current "Event"/"Date" header wording (not just "Release date")', () => {
  const htmlPath = path.resolve(__dirname, 'debug_html', 'event_index_2026.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const events = parseIndexHtml(html);

  expect(events.length).toBe(4);
  expect(events.map((e) => e.name)).toContain('Critical Phase Transition');
  expect(events[0].link).toBe('https://arknights.wiki.gg/wiki/Stronghold_Protocol_Alliance_Part_2');
});

test('does not mistake the "Commemorates"/seasonal-events tables for the events table', () => {
  const html = `
    <table>
      <tr><th>Commemorates</th><th>CN event</th><th>Global event</th></tr>
      <tr><td>Summer</td><td>Some CN Event</td><td>Some Global Event</td></tr>
    </table>
  `;
  expect(parseIndexHtml(html)).toEqual([]);
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
