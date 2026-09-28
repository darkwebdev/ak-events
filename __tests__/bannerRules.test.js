import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  checkBannerFreePulls,
  reportRuleIssues,
  FREE_PULL_RULES,
  RULE_REPORT_PATH,
} from '../src/server/lib/bannerRules.js';

const page = (overrides = {}) => ({
  dailyFreePull: false,
  bannerPermits: null,
  headhuntingDescribed: true,
  ...overrides,
});

describe('checkBannerFreePulls', () => {
  test.each(['festival', 'carnival', 'celebration'])(
    'a %s banner stating 14 daily + a ten-roll permit matches its rule',
    (type) => {
      expect(
        checkBannerFreePulls('E', 'B', type, page({ dailyFreePull: true, bannerPermits: 10 }))
      ).toEqual({ dailyFreePulls: 14, bannerPermits: 10, estimated: false, issues: [] });
    }
  );

  test('a crossover banner may or may not have the permit, but never a daily pull', () => {
    expect(checkBannerFreePulls('E', 'B', 'crossover', page({ bannerPermits: 10 })).issues).toEqual(
      []
    );
    expect(checkBannerFreePulls('E', 'B', 'crossover', page()).issues).toEqual([]);
    const daily = checkBannerFreePulls('E', 'B', 'crossover', page({ dailyFreePull: true }));
    expect(daily.issues).toEqual([expect.objectContaining({ level: 'error' })]);
  });

  test("uses the page's numbers and reports an error when they contradict the rule", () => {
    // Like the 2024/2025 anniversary celebrations: a free 6★ at 300 pulls, no permit.
    const result = checkBannerFreePulls('E', 'B', 'celebration', page({ dailyFreePull: true }));
    expect(result).toMatchObject({ dailyFreePulls: 14, bannerPermits: null, estimated: false });
    expect(result.issues).toEqual([expect.objectContaining({ level: 'error' })]);
  });

  test('a standard banner stating free pulls is an error', () => {
    const result = checkBannerFreePulls('E', 'B', 'special', page({ bannerPermits: 10 }));
    expect(result.issues).toEqual([expect.objectContaining({ level: 'error' })]);
  });

  test("estimates from the rule, silently, when the page doesn't describe the banner yet", () => {
    expect(
      checkBannerFreePulls('E', 'B', 'festival', page({ headhuntingDescribed: false }))
    ).toEqual({ dailyFreePulls: 14, bannerPermits: 10, estimated: true, issues: [] });
  });

  test('estimates from the rule, with a warning, when the page describes the banner but states nothing', () => {
    const result = checkBannerFreePulls('E', 'B', 'festival', page());
    expect(result).toMatchObject({ dailyFreePulls: 14, bannerPermits: 10, estimated: true });
    expect(result.issues).toEqual([expect.objectContaining({ level: 'warning' })]);
  });

  test('nothing to estimate or report for a banner type without free pulls', () => {
    expect(checkBannerFreePulls('E', 'B', 'jo', page())).toEqual({
      dailyFreePulls: null,
      bannerPermits: null,
      estimated: false,
      issues: [],
    });
  });

  test('an unknown banner type is an error, keeping the page numbers', () => {
    const result = checkBannerFreePulls('E', 'B', 'mystery', page({ dailyFreePull: true }));
    expect(result).toMatchObject({ dailyFreePulls: 14, estimated: false });
    expect(result.issues[0]).toMatchObject({ level: 'error' });
    expect(result.issues[0].message).toMatch(/FREE_PULL_RULES/);
  });

  test('covers every banner type the wiki uses', () => {
    expect(Object.keys(FREE_PULL_RULES).sort()).toEqual(
      [
        'carnival',
        'celebration',
        'crossover',
        'crossover rerun',
        'festival',
        'jo',
        'kernel',
        'kernel linkup',
        'kernel locating',
        'limited rerun',
        'linkup',
        'orient',
        'rerun',
        'special',
        'standard',
        'tftw',
      ].sort()
    );
  });
});

describe('reportRuleIssues', () => {
  let dir;
  let cwd;
  beforeEach(() => {
    cwd = process.cwd();
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rules-'));
    process.chdir(dir);
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(dir, { recursive: true, force: true });
    vi.unstubAllEnvs();
  });

  test('writes errors and warnings for the CI check step', () => {
    reportRuleIssues([
      { level: 'error', message: 'bad' },
      { level: 'warning', message: 'hmm' },
    ]);
    expect(JSON.parse(fs.readFileSync(RULE_REPORT_PATH, 'utf8'))).toEqual({
      errors: ['bad'],
      warnings: ['hmm'],
    });
  });

  test('emits GitHub annotations and a summary table in Actions', () => {
    const summary = path.join(dir, 'summary.md');
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    vi.stubEnv('GITHUB_STEP_SUMMARY', summary);

    reportRuleIssues([{ level: 'error', message: 'a | b' }]);

    expect(console.log).toHaveBeenCalledWith('::error::a | b');
    expect(fs.readFileSync(summary, 'utf8')).toContain('| error | a \\| b |');
  });

  test('writes an empty report when everything matches', () => {
    reportRuleIssues([]);
    expect(JSON.parse(fs.readFileSync(RULE_REPORT_PATH, 'utf8'))).toEqual({
      errors: [],
      warnings: [],
    });
  });
});
