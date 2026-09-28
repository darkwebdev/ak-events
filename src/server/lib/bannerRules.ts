import fs from 'fs';

// Free pulls each kind of headhunting banner gives out, keyed by the wiki's own banner
// `type` (the `|type =` field of each {{Banners cell}} on the Headhunting/Banners
// pages). These were checked against every Limited banner on the wiki, 2020–2026:
//
// - festival, carnival, celebration: a free pull every day of the 14-day banner, plus
//   a banner-only ten-roll permit claimable once — 24 pulls. Exceptions, all
//   historical: Earthborn Metals (2020 festival) mailed a ten-roll instead; 1st
//   Anniversary's Cremation Last Wish (2020) named its permit differently; and the 2024
//   and 2025 anniversary celebrations (Our Kind, Freedom of Preach) gave a free 6★ at
//   300 pulls instead of the permit.
// - crossover: never a daily pull; a ten-roll permit for some collaborations (Rainbow
//   Six, Monster Hunter), none for others (Terran Food, Cantilena Puppae), so both are
//   accepted.
// - everything else (standard, special, joint operation, kernel, reruns…): nothing.
//
// scrape.ts checks each event's own page against these every run (see
// checkBannerFreePulls), so a change in what the game gives — or in how the wiki
// words it — is flagged for a human instead of silently producing wrong numbers.

export interface FreePullRule {
  // Allowed values; the first is the estimate used when the event page doesn't
  // describe its banner yet.
  dailyFreePulls: number[];
  bannerPermits: number[];
}

const LIMITED_24: FreePullRule = { dailyFreePulls: [14], bannerPermits: [10] };
const NONE: FreePullRule = { dailyFreePulls: [0], bannerPermits: [0] };

export const FREE_PULL_RULES: Record<string, FreePullRule> = {
  festival: LIMITED_24,
  carnival: LIMITED_24,
  celebration: LIMITED_24,
  crossover: { dailyFreePulls: [0], bannerPermits: [0, 10] },
  'crossover rerun': NONE,
  'limited rerun': NONE,
  rerun: NONE,
  standard: NONE,
  special: NONE,
  jo: NONE,
  orient: NONE,
  tftw: NONE,
  linkup: NONE,
  kernel: NONE,
  'kernel locating': NONE,
  'kernel linkup': NONE,
};

export interface BannerPerksOnPage {
  // What the event's own wiki page states (see extractBannerFreePulls).
  dailyFreePull: boolean;
  bannerPermits: number | null;
  // Whether the page's Headhunting section describes a featured banner at all — if
  // not, the page just hasn't been written yet, and silence isn't evidence.
  headhuntingDescribed: boolean;
}

export interface RuleIssue {
  level: 'error' | 'warning';
  message: string;
}

export interface FreePullResult {
  dailyFreePulls: number | null;
  bannerPermits: number | null;
  // True when the numbers come from the rule rather than the event's own page.
  estimated: boolean;
  issues: RuleIssue[];
}

const describe = (daily: number, permits: number) => `${daily} daily + ${permits} permit`;
const orNull = (n: number) => (n > 0 ? n : null);

// Reconcile what an event's page says about its banner's free pulls with the rule for
// that banner's type. The page wins whenever it states anything (it's the more
// current source); the rule fills in when the page hasn't been written yet.
export function checkBannerFreePulls(
  eventName: string,
  bannerName: string,
  bannerType: string | null,
  page: BannerPerksOnPage
): FreePullResult {
  const pageDaily = page.dailyFreePull ? 14 : 0;
  const pagePermits = page.bannerPermits ?? 0;
  const pageResult = {
    dailyFreePulls: orNull(pageDaily),
    bannerPermits: orNull(pagePermits),
    estimated: false,
  };
  const where = `${eventName} (banner "${bannerName}", type ${bannerType ?? 'unknown'})`;

  const rule = bannerType ? FREE_PULL_RULES[bannerType] : undefined;
  if (!rule) {
    return {
      ...pageResult,
      issues: [
        {
          level: 'error',
          message: `${where}: no free-pull rule for this banner type — add one to FREE_PULL_RULES in src/server/lib/bannerRules.ts. The page states ${describe(
            pageDaily,
            pagePermits
          )}.`,
        },
      ],
    };
  }

  const expected = describe(rule.dailyFreePulls[0], rule.bannerPermits[0]);
  const statesPerks = page.dailyFreePull || page.bannerPermits != null;
  if (statesPerks) {
    const matches =
      rule.dailyFreePulls.includes(pageDaily) && rule.bannerPermits.includes(pagePermits);
    return {
      ...pageResult,
      issues: matches
        ? []
        : [
            {
              level: 'error',
              message: `${where}: the wiki page states ${describe(
                pageDaily,
                pagePermits
              )}, but the rule expects ${expected}. Using the page's numbers — check whether the game changed and update FREE_PULL_RULES.`,
            },
          ],
    };
  }

  const expectsPerks = rule.dailyFreePulls[0] > 0 || rule.bannerPermits[0] > 0;
  if (!expectsPerks) return { ...pageResult, issues: [] };

  const estimate = {
    dailyFreePulls: orNull(rule.dailyFreePulls[0]),
    bannerPermits: orNull(rule.bannerPermits[0]),
    estimated: true,
  };
  return {
    ...estimate,
    issues: page.headhuntingDescribed
      ? [
          {
            level: 'warning',
            message: `${where}: the wiki page describes the banner but states no free pulls, while the rule expects ${expected}. Using the rule's estimate — check whether the game dropped them or the wiki reworded them.`,
          },
        ]
      : [],
  };
}

// Where the rule check's result is written for CI's final "Check free-pull rules" step
// (see .github/workflows/scrape.yml), which fails the run on any error — after the
// data has been committed, so a rule problem flags the run for review without holding
// back the daily update.
export const RULE_REPORT_PATH = 'scrape-rule-check.json';

// Print rule issues — as GitHub Actions annotations when running there, plus a table
// on the run's summary page — and write them to RULE_REPORT_PATH.
export function reportRuleIssues(issues: RuleIssue[]): void {
  const inActions = process.env.GITHUB_ACTIONS === 'true';
  for (const { level, message } of issues) {
    if (inActions) console.log(`::${level}::${message}`);
    else console.warn(`${level.toUpperCase()}: ${message}`);
  }
  if (!issues.length) console.log('Free-pull rules: every event matches its banner type.');

  const errors = issues.filter((i) => i.level === 'error').map((i) => i.message);
  const warnings = issues.filter((i) => i.level === 'warning').map((i) => i.message);
  fs.writeFileSync(RULE_REPORT_PATH, JSON.stringify({ errors, warnings }, null, 2));

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath && issues.length) {
    const rows = issues.map(
      ({ level, message }) => `| ${level} | ${message.replace(/\|/g, '\\|')} |`
    );
    fs.appendFileSync(
      summaryPath,
      ['## Free-pull rule check', '', '| Level | Issue |', '| --- | --- |', ...rows, ''].join('\n')
    );
  }
}
