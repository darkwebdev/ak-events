import fs from 'fs';
import path from 'path';
import {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractReducedSparkOperators,
  extractOperatorDebutEvent,
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
  expect(extractReducedSparkOperators(html)).toEqual([{ name: "Ch'en the Holungday", cost: 200 }]);
});

test('extractReducedSparkOperators: collects every reduced-cost sentence on the page, not just the first', () => {
  const html = `<div>
    <p>The amount of Headhunting Data Contracts needed to buy Ch'en the Holungday in the
    Headhunting Data Contract Store is reduced to 200.</p>
    <p>The amount of Headhunting Data Contracts needed to buy Eyjafjalla in the
    Headhunting Data Contract Store is reduced to 200.</p>
  </div>`;
  expect(extractReducedSparkOperators(html)).toEqual([
    { name: "Ch'en the Holungday", cost: 200 },
    { name: 'Eyjafjalla', cost: 200 },
  ]);
});

test('extractReducedSparkOperators: returns an empty array when no reduced-cost sentence is present', () => {
  expect(extractReducedSparkOperators('<div><p>Nothing relevant here.</p></div>')).toEqual([]);
  expect(extractReducedSparkOperators(null)).toEqual([]);
});

test("Kal'tsit - Esperanta: debuts on the event whose changelog says Introduced", () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'kaltsit_esperanta_debut_api.html'),
    'utf8'
  );
  expect(extractOperatorDebutEvent(html)).toEqual({
    event: 'Critical Phase Transition',
    introduced: true,
  });
});

test('Exusiai the New Covenant: debut event is her real first release, not a later rate-up-pool entry', () => {
  const html = fs.readFileSync(
    path.join(__dirname, 'debug_html', 'exusiai_new_covenant_debut_api.html'),
    'utf8'
  );
  expect(extractOperatorDebutEvent(html)).toEqual({
    event: "The Masses' Travels",
    introduced: true,
  });
});

test('extractOperatorDebutEvent: returns null when there is no Changelog section', () => {
  expect(extractOperatorDebutEvent('<div><p>Nothing relevant here.</p></div>')).toBeNull();
  expect(extractOperatorDebutEvent(null)).toBeNull();
});
