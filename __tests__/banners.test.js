import fs from 'fs';
import path from 'path';
import {
  parseBannersPage,
  indexBannersByDate,
  dedupeBannersByName,
} from '../src/server/lib/banners.js';

function loadFixture(name) {
  return fs.readFileSync(path.join(__dirname, 'debug_html', name), 'utf8');
}

describe('parseBannersPage', () => {
  let banners;

  beforeAll(() => {
    // Real (trimmed) HTML captured from arknights.wiki.gg/wiki/Headhunting/Banners/2026.
    banners = parseBannersPage(loadFixture('headhunting_banners_2026.html'));
  });

  test('returns an empty array for empty/missing input', () => {
    expect(parseBannersPage(null)).toEqual([]);
    expect(parseBannersPage('')).toEqual([]);
  });

  test('parses every banner row in the fixture', () => {
    expect(banners.length).toBe(7);
  });

  test('classifies each banner under the correct section type', () => {
    const byName = Object.fromEntries(banners.map((b) => [b.name, b.type]));
    expect(byName['Ashes to Ashes, Ages on Ages']).toBe('Limited');
    expect(byName['Hanabi Exiled']).toBe('Limited');
    expect(byName['Celebration & Hope']).toBe('Special');
    expect(byName['Joint Operation #21']).toBe('Standard');
    expect(byName['Kernel #59 (Global)']).toBe('Kernel');
  });

  test('strips the leading [Tag] prefix from the banner name', () => {
    const names = banners.map((b) => b.name);
    expect(names).toContain('Ashes to Ashes, Ages on Ages');
    expect(names.some((n) => n.startsWith('['))).toBe(false);
  });

  test('parses both CN and Global date ranges for a Limited banner', () => {
    const banner = banners.find((b) => b.name === 'Ashes to Ashes, Ages on Ages');
    expect(banner.cnStart).toBe('2026-02-10');
    expect(banner.cnEnd).toBe('2026-02-24');
    expect(banner.globalStart).toBe('2026-07-16');
    expect(banner.globalEnd).toBe('2026-07-30');
  });

  test('leaves dates null for a dateless rotating-pool banner (e.g. Kernel)', () => {
    const banner = banners.find((b) => b.name === 'Kernel #59 (Global)');
    expect(banner.cnStart).toBeNull();
    expect(banner.globalStart).toBeNull();
  });

  test('extracts operator name/star/class/icon from each banner row', () => {
    const banner = banners.find((b) => b.name === 'Cantilena Puppae');
    expect(banner.operators.length).toBe(3);
    const togawa = banner.operators.find((o) => o.name === 'Togawa Sakiko');
    expect(togawa).toMatchObject({ star: 6, class: 'Guard' });
    expect(togawa.icon).toContain('Togawa_Sakiko_icon.png');
  });

  // Regression test: the Global date segment used to be sliced to the end of the
  // cell's text with no upper bound, so any trailing date-like content the wiki ever
  // added after it (a footnote, another locale's date) could get picked up by
  // parseDateRange's first-two-matches scan as a phantom globalEnd.
  test('does not pick up an unrelated date well beyond the Global date value as globalEnd', () => {
    const html = `
      <div class="mw-content-ltr mw-parser-output">
        <h2><span class="mw-headline" id="Limited_Headhunting">Limited Headhunting</span></h2>
        <table>
          <tbody>
            <tr>
              <td><div class="banner"><b>[Test] Bounded Banner</b></div>
                <div>Global date: 2026/07/16 ${'x'.repeat(80)} 2099/01/01</div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const [banner] = parseBannersPage(html);

    expect(banner.globalStart).toBe('2026-07-16');
    expect(banner.globalEnd).not.toBe('2099-01-01');
  });
});

describe('parseBannersPage on Headhunting/Banners/Upcoming', () => {
  let banners;

  beforeAll(() => {
    // Real capture: unlike the year-archive pages, Upcoming has no Limited/Standard/
    // Kernel/Special h2 sections at all — every banner sits under one flat "List"
    // heading, so type must come from the banner's own [tag] prefix instead.
    banners = parseBannersPage(loadFixture('headhunting_banners_upcoming.html'));
  });

  test('parses every banner row in the fixture', () => {
    expect(banners.length).toBe(11);
  });

  // Regression test: typeForElement (section-heading lookup) returns null for every
  // banner on this page since there are no type sections to find, which meant every
  // Upcoming-page banner silently got type: null and sparkEligible: false — including
  // genuine Limited banners with Limited operators on them.
  test('resolves type from the [tag] prefix rather than a (nonexistent) section heading', () => {
    const byName = Object.fromEntries(banners.map((b) => [b.name, b.type]));
    expect(byName['Sealed With Time']).toBe('Limited');
    expect(byName['Hunters of the Umbral Wilds']).toBe('Limited');
    expect(byName['Returned From A Pyre Rerun']).toBe('Standard');
    expect(byName['Orienteering #7']).toBe('Standard');
  });

  test('still strips the [tag] prefix from the displayed name', () => {
    const names = banners.map((b) => b.name);
    expect(names).toContain('Sealed With Time');
    expect(names.some((n) => n.startsWith('['))).toBe(false);
  });
});

describe('dedupeBannersByName', () => {
  test('keeps only the last banner for a repeated name', () => {
    const older = { name: 'Same Banner', type: 'Limited', globalStart: '2026-06-01' };
    const newer = {
      name: 'Same Banner',
      type: 'Limited',
      globalStart: '2026-06-01',
      operators: [1],
    };

    const deduped = dedupeBannersByName([older, newer]);

    expect(deduped).toEqual([newer]);
  });

  test('leaves distinctly-named banners untouched', () => {
    const a = { name: 'A' };
    const b = { name: 'B' };

    expect(dedupeBannersByName([a, b])).toEqual([a, b]);
  });
});

describe('indexBannersByDate', () => {
  test('indexes banners by both their global and CN start dates', () => {
    const banners = [
      { name: 'A', type: 'Limited', globalStart: '2026-06-01', cnStart: '2026-01-01' },
    ];

    const { byGlobalStart, byCnStart } = indexBannersByDate(banners);

    expect(byGlobalStart['2026-06-01'].name).toBe('A');
    expect(byCnStart['2026-01-01'].name).toBe('A');
  });

  test('skips banners with no start date on that axis', () => {
    const banners = [{ name: 'A', type: 'Kernel', globalStart: null, cnStart: null }];

    const { byGlobalStart, byCnStart } = indexBannersByDate(banners);

    expect(byGlobalStart).toEqual({});
    expect(byCnStart).toEqual({});
  });

  // Regression test: the same real banner is commonly parsed twice — once from
  // Headhunting/Banners/Upcoming and once from Headhunting/Banners/{year} — during the
  // editorial-lag window where it's listed on both. Previously these two parses (same
  // name, different object instances) were treated as a genuine date collision,
  // producing a spurious warning and arbitrarily keeping whichever page happened to be
  // concatenated first rather than the more complete/authoritative one.
  test('merges the same-named banner parsed from two source pages without warning', () => {
    const fromUpcoming = { name: 'Same Banner', type: 'Limited', globalStart: '2026-06-01' };
    const fromYearArchive = {
      name: 'Same Banner',
      type: 'Limited',
      globalStart: '2026-06-01',
      operators: [{ name: 'Fully Resolved Operator' }],
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { byGlobalStart } = indexBannersByDate([fromUpcoming, fromYearArchive]);

    expect(byGlobalStart['2026-06-01']).toBe(fromYearArchive);
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  // Regression test: previously the first banner encountered for a given start date
  // silently won, with no indication a second banner on the same date was dropped —
  // meaning a real dual-Limited-banner drop would silently lose one banner's data.
  test('prefers a Limited banner over a non-Limited one sharing the same start date', () => {
    const banners = [
      { name: 'Standard Pool #1', type: 'Standard', globalStart: '2026-06-01', cnStart: null },
      { name: 'Real Limited Banner', type: 'Limited', globalStart: '2026-06-01', cnStart: null },
    ];
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { byGlobalStart } = indexBannersByDate(banners);

    expect(byGlobalStart['2026-06-01'].name).toBe('Real Limited Banner');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Real Limited Banner'));

    warnSpy.mockRestore();
  });

  test('keeps the first Limited banner and warns when two Limited banners share a date', () => {
    const banners = [
      { name: 'First Limited', type: 'Limited', globalStart: '2026-06-01', cnStart: null },
      { name: 'Second Limited', type: 'Limited', globalStart: '2026-06-01', cnStart: null },
    ];
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { byGlobalStart } = indexBannersByDate(banners);

    expect(byGlobalStart['2026-06-01'].name).toBe('First Limited');
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
