import { groupOperatorsByStar, splitOperatorColumns } from '../../src/client/utils/operators.js';

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

  test('within a star rank, puts rate-up-only (not yet sparkable) operators before sparkable ones', () => {
    const operators = [
      { name: 'Sparkable One', star: 6, sparkCost: 300 },
      { name: 'Debuting One', star: 6, sparkCost: null },
      { name: 'Sparkable Two', star: 6, sparkCost: 300 },
      { name: 'Debuting Two', star: 6, sparkCost: null },
    ];

    const [[, ops]] = groupOperatorsByStar(operators);

    expect(ops.map((op) => op.name)).toEqual([
      'Debuting One',
      'Debuting Two',
      'Sparkable One',
      'Sparkable Two',
    ]);
  });
});

describe('splitOperatorColumns', () => {
  test('puts 6★ operators in the first column and every other rarity in the second', () => {
    const operators = [
      { name: 'Taraxacum', star: 5 },
      { name: 'Chongyue', star: 6 },
      { name: 'Popukar', star: 4 },
      { name: 'Shu', star: 6 },
    ];

    const [sixStarColumn, otherColumn] = splitOperatorColumns(operators);

    expect(sixStarColumn.map(([star]) => star)).toEqual([6]);
    expect(sixStarColumn[0][1].map((op) => op.name)).toEqual(['Chongyue', 'Shu']);
    expect(otherColumn.map(([star]) => star)).toEqual([5, 4]);
  });

  test('leaves a column empty (not missing) when no operator of that kind is present', () => {
    const [sixStarColumn, otherColumn] = splitOperatorColumns([{ name: 'Mudrock', star: 6 }]);

    expect(sixStarColumn).toHaveLength(1);
    expect(otherColumn).toEqual([]);
  });
});
