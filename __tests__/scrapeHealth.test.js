import { checkScrapeHealth } from '../src/server/lib/scrapeHealth.js';

const healthy = {
  events: 10,
  previousEvents: 10,
  upcomingBanners: 5,
  yearBanners: 40,
  arkpediaEvents: 15,
  hasActivityTable: true,
  hasStageTable: true,
  bannerTypes: 20,
};

describe('checkScrapeHealth', () => {
  test('a healthy run has no errors or warnings', () => {
    expect(checkScrapeHealth(healthy)).toEqual({ errors: [], warnings: [] });
  });

  test('fails when no events survive', () => {
    expect(checkScrapeHealth({ ...healthy, events: 0 }).errors).toEqual([
      expect.stringMatching(/No events left/),
    ]);
  });

  test('fails when both banner pages come back empty', () => {
    const { errors } = checkScrapeHealth({ ...healthy, upcomingBanners: 0, yearBanners: 0 });
    expect(errors).toEqual([expect.stringMatching(/No banners found/)]);
  });

  test('only warns when just the year page is empty (normal in early January)', () => {
    const { errors, warnings } = checkScrapeHealth({ ...healthy, yearBanners: 0 });
    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringMatching(/current year/)]);
  });

  test("only warns when banner types can't be read (the free-pull rule check is skipped)", () => {
    const { errors, warnings } = checkScrapeHealth({ ...healthy, bannerTypes: 0 });
    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringMatching(/banner types/)]);
  });

  test('only warns on a sharp drop in event count', () => {
    const { errors, warnings } = checkScrapeHealth({ ...healthy, events: 4, previousEvents: 10 });
    expect(errors).toEqual([]);
    expect(warnings).toEqual([expect.stringMatching(/dropped from 10 to 4/)]);
  });

  test('does not compare against a missing previous run', () => {
    expect(checkScrapeHealth({ ...healthy, previousEvents: null }).warnings).toEqual([]);
  });

  test('supplementary sources only warn', () => {
    const { errors, warnings } = checkScrapeHealth({
      ...healthy,
      arkpediaEvents: 0,
      hasActivityTable: false,
      hasStageTable: false,
    });
    expect(errors).toEqual([]);
    expect(warnings).toHaveLength(3);
  });
});
