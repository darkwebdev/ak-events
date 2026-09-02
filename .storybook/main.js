/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Scraped event/operator images live in public/data/images/ and are referenced by
  // path from story data (e.g. Event.stories.jsx's baseEvent.image) — without this,
  // Storybook's dev server never serves that directory and every such image 404s.
  staticDirs: ['../public'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // The default docgen parser (react-docgen, babel-based) chokes on `import type`
  // syntax now that stories are .tsx — nothing here actually depends on its output,
  // since no Controls-panel addon is registered and every story that needs argTypes
  // already declares them explicitly, so disabling it outright is simplest.
  typescript: {
    reactDocgen: false,
  },
};
export default config;
