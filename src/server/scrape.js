import { parseEventFromHtml } from './lib/parser.js';
import {
  downloadImage,
  fetchEventDetailsViaApi,
  fetchEventsViaApi,
  fetchUpcomingViaApi,
  fetchBannersPageHtml,
  fetchActivityTable,
  fetchStageTable,
  fetchArkpediaEventsHtml,
  fetchArkpediaEventDetailHtml,
} from './lib/network.js';
import { ensureDir, saveJson, fileExists } from './lib/storage.js';
import { applyRerunSuffix } from './lib/wiki.js';
import { parseDateRange } from './lib/dateRange.js';
import { parseBannersPage, indexBannersByDate } from './lib/banners.js';
import {
  normalizeEventName,
  findActivity,
  activityDateStr,
  originitePrimeFromStages,
} from './lib/gameData.js';
import { parseArkpediaEventsList, parseArkpediaEventDetail } from './lib/arkpedia.js';
import {
  loadOperatorCache,
  saveOperatorCache,
  resolveOperatorLimited,
} from './lib/operatorCache.js';
import {
  loadOperatorDebutCache,
  saveOperatorDebutCache,
  resolveOperatorDebutEvent,
} from './lib/operatorDebuts.js';
import { fetchLimitedDebutDates, calcSparkCost } from './lib/sparkCost.js';

// Note: fetchEventsViaApi returns an array of events (or null on error/blocked).

function localFilenameFor(url) {
  const rawFilename = (url || '').split('/').pop() || '';
  return rawFilename.split('?')[0];
}

// Download `url` to `filepath` unless it's already there. Returns whether the file
// exists at `filepath` afterward (true on success or if it was already cached).
async function downloadIfMissing(url, filepath, label, name) {
  if (fileExists(filepath)) return true;
  try {
    await downloadImage(url, filepath);
    console.log(`Downloaded ${label} for`, name);
  } catch (err) {
    console.error(`Error downloading ${label} for`, name, err.message);
  }
  return fileExists(filepath);
}

// Run `fn` over `items` in concurrency-limited batches (rather than one at a time or
// all at once), returning all results in the original order. Used for the operator
// resolution and icon-download stages below; the event-fetch stage further down has
// its own hand-rolled version of this loop because it also needs to persist interim
// progress after each batch, which this generic version intentionally doesn't do.
async function runBatched(items, concurrency, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    // eslint-disable-next-line no-await-in-loop
    results.push(...(await Promise.all(batch.map(fn))));
  }
  return results;
}

