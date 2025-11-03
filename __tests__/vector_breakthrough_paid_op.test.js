import fs from 'fs';
import path from 'path';
import { extractOrigPrimeFromHtml, extractHhPermitsFromHtml } from '../src/server/lib/parser.js';

function loadFixture() {
  const p = path.join(__dirname, 'debug_html', 'vector_breakthrough_api_16.html');
  return fs.readFileSync(p, 'utf8');
}

test('Paid-pack OP quantity should be ignored (regression)', () => {
  const html = loadFixture();
  const op = extractOrigPrimeFromHtml(html);
  const hh = extractHhPermitsFromHtml(html);
  // Both should be null because the TD/TR includes a Price: US$9.99 marker (paid pack)
  expect(op).toBeNull();
  expect(hh).toBeNull();
});
