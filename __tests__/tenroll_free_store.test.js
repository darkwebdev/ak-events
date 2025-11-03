import fs from 'fs';
import path from 'path';
import { parseEventFromHtml } from '../src/server/lib/parser.js';

test('Ten-roll in free store counts as 10x (2 -> 20)', () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'tenroll_free_store_api.html'),
    'utf8'
  );
  const ev = parseEventFromHtml(html);
  expect(ev.hhPermits).toBe(20);
});
