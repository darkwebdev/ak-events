const { createRenderer } = require('./lib/renderer');
const { parseFromSources } = require('./lib/parser');
const { parseIndexHtml, fetchHtml, fetchWikiApi, downloadImage, fetchIndexHtml, fetchEventHtml } = require('./lib/network');
const { ensureDir, saveJson, saveText, fileExists } = require('./lib/storage');
const config = require('./config');

async function scrapeEvents() {
  console.log('Creating renderer...');
  const renderer = await createRenderer();

  console.log('Fetching index page and extracting events...');
  const extractEventsFromIndexHtml = async () => {
    try {
      return await fetchIndexHtml(renderer);
    } catch (e) {
      console.error('Failed to fetch or render index page:', e.message);
      return null;
    }
  };

  const fetchRenderedEventHtml = async (eventUrl) => {
    try {
      return await fetchEventHtml(eventUrl, renderer);
    } catch (e) {
      console.warn('Failed to fetch rendered HTML for', eventUrl, e.message);
      return null;
    }
  };

  const { printableUrlFor, titleFromUrl } = require('./lib/wiki');

  const fetchAndParseEvent = async (event) => {
    // Skip fetching the wiki page if we already have both values
    if (event.origPrime != null && event.hhPermits != null) return event;
    if (!event.link) return event;
    const fetchUrl = event.link.replace('/Rerun', '');
    let htmlStatus = 'err';
    let printStatus = 'err';
    let jsonStatus = 'err';
    try {
      console.log('Fetching wiki for', event.name, fetchUrl);

      const renderedHtml = await fetchRenderedEventHtml(fetchUrl);
      // determine html status
      if (renderedHtml) {
        if (typeof renderedHtml === 'object' && renderedHtml.blocked) {
          htmlStatus = 'err';
        } else {
          htmlStatus = 'ok';
        }
      }

      let parsed = parseFromSources({ renderedHtml: (typeof renderedHtml === 'string' ? renderedHtml : (renderedHtml && renderedHtml.body) || null) });

      // If missing, try printable
      if ((parsed.origPrime == null || parsed.hhPermits == null) ) {
        try {
          const apiPrintableUrl = printableUrlFor(fetchUrl);
          const res = await fetchHtml(apiPrintableUrl);
          if (res && res.blocked) {
            printStatus = 'err';
          } else if (res && res.statusCode === 200 && res.body) {
            printStatus = 'ok';
            parsed = parseFromSources({ renderedHtml: (typeof renderedHtml === 'string' ? renderedHtml : null), printableHtml: res.body });
          }
        } catch (e) {
          // ignore printable errors
        }
      }

      // If still missing, try API parse
      if ((parsed.origPrime == null || parsed.hhPermits == null)) {
        try {
          const title = titleFromUrl(fetchUrl);
          const api = await fetchWikiApi(title);
          if (api && api.statusCode === 200 && api.body) {
            jsonStatus = 'ok';
            parsed = parseFromSources({ renderedHtml: (typeof renderedHtml === 'string' ? renderedHtml : null), apiJson: api.body });
          }
        } catch (e) {
          // ignore api errors
        }
      }

      if (parsed.origPrime != null) { event.origPrime = parsed.origPrime; }
      if (parsed.hhPermits != null) { event.hhPermits = parsed.hhPermits; }
    } catch (err) {
      console.error('Error fetching wiki for', event.name, err.message);
    }
    console.log(`[${fetchUrl}] html: ${htmlStatus} print:${printStatus} json:${jsonStatus}`);
    if (event.origPrime != null) console.log('Found Originite Prime for', event.name, ':', event.origPrime);
    if (event.hhPermits != null) console.log('Found Headhunting Permits for', event.name, ':', event.hhPermits);
    return event;
  };

  const indexHtml = await extractEventsFromIndexHtml();
  const events = parseIndexHtml(indexHtml || '');

  // save initial index snapshot
  saveJson('data/events_index.json', events);
  console.log('Saved index snapshot to data/events_index.json');

  // Concurrency limiter: process events in batches
  const concurrency = parseInt(process.env.AK_CONCURRENCY || '3');
  for (let i = 0; i < events.length; i += concurrency) {
    const batch = events.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(e => fetchAndParseEvent(e)));
    for (let j = 0; j < results.length; j++) events[i + j] = results[j];
  // persist progress after each batch
  saveJson('data/events.json', events);
  }
  await renderer.close();

  console.log('Scraped events:', events);

  // Process events
  const processed = events.map(event => {
    let start, end;
    if (event.dateStr) {
      const [dd, mm, yyyy] = event.dateStr.split('.');
      start = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const startDate = new Date(start);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      end = endDate.toISOString().split('T')[0];
    } else {
      start = 'TBD';
      end = '';
    }
    return { name: event.name, start, end, type: event.type, image: event.image, link: event.link, origPrime: event.origPrime, hhPermits: event.hhPermits };
  });

  console.log('Processed events:', processed);

  // Save to data/events.json (all events, no filtering)
  ensureDir('data/images');
  saveJson('data/events.json', processed);
  console.log('Saved all events to data/events.json');

  // Download images uses downloadImage from lib/network.js

  for (const event of processed) {
    if (event.image) {
      // if image already points to local file, skip
      if (event.image.startsWith('images/')) {
        console.log('Image for', event.name, 'already local:', event.image);
        continue;
      }
  const filename = event.image.split('/').pop();
  const filepath = `data/images/${filename}`;
      // skip download if file exists already
      if (fileExists(filepath)) {
        console.log('Skipping download; local image exists for', event.name, filepath);
        event.image = filepath;
        continue;
      }
      try {
        await downloadImage(event.image, filepath);
  event.image = filepath; // update to local path
        console.log('Downloaded image for', event.name);
      } catch (err) {
        console.error('Error downloading image for', event.name, err.message);
        event.image = null;
      }
    }
  }

  // Save updated data/events.json with local image paths
  saveJson('data/events.json', processed);
  console.log('Updated data/events.json with local image paths');
}

scrapeEvents().catch(err => {
  console.error('Scraping failed:', err);
  process.exit(1);
});
