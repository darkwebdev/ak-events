const { normalizeEvent } = require('../src/server/lib/normalizeEvent');

test('normalizes DD.MM.YYYY date string into start/end and slug', () => {
  const raw = { name: 'Act or Die Event', dateStr: '05.06.2025', type: 'Event', image: 'https://cdn/events/act.png', link: 'https://arknights.wiki.gg/wiki/Act_or_Die', origPrime: '28', hhPermits: '3' };
  const out = normalizeEvent(raw);
  expect(out.name).toBe('Act or Die Event');
  expect(out.start).toBe('2025-06-05');
  expect(out.end).toBe('2025-06-12');
  expect(out.origPrime).toBe(28);
  expect(out.hhPermits).toBe(3);
  expect(out.slug).toBe('act_or_die_event');
});

test('strips rerun markers and handles missing dates and numbers', () => {
  const raw = { name: 'Path of Life Rerun', dateStr: null, type: 'Rerun', image: null, link: null, origPrime: null, hhPermits: '∞' };
  const out = normalizeEvent(raw);
  expect(out.name).toBe('Path of Life');
  expect(out.start).toBe('TBD');
  expect(out.end).toBe('');
  expect(out.origPrime).toBeNull();
  expect(out.hhPermits).toBeNull();
  expect(out.slug).toBe('path_of_life');
});