export async function scrapeEvents() {
  console.log('Fetching index (prefer API over fetched/index API)...');

  const fetchAndParseEvent = async (event) => {
    // arkpedia's reward-store data is the preferred Headhunting Permit source (see
    // lib/arkpedia.js — verified to match the wiki's own extraction exactly, but
    // structured rather than heuristic), tried before the wiki fetch below so a hit
    // here can skip that fetch entirely.
    if (event.hhPermits == null) {
      try {
        const html = await fetchArkpediaEventDetailHtml(event.name);
        const detail = html ? parseArkpediaEventDetail(html) : null;
        if (detail?.headhuntingPermits != null) {
          event.hhPermits = detail.headhuntingPermits;
          console.log('Found Headhunting Permits (arkpedia) for', event.name, ':', event.hhPermits);
        }
      } catch (e) {
        // ignore; the wiki fetch below is still tried as a fallback
      }
    }

    // Skip fetching the wiki page if we already have both values
    if (event.origPrime != null && event.hhPermits != null) return event;
    if (!event.link) return event;
    // If the link ends with '/Rerun', we should fetch the original event page
    // (without '/Rerun') and then mark the parsed type as a rerun by appending
    // ' (Rerun)'. This ensures types like 'Side Story (Carnival)' become
    // 'Side Story (Carnival) (Rerun)'. Avoid appending twice if type already
    // includes '(Rerun)'.
    const isRerunLink = /\/Rerun$/.test(event.link);
    const fetchUrl = isRerunLink ? event.link.replace(/\/Rerun$/, '') : event.link;
    let jsonStatus = 'err';
    try {
      console.log('Fetching wiki for', event.name, fetchUrl);
      // Only use API parse JSON for event details
      const apiJson = await fetchEventDetailsViaApi(fetchUrl);
      if (apiJson) jsonStatus = 'ok';
      const apiHtml = apiJson?.parse?.text?.['*'] || '';
      const parsed = parseEventFromHtml(apiHtml);

      if (parsed.origPrime != null) {
        event.origPrime = parsed.origPrime;
      }
      if (parsed.hhPermits != null) {
        event.hhPermits = parsed.hhPermits;
      }
      if (parsed.type) {
        event.type = applyRerunSuffix(parsed.type, event.link);
      }

      // If this was a rerun link and we didn't find origPrime or hhPermits on the
      // returned page, try fetching the original event page (without rerun suffix)
      // and merge missing values from that parse. This handles cases where the
      // '/Rerun' or '_Rerun' page lacks store/priming info but the original page
      // contains it.
      try {
        const wiki = (await import('./lib/wiki.js')).default;
        if (wiki.isRerunLink(event.link) && (event.origPrime == null || event.hhPermits == null)) {
          const originalTitle = wiki.titleFromUrl(event.link);
          if (originalTitle) {
            const originalApi = await fetchEventDetailsViaApi(originalTitle);
            const originalHtml = originalApi?.parse?.text?.['*'] || '';
            const parsed2 = parseEventFromHtml(originalHtml);
            if (event.origPrime == null && parsed2.origPrime != null)
              event.origPrime = parsed2.origPrime;
            if (event.hhPermits == null && parsed2.hhPermits != null)
              event.hhPermits = parsed2.hhPermits;
            // If we didn't get a type earlier, use the original type and mark as rerun
            if (!event.type && parsed2.type)
              event.type = applyRerunSuffix(parsed2.type, event.link);
          }
        }
      } catch (e) {
        // ignore any errors in the fallback attempt
      }
    } catch (err) {
      console.error('Error fetching wiki for', event.name, err && err.message);
    }
    console.log(`[${fetchUrl}] json:${jsonStatus}`);
    if (event.origPrime != null)
      console.log('Found Originite Prime for', event.name, ':', event.origPrime);
    if (event.hhPermits != null)
      console.log('Found Headhunting Permits for', event.name, ':', event.hhPermits);
    return event;
  };

  // Fetch the index via the wiki API. fetchEventsViaApi already returns a parsed
  // array of events when successful, or null when blocked/failed.
  const events = (await fetchEventsViaApi()) || [];
  // Also fetch the CN 'Upcoming' page and merge events that aren't already present.
  try {
    const cnUpcoming = await fetchUpcomingViaApi();
    if (Array.isArray(cnUpcoming) && cnUpcoming.length) {
      for (const ce of cnUpcoming) {
        // prefer existing events from main index; match by name
        const exists = events.find((e) => e.name === ce.name);
        if (!exists) {
          // CN upcoming only has CN release date; leave dateStr null so processed row will be TBD
          ce.dateStr = null;
          events.push(ce);
        }
      }
    }
  } catch (e) {
    // ignore
  }
  if (!events || !events.length) {
    // The wiki fetch was blocked, failed, or the page structure changed. Bail out
    // WITHOUT touching public/data/events.json or events_index.json, so a bad/blocked
    // scrape run can never clobber the last known-good data with an empty file.
    console.error(
      'No events found in index (index fetch may have been blocked or page structure changed). Aborting without writing output.'
    );
    process.exit(1);
  }

  // save initial index snapshot to public so the client can fetch /data/events_index.json
  saveJson('public/data/events_index.json', events);
  console.log('Saved index snapshot to public/data/events_index.json');

  // Fetch supplementary sources once per run (not per event). Each resolves to null
  // on failure — these enrich/correct events already found above, never gate finding
  // them, so a failure here just means less enrichment, never an aborted run.
  const [activityTable, stageTable, arkpediaEventsHtml] = await Promise.all([
    fetchActivityTable(),
    fetchStageTable(),
    fetchArkpediaEventsHtml(),
  ]);
  const arkpediaEvents = arkpediaEventsHtml ? parseArkpediaEventsList(arkpediaEventsHtml) : [];

  // Layer in dates + Originite Prime from the most authoritative source available for
  // each event, before the per-event wiki-detail-fetch loop below. Priority: the
  // game's own official data (activityTable — exact, but only covers events already
  // added to the EN client) first, then arkpedia's predicted CN→Global lag estimate
  // (marked as such via datesPredicted) for events not yet on EN, then whatever the
  // wiki index already gave us. This is what lets an event surface with an estimated
  // date well before it's officially confirmed, and self-corrects to the confirmed
  // date automatically once activityTable (or the wiki) catches up on a later run.
  for (const event of events) {
    const activity = findActivity(activityTable, event.name);
    if (activity) {
      const dateStr = activityDateStr(activity);
      if (dateStr) {
        event.globalDateStr = dateStr;
        event.datesPredicted = false;
      }
      if (event.origPrime == null) {
        const op = originitePrimeFromStages(activity.id, stageTable);
        if (op != null) event.origPrime = op;
      }
    } else if (!event.globalDateStr && !event.cnDateStr) {
      const arkEvent = arkpediaEvents.find(
        (e) => normalizeEventName(e.name) === normalizeEventName(event.name)
      );
      if (arkEvent) {
        event.globalDateStr = arkEvent.dateStr;
        event.datesPredicted = arkEvent.isPredicted;
      }
    }
  }

  // Concurrency limiter: process events in batches
  const concurrency = parseInt(process.env.AK_CONCURRENCY || '3');
  for (let i = 0; i < events.length; i += concurrency) {
    const batch = events.slice(i, i + concurrency);
    const results = await Promise.all(batch.map((e) => fetchAndParseEvent(e)));
    for (let j = 0; j < results.length; j++) events[i + j] = results[j];
    // persist progress after each batch to public so the client can access interim results
    saveJson('public/data/events.json', events);
  }

  console.log(
    `Scraped ${events.length} events:`,
    events.map((e) => e.name)
  );

  // Process events
  let processed = events.map((event) => {
    // Parse global dates
    const globalDates = parseDateRange(event.globalDateStr);
    const globalStart = globalDates.start;
    const globalEnd = globalDates.end;

    // Parse CN dates
    const cnDates = parseDateRange(event.cnDateStr);
    const cnStart = cnDates.start;
    const cnEnd = cnDates.end;

    // For backward compatibility, use global dates as primary start/end
    // If no global dates, fall back to CN dates
    const start = globalStart || cnStart;
    const end = globalEnd || cnEnd;

    // Strip common rerun markers from the event name for the final output
    const cleanedName = (event.name || '')
      .replace(/(?:\s*\(Rerun\)|[/\-_\s]+Rerun|\s*:\s*Re-run)/gi, '')
      .trim();

    return {
      name: cleanedName || event.name,
      start,
      end,
      globalStart,
      globalEnd,
      cnStart,
      cnEnd,
      // True when start/end come from arkpedia's CN→Global lag estimate rather than
      // a confirmed source (activityTable or the wiki) — the client should show this
      // distinctly rather than presenting an estimate as an official date.
      datesPredicted: !!event.datesPredicted,
      type: event.type,
      image: event.image,
      link: event.link,
      origPrime: event.origPrime,
      hhPermits: event.hhPermits,
    };
  });

  console.log(`Processed ${processed.length} events`);

  ensureDir('public/data/images');
  ensureDir('public/data/images/operators');
  saveJson('public/data/events.json', processed);
  console.log('Saved all events to public/data/events.json');

  // Fetch the current banner rosters once per run (not per event) and index them by
  // start date, so each event's banner can be matched by "does a banner start on the
  // same day this event does" rather than by fragile prose text on the event page.
  const currentYear = new Date().getFullYear();
  const [upcomingBannersHtml, yearBannersHtml] = await Promise.all([
    fetchBannersPageHtml('Headhunting/Banners/Upcoming'),
    fetchBannersPageHtml(`Headhunting/Banners/${currentYear}`),
  ]);
  const banners = [...parseBannersPage(upcomingBannersHtml), ...parseBannersPage(yearBannersHtml)];
  const { byGlobalStart: bannerByGlobalStart, byCnStart: bannerByCnStart } =
    indexBannersByDate(banners);
  console.log(`Fetched ${banners.length} banner entries for matching`);

  // Match each event to its banner (if any) up front, so the operator-resolution and
  // icon-download work below can be planned across the whole run instead of per event.
  const eventBannerMatches = processed.map((event) => ({
    event,
    matchedBanner:
      (event.globalStart && bannerByGlobalStart[event.globalStart]) ||
      (event.cnStart && bannerByCnStart[event.cnStart]) ||
      null,
  }));
  const matchedOperators = eventBannerMatches
    .filter((m) => m.matchedBanner)
    .flatMap((m) => m.matchedBanner.operators)
    .filter((op) => op.name);

  // Resolve each unique operator's Limited status, batched with the same concurrency
  // limiter used for event fetching above (rather than one await at a time).
  const operatorCache = loadOperatorCache();
  const uniqueOperatorNames = [...new Set(matchedOperators.map((op) => op.name))];
  await runBatched(uniqueOperatorNames, concurrency, (opName) =>
    resolveOperatorLimited(opName, operatorCache)
  );
  saveOperatorCache(operatorCache);
  console.log('Updated public/data/operators.json');

  // Resolve debut events for operators that could actually need a spark cost (5★/6★
  // on a Limited banner) — a rate-up operator is not sparkable on the banner where
  // they debut, only once carried over to a later one, so this is what tells the two
  // apart. Scoped to Limited banners' 5★/6★ operators only, since nothing else ever
  // gets a sparkCost regardless of debut status.
  const operatorDebutCache = loadOperatorDebutCache();
  const sparkRelevantOperatorNames = [
    ...new Set(
      eventBannerMatches
        .filter((m) => m.matchedBanner && m.matchedBanner.type === 'Limited')
        .flatMap((m) => m.matchedBanner.operators)
        .filter((op) => op.name && (op.star === 5 || op.star === 6))
        .map((op) => op.name)
    ),
  ];
  await runBatched(sparkRelevantOperatorNames, concurrency, (opName) =>
    resolveOperatorDebutEvent(opName, operatorDebutCache)
  );
  saveOperatorDebutCache(operatorDebutCache);
  console.log('Updated public/data/operator_debuts.json');

  // Download each unique operator icon (dedup by filename, keeping the operator's
  // name alongside its URL so download logs identify the operator, not the filename).
  const uniqueIcons = [
    ...new Map(
      matchedOperators.filter((op) => op.icon).map((op) => [localFilenameFor(op.icon), op])
    ),
  ].map(([filename, op]) => ({ filename, url: op.icon, name: op.name }));
  await runBatched(uniqueIcons, concurrency, ({ filename, url, name }) =>
    downloadIfMissing(url, `public/data/images/operators/${filename}`, 'operator icon', name)
  );

  // Every Limited 6★ operator's debut date, computed from the game's own gacha pool
  // data rather than scraped from the wiki (which doesn't state it directly) — see
  // lib/sparkCost.js for what this is used for and why. Falls back to an empty map
  // (every operator's sparkCost defaults to 300) if the game-data fetch failed, since
  // this is nice-to-have and shouldn't be able to abort a whole scrape run.
  const limitedDebutDates = (await fetchLimitedDebutDates()) ?? new Map();
  if (limitedDebutDates.size === 0) {
    console.error(
      'Could not fetch operator debut dates from game data — spark costs will default to 300'
    );
  }

  // Now assemble event.banner from the (already-resolved) cache and (already-downloaded) icons.
  for (const { event, matchedBanner } of eventBannerMatches) {
    if (!matchedBanner) {
      event.banner = null;
      continue;
    }
    const sparkEligible = matchedBanner.type === 'Limited';
    const operators = matchedBanner.operators
      .filter((op) => op.name)
      .map((op) => {
        const filename = op.icon ? localFilenameFor(op.icon) : null;
        const icon =
          filename && fileExists(`public/data/images/operators/${filename}`)
            ? `data/images/operators/${filename}`
            : null;
        // Spark (guaranteed pick) cost in Headhunting Data Contracts: 75 for 5★, 300
        // for 6★ unless they're 4+ years past their debut (5+ for a Festival Limited
        // operator), per the wiki's Headhunting Data Contract Store page, in which
        // case it's reduced to 200 — see lib/sparkCost.js. Rate-up and sparkable are
        // different things: an operator debuting on THIS banner's own event is not
        // yet redeemable via the contract store, even though they're shown here as
        // rate-up — only once carried over to a later banner. `event` here is the
        // banner's matched event (from the outer loop), and
        // `operatorDebutCache[op.name]` is that operator's resolved debut info, so a
        // match means this is their first-ever appearance.
        const isDebutingOnThisEvent = operatorDebutCache[op.name]?.event === event.name;
        const limited = operatorCache[op.name] ?? false;
        // Spark redemption is a limited-exclusive perk — a standard/guest operator
        // featured on an otherwise-Limited banner never has a spark cost, regardless
        // of the banner's own sparkEligible flag.
        let sparkCost = null;
        if (limited && sparkEligible && !isDebutingOnThisEvent) {
          if (op.star === 6) {
            sparkCost = calcSparkCost({
              debutDate: limitedDebutDates.get(op.name),
              isFestival: operatorDebutCache[op.name]?.isFestival ?? false,
            });
          } else if (op.star === 5) {
            sparkCost = 75;
          }
        }
        return {
          name: op.name,
          star: op.star,
          class: op.class,
          limited,
          icon,
          sparkCost,
        };
      });
    event.banner = {
      name: matchedBanner.name,
      type: matchedBanner.type,
      sparkEligible,
      operators,
    };
  }

  // Drop events that would be dead weight in the UI: no start date means nothing to
  // schedule around (the client already hides these — see filterUpcomingEvents — but
  // there's no reason to ship them at all), and a *confirmed*-dated event that gives
  // no orundum and has no banner isn't something a user would select or aim their
  // pulls at either. A banner alone is enough to keep an event even at 0 orundum,
  // since users track events specifically to plan pulls toward a banner's operators.
  // A predicted date is kept regardless of orundum/banner — an estimated heads-up is
  // exactly the point of surfacing it this early, before either would even be knowable.
  const eventOrundumValue = (event) => (event.origPrime || 0) * 180 + (event.hhPermits || 0) * 600;
  const beforeFilterCount = processed.length;
  processed = processed.filter(
    (event) => event.start && (event.datesPredicted || eventOrundumValue(event) > 0 || event.banner)
  );
  if (processed.length !== beforeFilterCount) {
    console.log(
      `Filtered out ${
        beforeFilterCount - processed.length
      } event(s) with no start date, no orundum value, and no banner`
    );
  }

  for (const event of processed) {
    if (!event.image) continue;
    // If event.image already looks like a local public URL (from a prior run's saved
    // events.json), derive the disk path directly instead of treating it as a fresh
    // remote wiki URL to download.
    const isAlreadyLocal =
      event.image.startsWith('/data/images/') || event.image.startsWith('data/images/');
    const filename = localFilenameFor(event.image);
    const filepath = `public/data/images/${filename}`;
    if (isAlreadyLocal && fileExists(filepath)) {
      console.log('Image for', event.name, 'already local:', filepath);
      event.image = `data/images/${filename}`;
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    const ok = await downloadIfMissing(event.image, filepath, 'image', event.name);
    event.image = ok ? `data/images/${filename}` : null;
  }

  // Save updated public/data/events.json with public image paths
  saveJson('public/data/events.json', processed);
  console.log('Updated public/data/events.json with public image paths');
}
