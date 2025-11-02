import { parseEventFromHtml } from './lib/parser.js';
import {
  downloadImage,
  fetchEventDetailsViaApi,
  fetchEventsViaApi,
  fetchUpcomingViaApi,
} from './lib/network.js';
import { ensureDir, saveJson, fileExists } from './lib/storage.js';
import { applyRerunSuffix } from './lib/wiki.js';

// Note: fetchEventsViaApi returns an array of events (or null on error/blocked).

async function scrapeEvents() {
  console.log('Fetching index (prefer API over fetched/index API)...');

  const fetchAndParseEvent = async (event) => {
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
    console.log(
      'No events found in index (index fetch may have been blocked or page structure changed).'
    );
  }

  // save initial index snapshot to public so the client can fetch /data/events_index.json
  saveJson('public/data/events_index.json', events);
  console.log('Saved index snapshot to public/data/events_index.json');

  // Concurrency limiter: process events in batches
  const concurrency = parseInt(process.env.AK_CONCURRENCY || '3');
  for (let i = 0; i < events.length; i += concurrency) {
    const batch = events.slice(i, i + concurrency);
    const results = await Promise.all(batch.map((e) => fetchAndParseEvent(e)));
    for (let j = 0; j < results.length; j++) events[i + j] = results[j];
    // persist progress after each batch to public so the client can access interim results
    saveJson('public/data/events.json', events);
  }

  console.log('Scraped events:', events);

  // Process events
  const processed = events.map((event) => {
    // Helper function to parse date strings like "2025/10/14–2025/11/04"
    const parseDateRange = (dateStr) => {
      if (!dateStr) return { start: null, end: null };

      const m = dateStr.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/g);
      if (m && m.length > 0) {
        // first match is start
        const s = m[0];
        const parts = s.split(/\D/).filter(Boolean);
        const yyyy = parts[0];
        const mm = parts[1].padStart(2, '0');
        const dd = parts[2].padStart(2, '0');
        const start = `${yyyy}-${mm}-${dd}`;

        let end = null;
        if (m.length > 1) {
          const s2 = m[1];
          const parts2 = s2.split(/\D/).filter(Boolean);
          const yyyy2 = parts2[0];
          const mm2 = parts2[1].padStart(2, '0');
          const dd2 = parts2[2].padStart(2, '0');
          end = `${yyyy2}-${mm2}-${dd2}`;
        }

        return { start, end };
      }
      return { start: null, end: null };
    };

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
      type: event.type,
      image: event.image,
      link: event.link,
      origPrime: event.origPrime,
      hhPermits: event.hhPermits,
    };
  });

  console.log('Processed events:', processed);

  ensureDir('public/data/images');
  saveJson('public/data/events.json', processed);
  console.log('Saved all events to public/data/events.json');

  for (const event of processed) {
    if (event.image) {
      // If the event.image already looks like a public URL (/data/images/...),
      // derive the disk path and skip if present
      if (event.image.startsWith('/data/images/') || event.image.startsWith('data/images/')) {
        const filename = event.image.split('/').pop();
        const diskPath = `public/data/images/${filename}`;
        if (fileExists(diskPath)) {
          console.log('Image for', event.name, 'already local:', diskPath);
          // store project-relative path (no leading slash) so client prefixes base
          event.image = `data/images/${filename}`;
          continue;
        }
      }

      // Remove any query string from the image URL so the saved filename is clean
      const rawFilename = event.image.split('/').pop() || '';
      const filename = rawFilename.split('?')[0];
      const filepath = `public/data/images/${filename}`;
      // skip download if file exists already
      if (fileExists(filepath)) {
        console.log('Skipping download; local image exists for', event.name, filepath);
        event.image = `data/images/${filename}`;
        continue;
      }
      try {
        await downloadImage(event.image, filepath);
        event.image = `data/images/${filename}`;
        console.log('Downloaded image for', event.name);
      } catch (err) {
        console.error('Error downloading image for', event.name, err.message);
        event.image = null;
      }
    }
  }

  // Save updated public/data/events.json with public image paths
  saveJson('public/data/events.json', processed);
  console.log('Updated public/data/events.json with public image paths');
}

scrapeEvents().catch((err) => {
  console.error('Scraping failed:', err);
  process.exit(1);
});
