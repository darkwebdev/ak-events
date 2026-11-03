import { carryOverEvents } from '../src/server/lib/carryOver.js';

const ev = (name, start, end) => ({ name, start, end });

describe('carryOverEvents', () => {
  const today = '2026-11-03';
  const previous = [
    ev("The Masses' Travels", '2026-11-05', '2026-11-19'),
    ev('Positional Football Championship', '2026-11-23', '2026-12-07'),
    ev('Ato', '2026-01-16', '2026-01-30'), // over
    ev('Act or Die', '2025-11-13', null),
    ev('No date', null, null),
  ];

  test("keeps last run's events this run lost, unless they've ended", () => {
    const processed = [ev("The Masses' Travels Rerun", '2026-11-05', '2026-11-19')];
    expect(carryOverEvents(processed, previous, today).map((e) => e.name)).toEqual([
      'Positional Football Championship',
      'Act or Die',
    ]);
  });

  test('matches reruns by name and ignores a missing previous file', () => {
    const processed = [ev('Act or Die/Rerun', '2025-11-13', null)];
    expect(carryOverEvents(processed, previous, today).map((e) => e.name)).not.toContain(
      'Act or Die'
    );
    expect(carryOverEvents(processed, null, today)).toEqual([]);
  });
});
