// Sanity checks run at the end of a scrape, before the final events.json is written.
// A source that quietly returns nothing (a layout change, a bot block, a moved page)
// otherwise produces a "successful" run that publishes stale or partial data — which
// is exactly how a wrong banner roster sat on the site for a month unnoticed.
//
// Errors are for the core sources the app can't work without (the event index is
// already checked up front in scrapeEvents): they fail the run, and in CI a failed run
// skips the commit step, so the bad data is never published. Warnings are for the
// supplementary sources that are deliberately "nice to have" — they're surfaced
// loudly but don't block an otherwise-good update.

export interface ScrapeSourceCounts {
  // Events left after scrapeEvents' own dead-weight filter.
  events: number;
  // Events in the previous run's public/data/events.json, or null if there was none.
  previousEvents: number | null;
  upcomingBanners: number;
  yearBanners: number;
  arkpediaEvents: number;
  hasActivityTable: boolean;
  hasStageTable: boolean;
  // Banners whose wiki type was read from the banner pages' wikitext.
  bannerTypes: number;
}

export interface ScrapeHealth {
  errors: string[];
  warnings: string[];
}

// Below this share of the previous run's event count, warn: events do expire, but
// losing most of them in a single day is far more likely a source breaking.
const EVENT_DROP_WARN_RATIO = 0.5;

export function checkScrapeHealth(counts: ScrapeSourceCounts): ScrapeHealth {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (counts.events === 0) {
    errors.push('No events left after filtering — every event source likely failed.');
  }
  if (counts.upcomingBanners + counts.yearBanners === 0) {
    errors.push(
      'No banners found on Headhunting/Banners/Upcoming or the current year page (blocked, moved, or layout changed).'
    );
  } else if (counts.yearBanners === 0) {
    // Legitimately empty for the first days of a new year, before the wiki starts the
    // new year's page — so not an error on its own.
    warnings.push('No banners found on the current year Headhunting/Banners page.');
  }

  if (
    counts.previousEvents != null &&
    counts.events > 0 &&
    counts.events < counts.previousEvents * EVENT_DROP_WARN_RATIO
  ) {
    warnings.push(
      `Event count dropped from ${counts.previousEvents} to ${counts.events} since the last run.`
    );
  }

  if (counts.arkpediaEvents === 0) {
    warnings.push(
      'arkpedia.net returned no upcoming events (predicted dates and permit counts unavailable).'
    );
  }
  if (!counts.hasActivityTable) {
    warnings.push('Could not fetch the game activity table (official event dates unavailable).');
  }
  if (counts.bannerTypes === 0 && counts.upcomingBanners + counts.yearBanners > 0) {
    warnings.push(
      "Could not read banner types from the banner pages' wikitext (free-pull rule checks skipped)."
    );
  }
  if (!counts.hasStageTable) {
    warnings.push('Could not fetch the game stage table (Originite Prime totals unavailable).');
  }

  return { errors, warnings };
}

// Print health results — as GitHub Actions annotations when running there, so they
// show up in the run summary rather than only deep in the log.
export function reportScrapeHealth({ errors, warnings }: ScrapeHealth): void {
  const inActions = process.env.GITHUB_ACTIONS === 'true';
  for (const w of warnings) console.warn(inActions ? `::warning::${w}` : `WARNING: ${w}`);
  for (const e of errors) console.error(inActions ? `::error::${e}` : `ERROR: ${e}`);
}
