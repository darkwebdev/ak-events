import fs from 'fs';
import path from 'path';
import {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractReducedSparkOperator,
} from '../src/server/lib/parser.js';

function loadApiHtml(slug) {
  const p = path.join(__dirname, 'debug_html', `${slug}_api.json`);
  const raw = fs.readFileSync(p, 'utf8');
  const json = JSON.parse(raw);
  return json.parse && json.parse.text && json.parse.text['*'] ? json.parse.text['*'] : '';
}

// test('Celebration Event: extracts OP and hhPermits from API HTML', () => {
//   const html = loadApiHtml('the_masses_travels');
//   expect(extractOrigPrimeFromHtml(html)).toBe(28);
//   expect(extractHhPermitsFromHtml(html)).toBe(3);
// });

test('Act or Die: extracts OP and hhPermits from API HTML', () => {
  const html = loadApiHtml('act_or_die');
  expect(extractOrigPrimeFromHtml(html)).toBe(28);
  expect(extractHhPermitsFromHtml(html)).toBe(3);
});

test('Path of Life: extracts OP and hhPermits from API HTML', () => {
  const html = loadApiHtml('path_of_life');
  expect(extractOrigPrimeFromHtml(html)).toBe(29);
  expect(extractHhPermitsFromHtml(html)).toBe(3);
});

test('Inudi Harek Horakhet: extracts OP and hhPermits from API HTML', () => {
  const html = loadApiHtml('inudi_harek_horakhet');
  expect(extractOrigPrimeFromHtml(html)).toBe(38);
  expect(extractHhPermitsFromHtml(html)).toBe(3);
});

test('Ato: extracts the operator with a reduced 200-contract spark cost from event page HTML', () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'ato_reduced_spark_api.html'),
    'utf8'
  );
  expect(extractReducedSparkOperator(html)).toEqual({ name: "Ch'en the Holungday", cost: 200 });
});

test('extractReducedSparkOperator: returns null when no reduced-cost sentence is present', () => {
  expect(extractReducedSparkOperator('<div><p>Nothing relevant here.</p></div>')).toBeNull();
  expect(extractReducedSparkOperator(null)).toBeNull();
});
