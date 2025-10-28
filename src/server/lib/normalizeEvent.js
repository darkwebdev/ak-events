const slugify = (s) =>
  s
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

// Normalize a single raw event object produced by page.evaluate in scrape.js
// Input shape (partial): { name, dateStr, type, image, link, origPrime, hhPermits }
// Output shape: { name, start, end, type, image, link, origPrime, hhPermits, slug }
function normalizeEvent(raw) {
  const event = { ...raw };
  // Normalize name: strip rerun markers and trailing qualifiers
  if (event.name) {
    // strip common rerun markers including '(Rerun)', ' Rerun', '/Rerun', '-Rerun', '_Rerun', and ': Re-run'
    event.name = event.name.replace(/(?:\s*\(Rerun\)|[\/_\-\s]+Rerun|\s*:\s*Re-run)/gi, '').trim();
  }

  // Normalize dates: scrape.js used DD.MM.YYYY in dateStr; convert to YYYY-MM-DD
  let start = 'TBD';
  let end = '';
  if (event.dateStr) {
    const [dd, mm, yyyy] = event.dateStr.split('.');
    if (dd !== undefined && mm !== undefined && yyyy !== undefined) {
      start = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const sd = new Date(start);
      if (!Number.isNaN(sd.getTime())) {
        const ed = new Date(sd);
        ed.setDate(sd.getDate() + 7);
        const [dateOnly] = ed.toISOString().split('T');
        end = dateOnly;
      } else {
        start = 'TBD';
        end = '';
      }
    }
  }

  // Normalize image/link: ensure nulls are explicit
  if (!event.image) event.image = null;
  if (!event.link) event.link = null;

  // Normalize numeric fields: coerce to integer or null
  const { origPrime, hhPermits } = event;
  const op = origPrime == null ? null : parseInt(origPrime) || null;
  const hh = hhPermits == null ? null : parseInt(hhPermits) || null;

  const out = {
    name: event.name || 'Unknown',
    start,
    end,
    type: event.type || 'Event',
    image: event.image,
    link: event.link,
    origPrime: op,
    hhPermits: hh,
    slug: slugify(event.name || 'unknown'),
  };

  return out;
}

module.exports = { normalizeEvent };
