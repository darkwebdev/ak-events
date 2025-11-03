import fs from 'fs';
import path from 'path';
import { parseEventFromHtml } from '../src/server/lib/parser.js';

test("The Masses' Travels extracts origPrime and hhPermits", () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'masses_travels_api.html'),
    'utf8'
  );
  const res = parseEventFromHtml(html);
  expect(res.origPrime).toBe(41);
  expect(res.hhPermits).toBe(3);
});
