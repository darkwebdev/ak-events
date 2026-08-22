import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Matches the ambient jest.*/describe/test/expect globals every existing test
    // file already uses, so migrating off Jest doesn't require touching imports in
    // every file.
    globals: true,
    environment: 'node',
  },
});
