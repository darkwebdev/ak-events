const slugify = (s) => s.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();

// Normalize a single raw event object produced by page.evaluate in scrape.js
// Input shape (partial): { name, dateStr, type, image, link, origPrime, hhPermits }
// Output shape: { name, start, end, type, image, link, origPrime, hhPermits, slug }
function normalizeEvent(raw) {
  const event = Object.assign({}, raw);
  // Normalize name: strip rerun markers and trailing qualifiers
  if (event.name) {
    event.name = event.name.replace(/\s*\(Rerun\)|\s*Rerun|\s*\: Re-run/ig, '').trim();
  }

  // Normalize dates: scrape.js used DD.MM.YYYY in dateStr; convert to YYYY-MM-DD
  let start = 'TBD';
  let end = '';
  if (event.dateStr) {
    const parts = event.dateStr.split('.');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      start = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      const sd = new Date(start);
      if (!isNaN(sd.getTime())) {
        const ed = new Date(sd);
        ed.setDate(sd.getDate() + 7);
        end = ed.toISOString().split('T')[0];
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
  const op = event.origPrime == null ? null : parseInt(event.origPrime) || null;
  const hh = event.hhPermits == null ? null : parseInt(event.hhPermits) || null;

  const out = {
    name: event.name || 'Unknown',
    start,
    end,
    type: event.type || 'Event',
    image: event.image,
    link: event.link,
    origPrime: op,
    hhPermits: hh,
    slug: slugify(event.name || 'unknown')
  };

  return out;
}

module.exports = { normalizeEvent };
