const config = require('../config');

function printableUrlFor(fetchUrl) {
  if (!fetchUrl) return null;
  if (fetchUrl.startsWith(config.wikiBase)) {
    return fetchUrl.replace(config.wikiBase, config.wikiPrintableBase) + '&printable=yes';
  }
  return fetchUrl;
}

function titleFromUrl(fetchUrl) {
  if (!fetchUrl) return null;
  // remove any /Rerun suffix
  const cleaned = fetchUrl.replace(/\/Rerun$/, '');
  if (cleaned.startsWith(config.wikiBase)) {
    return cleaned.replace(config.wikiBase, '');
  }
  return cleaned;
}

module.exports = { printableUrlFor, titleFromUrl };
