#!/usr/bin/env -S npx tsx
// Writes public/data/stage_op.json — every stage with a one-time Originite Prime
// reward, grouped by episode / event (see src/server/lib/stageOp.ts). Runs after
// the events scrape in the daily job.
import {
  fetchActivityTable,
  fetchCnActivityTable,
  fetchItemTable,
  fetchRetroTable,
  fetchStageTable,
  fetchZoneTable,
} from '../src/server/lib/network.js';
import { buildStageOpData } from '../src/server/lib/stageOp.js';
import { saveJson } from '../src/server/lib/storage.js';

const OUT = 'public/data/stage_op.json';

// One retry each: these files are large (the stage table is ~25MB) and a
// download occasionally gets cut off.
async function retryOnce<T>(fetch: () => Promise<T | null>): Promise<T | null> {
  return (await fetch()) ?? fetch();
}

async function main() {
  const [stageTable, zoneTable, activityTable, retroTable, cnActivityTable, itemTable] =
    await Promise.all([
      retryOnce(fetchStageTable),
      retryOnce(fetchZoneTable),
      retryOnce(fetchActivityTable),
      retryOnce(fetchRetroTable),
      // Extras: without them, no CN dates / sanity pack names, nothing else lost.
      retryOnce(fetchCnActivityTable),
      retryOnce(fetchItemTable),
    ]);
  if (!stageTable || !zoneTable || !activityTable || !retroTable) {
    // Keep yesterday's file rather than writing a partial one — the stage list
    // changes rarely, and a stale day is harmless.
    console.warn(`Could not download the game data; leaving ${OUT} as it is.`);
    return;
  }
  const data = buildStageOpData({
    stageTable,
    zoneTable,
    activityTable,
    retroTable,
    cnActivityTable,
    itemTable,
  });
  const stageCount = data.groups.reduce((n, g) => n + g.stages.length, 0);
  saveJson(OUT, data);
  console.log(`Saved ${data.groups.length} groups, ${stageCount} Originite Prime stages to ${OUT}`);
}

main().catch((err) => {
  console.error('Building stage_op.json failed:', err);
  process.exit(1);
});
