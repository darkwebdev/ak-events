import fs from 'fs';
import path from 'path';
import { parseEventFromHtml } from '../src/server/lib/parser.js';

describe('Vector Breakthrough hhPermits extraction', () => {
  test('paid store entries are ignored (no hhPermits from paid packs)', () => {
    const p = path.join(__dirname, 'debug_html', 'vector_breakthrough_api.html');
    const html = fs.readFileSync(p, 'utf8');
    const res = parseEventFromHtml(html);
    // we expect hhPermits to be null because the only Headhunting Permit appearances are inside a paid 'Price' table
    expect(res.hhPermits).toBeNull();
  });
});
