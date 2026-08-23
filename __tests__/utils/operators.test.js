import { groupOperatorsByStar } from '../../src/client/utils/operators.js';

describe('groupOperatorsByStar', () => {
  test('groups operators by star rank, highest first', () => {
    const operators = [
      { name: 'Taraxacum', star: 5 },
      { name: 'Chongyue', star: 6 },
      { name: 'Whisperain', star: 5 },
      { name: 'Shu', star: 6 },
    ];

    const groups = groupOperatorsByStar(operators);

    expect(groups.map(([star]) => star)).toEqual([6, 5]);
    expect(groups[0][1].map((op) => op.name)).toEqual(['Chongyue', 'Shu']);
    expect(groups[1][1].map((op) => op.name)).toEqual(['Taraxacum', 'Whisperain']);
  });

  test('handles a missing star as its own trailing group', () => {
    const operators = [{ name: 'Unknown' }, { name: 'Chongyue', star: 6 }];

    const groups = groupOperatorsByStar(operators);

    expect(groups.map(([star]) => star)).toEqual([6, 0]);
  });

  test('returns an empty array for no operators', () => {
    expect(groupOperatorsByStar([])).toEqual([]);
    expect(groupOperatorsByStar(undefined)).toEqual([]);
  });
});
