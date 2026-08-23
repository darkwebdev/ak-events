import fs from 'fs';
import path from 'path';
import {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractObtainMethod,
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

// Matches the real markup shape of an operator page's infobox "How to obtain" row,
// as actually returned by the wiki API (verified against Ling's live page, which
// reads "Limited Headhunting - Festival").
test('extractObtainMethod: reads the "How to obtain" infobox value', () => {
  const html = `<table><tbody><tr style="vertical-align:middle; font-size:12px;">
    <td><b>How to obtain</b>
    </td>
    <td><div><span class="" title="" style="display:inline-block; position:relative; margin:2px 0; padding:0 5px; border-radius:5px; width:auto; background:#FF0000; color:#FFF; font-size:; text-align:center;">Limited Headhunting - Festival</span></div><div></div><div></div>
    </td></tr></tbody></table>`;
  expect(extractObtainMethod(html)).toBe('Limited Headhunting - Festival');
});

test('extractObtainMethod: returns null when the page has no "How to obtain" row', () => {
  expect(extractObtainMethod('<div><p>Nothing relevant here.</p></div>')).toBeNull();
  expect(extractObtainMethod(null)).toBeNull();
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
