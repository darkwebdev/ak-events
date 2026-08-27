import fs from 'fs';
import path from 'path';
import { parseEventFromHtml } from '../src/server/lib/parser.js';

test("The Masses' Travels extracts origPrime, hhPermits, and intCerts", () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'masses_travels_api.html'),
    'utf8'
  );
  const res = parseEventFromHtml(html);
  expect(res.origPrime).toBe(41);
  expect(res.hhPermits).toBe(3);
  // Sums every mission's Intelligence Certificate quantity (75 + 115) — the maximum
  // a player could get from this rerun if they already own every substitutable
  // reward. See extractIntCertsFromHtml's own comment for why this is a ceiling.
  expect(res.intCerts).toBe(190);
});
