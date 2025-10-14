const { applyRerunSuffix } = require('../src/server/lib/wiki');

test('appends (Rerun) when link ends with /Rerun', () => {
  expect(applyRerunSuffix('Side Story (Carnival)', '/wiki/Event/Adventure_That_Cannot_Wait_for_the_Sun/Rerun')).toBe('Side Story (Carnival) (Rerun)');
});

test('is case-insensitive for link suffix', () => {
  expect(applyRerunSuffix('Side Story', '/wiki/Event/Foo/rerun')).toBe('Side Story (Rerun)');
});

test('does not double-append when type already contains (Rerun)', () => {
  expect(applyRerunSuffix('Side Story (Carnival) (Rerun)', '/wiki/Event/Foo/Rerun')).toBe('Side Story (Carnival) (Rerun)');
});

test('returns original type when link is not a rerun', () => {
  expect(applyRerunSuffix('Special event', '/wiki/Event/Special_event')).toBe('Special event');
});

test('handles null/undefined gracefully', () => {
  expect(applyRerunSuffix(null, '/wiki/Event/Foo/Rerun')).toBeNull();
  expect(applyRerunSuffix('Side Story', null)).toBe('Side Story');
});
