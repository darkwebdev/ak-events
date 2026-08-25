// Primary index: use the Arknights wiki 'Event' page as the canonical source
export const indexUrl = 'https://arknights.wiki.gg/wiki/Event';
export const wikiBase = 'https://arknights.wiki.gg/wiki/';
export const wikiApiBase = 'https://arknights.wiki.gg/api.php';

// The game's own data, used by lib/network.js to determine Limited operator debut
// dates authoritatively (see its fetchGachaTable/fetchCharacterTable for why).
export const gachaTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/gacha_table.json';
export const characterTableUrl =
  'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGameData/master/en/gamedata/excel/character_table.json';

const config = { indexUrl, wikiBase, wikiApiBase, gachaTableUrl, characterTableUrl };
export default config;
