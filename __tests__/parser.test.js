import fs from 'fs';
import path from 'path';
import {
  extractOrigPrimeFromHtml,
  extractHhPermitsFromHtml,
  extractBannerFreePulls,
  extractSparkDiscounts,
  extractIntCertsFromHtml,
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
  // A regular (non-rerun) event page never mentions Intelligence Certificates —
  // that substitution mechanic only exists on rerun pages.
  expect(extractIntCertsFromHtml(html)).toBeNull();
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

describe('extractHhPermitsFromHtml never guesses', () => {
  // Critical Phase Transition: the only permits on the page are in paid packs. The old
  // number-scanning fallback returned 39 — the "&#39;" (an escaped apostrophe) in a
  // paid permit's tooltip text, "Rhodes Island's expansion…".
  test('returns null when the only permits are in paid packs', () => {
    const html = `<h2>Store</h2><table><tr><th>Pack</th><th>Content</th><th>Price</th></tr>
      <tr><td>Kernel Headhunting Pack</td>
        <td><span class="item-tooltip" data-name="Ten-roll Kernel Headhunting Permit"
          data-desc="Rhodes Island&#39;s expansion is inseparable from…"></span>
          <span class="quantity">1</span></td>
        <td>Price: US$9.99</td></tr></table>`;
    expect(extractHhPermitsFromHtml(html)).toBeNull();
  });

  // Thunder in the Azure Dream: the old fallback returned 120 from a banner rule.
  test('ignores numbers in banner rules near the words "Headhunting Permit"', () => {
    const html = `<ul><li>A single <b>Song of the Bow, Leap to the Sky Headhunting Permit</b>
      can be claimed (one time only) while the banner is up.</li>
      <li>Some rules of this crossover banner are changed:<ul>
      <li>The 120 pulls to guarantee the limited 6★ Operator is <i>repeatable</i>.</li>
      </ul></li></ul>`;
    expect(extractHhPermitsFromHtml(html)).toBeNull();
  });
});

describe('extractBannerFreePulls', () => {
  // Wording as on the wiki's Till the Lands Become an Orange page (Headhunting section).
  const carnival = `<ul><li>The sixth Limited Headhunting - Carnival banner,
    <b>Trails End Winds Rest</b>, is featured.<ul>
    <li>A single <b>The Hitchers Headhunting Permit</b> can be claimed while
      <i>Trails End Winds Rest</i> is up.</li>
    <li>Angelina the Mellow Wish can be claimed for free after the player pulled 300
      times in <i>Trails End Winds Rest</i>.</li>
    <li>Every day, the player can perform one headhunting pull for free in
      <i>Trails End Winds Rest</i>. These free pulls do not transfer over to the next
      day, so they must be used before the daily reset.</li></ul></li></ul>`;

  test('finds the daily free pull and the claimable banner permit, a ten-roll', () => {
    expect(extractBannerFreePulls(carnival)).toEqual({
      dailyFreePull: true,
      bannerPermits: 10,
      headhuntingDescribed: true,
      bannerKind: 'carnival',
    });
  });

  // Celebration banners like Our Kind give a free operator at 300 pulls instead.
  test('a Celebration banner with only the daily pull has no banner permit', () => {
    const html = `<ul><li>The ninth Limited Headhunting - Celebration banner, <b>Our Kind</b>,
      is featured.<ul><li>Wiš'adel can be claimed for free after the player had pulled 300
      times in <i>Our Kind</i>.</li><li>Every day, the player can perform one headhunting
      pull for free in <i>Our Kind</i>.</li></ul></li></ul>`;
    expect(extractBannerFreePulls(html)).toMatchObject({
      dailyFreePull: true,
      bannerPermits: null,
      bannerKind: 'celebration',
    });
  });

  // Crossover banners (e.g. Thunder in the Azure Dream) have the permit but no daily pull.
  test('a crossover banner with only the claimable permit', () => {
    const html = `<ul><li>A single <b>Song of the Bow, Leap to the Sky Headhunting Permit</b>
      can be claimed (one time only) while the Hunters of the Umbral Wilds banner is up.</li></ul>`;
    expect(extractBannerFreePulls(html)).toMatchObject({ dailyFreePull: false, bannerPermits: 10 });
  });

  test('does not count the free operator after 300 pulls', () => {
    const html = carnival.replace(/<li>A single[\s\S]*?<\/li>/, '');
    expect(extractBannerFreePulls(html).bannerPermits).toBeNull();
  });

  test('reports nothing for a page without banner perks', () => {
    expect(extractBannerFreePulls('<p>An ordinary side story.</p>')).toEqual({
      dailyFreePull: false,
      bannerPermits: null,
      headhuntingDescribed: false,
      bannerKind: null,
    });
  });

  test('names a crossover banner by its wording', () => {
    const html = `<p>The <b>Hunters of the Umbral Wilds</b> limited crossover headhunting banner
      is featured.</p>`;
    expect(extractBannerFreePulls(html)).toMatchObject({
      headhuntingDescribed: true,
      bannerKind: 'crossover',
    });
  });
});

describe('extractSparkDiscounts', () => {
  // Wording as on the wiki's Limited event pages (e.g. Critical Phase Transition, Ato).
  test('finds the operator a banner discounts in its contract store', () => {
    const html = `<ul><li>The amount of <a href="/wiki/Headhunting_Data_Contract">Headhunting
      Data Contracts</a> needed to buy <a href="/wiki/Specter">Specter the Unchained</a> in the
      Headhunting Data Contract Store is reduced to 200.</li></ul>`;
    expect(extractSparkDiscounts(html)).toEqual([{ name: 'Specter the Unchained', cost: 200 }]);
  });

  test('decodes an escaped apostrophe in the name', () => {
    const html = `<p>The amount of Headhunting Data Contracts needed to buy Ch&#39;en the
      Holungday in the Headhunting Data Contract Store is reduced to 200.</p>`;
    expect(extractSparkDiscounts(html)).toEqual([{ name: "Ch'en the Holungday", cost: 200 }]);
  });

  test('returns nothing for a page without a discount', () => {
    expect(extractSparkDiscounts('<p>A side story.</p>')).toEqual([]);
  });
});
