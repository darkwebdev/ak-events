// Primary index: use the Arknights wiki 'Event' page as the canonical source
export const indexUrl = 'https://arknights.wiki.gg/wiki/Event';
export const wikiBase = 'https://arknights.wiki.gg/wiki/';
export const wikiApiBase = 'https://arknights.wiki.gg/api.php';
// wiki.gg serves a bot challenge (403 "Just a second...") to requests posing as a
// browser, but lets through clients that identify themselves honestly, per
// MediaWiki's API etiquette — so every wiki.gg request uses this, not a browser UA.
export const wikiUserAgent = 'ak-events-scraper/1.0 (https://github.com/darkwebdev/ak-events)';

// The game's own data, used by lib/network.js to determine Limited operator debut
// dates authoritatively (see its fetchGachaTable/fetchCharacterTable for why).
export const gachaTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/gacha_table.json';
export const characterTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/character_table.json';
// Every event/activity on the EN client, with exact startTime/endTime — the primary
// source for event dates now (see lib/gameData.js). Only contains events already
// added to the EN client, not far-future CN-only ones.
export const activityTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/activity_table.json';
// Per-stage data, including each stage's one-time Originite Prime completion reward
// (the `diamondOnceDrop` field) — see lib/gameData.js's originitePrimeFromStages.
export const stageTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/stage_table.json';

// Community site with predicted Global dates for CN-only-announced events (a gap
// none of our other sources fill) and structured per-event reward-store data — see
// lib/arkpedia.js.
export const arkpediaBase = 'https://www.arkpedia.net';

const config = {
  indexUrl,
  wikiBase,
  wikiApiBase,
  wikiUserAgent,
  gachaTableUrl,
  characterTableUrl,
  activityTableUrl,
  stageTableUrl,
  arkpediaBase,
};
export default config;
