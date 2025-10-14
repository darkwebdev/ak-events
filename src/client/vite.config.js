import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Serve the repository root as Vite's public directory so /data/* is available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, '..', '..', 'public'),
  build: {
    // output the production build to the repository root `dist/` directory
    outDir: resolve(__dirname, '..', '..', 'dist')
  }
});
