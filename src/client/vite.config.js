import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Serve the repository root as Vite's public directory so /data/* is available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // When deploying to GitHub Pages for a project site, set base to '/<repo>/'
  // so asset URLs become '/ak-events/assets/...' instead of '/assets/...'.
  // Overridable via VITE_BASE_PATH so the staging deploy (published into a
  // /staging subdirectory of the same gh-pages branch — see
  // .github/workflows/deploy-staging.yml) can build with a different base without
  // this file needing to know which deploy it's building for.
  base: process.env.VITE_BASE_PATH || '/ak-events/',
  root: __dirname,
  publicDir: resolve(__dirname, '..', '..', 'public'),
  build: {
    // output the production build to the repository root `dist/` directory
    outDir: resolve(__dirname, '..', '..', 'dist'),
  },
});
