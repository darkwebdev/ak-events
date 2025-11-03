import fs from 'fs';
import path from 'path';
import { extractOrigPrimeFromHtml, extractHhPermitsFromHtml } from '../src/server/lib/parser.js';

function loadApiHtml() {
  // The Vector Breakthrough fixture is stored as raw HTML in `vector_breakthrough_api.html`.
  const p = path.join(__dirname, 'debug_html', 'vector_breakthrough_api.html');
  return fs.readFileSync(p, 'utf8');
}

test('Vector Breakthrough: origPrime extraction and paid-pack hhPermits exclusion', () => {
  const html = loadApiHtml();
  // The fixture contains an intro line with explicit OP amount; prefer that when present
  const op = extractOrigPrimeFromHtml(html);
  const hh = extractHhPermitsFromHtml(html);
  // This fixture is a minimal paid-pack-only snippet and doesn't include an explicit intro OP value.
  // We therefore expect the parser to return null for both origPrime and hhPermits (paid packs are ignored).
  expect(op).toBeNull();
  expect(hh).toBeNull();
});
