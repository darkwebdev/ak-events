const fs = require('fs');
const path = require('path');

function loadEvents() {
  const p = path.join(__dirname, '..', 'public', 'data', 'events.json');
  const raw = fs.readFileSync(p, 'utf8');
  return JSON.parse(raw);
}

describe('public/events.json integration', () => {
  let events;
  beforeAll(() => {
    events = loadEvents();
  });

  test('events.json is an array with entries', () => {
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  test('no event name contains the word Rerun', () => {
    const bad = events.filter(e => typeof e.name === 'string' && /\bRerun\b/i.test(e.name));
    expect(bad).toEqual([]);
  });

  test('image paths are safe and use an allowed prefix', () => {
    const allowedPrefixes = ['/data/images/', '/images/thumb/', 'http://', 'https://'];
    for (const ev of events) {
      if (!ev.image) continue;
      expect(typeof ev.image).toBe('string');
      // no raw spaces in the path
      expect(/\s/.test(ev.image)).toBe(false);
      // must start with an allowed prefix
      const ok = allowedPrefixes.some(pref => ev.image.startsWith(pref));
      expect(ok).toBe(true);
    }
  });

  test('numeric fields are integers when present', () => {
    for (const ev of events) {
      if (ev.origPrime != null) expect(Number.isInteger(ev.origPrime)).toBe(true);
      if (ev.hhPermits != null) expect(Number.isInteger(ev.hhPermits)).toBe(true);
    }
  });

  test('event names are unique (case-insensitive)', () => {
    const seen = {};
    const dups = [];
    for (const ev of events) {
      const n = (ev.name || '').toLowerCase();
      if (!n) continue;
      if (seen[n]) dups.push(ev.name);
      seen[n] = true;
    }
    expect(dups).toEqual([]);
  });
});
