#!/usr/bin/env node
import { main } from '../src/server/optimiseImages.js';

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('optimiseImages failed:', err && (err.stack || err.message || err));
  process.exit(1);
});
