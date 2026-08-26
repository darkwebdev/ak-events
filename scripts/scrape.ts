#!/usr/bin/env -S npx tsx
import { scrapeEvents } from '../src/server/scrape.js';

scrapeEvents().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Scraping failed:', err);
  process.exit(1);
});
