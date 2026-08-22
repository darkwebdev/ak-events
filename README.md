# Arknights Events

Calculate your Orundum and pulls by any event.

## Live Demo

View the live site at: [https://darkwebdev.github.io/ak-events/](https://darkwebdev.github.io/ak-events/)

View the component library / design tokens at: [https://darkwebdev.github.io/ak-events/storybook/](https://darkwebdev.github.io/ak-events/storybook/)

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/darkwebdev/ak-events.git
   cd ak-events
   ```

2. Use Yarn for local development (recommended)

   This project uses Yarn to run scripts and manage dependencies. Please use `yarn` instead of `npm` for all repository commands to avoid subtle differences in script execution and environment.

   Install dependencies:

   ```bash
   yarn
   ```

   Run the scraper to update `public/data/events.json`:

   ```bash
   yarn scrape
   ```

   Start the Vite dev server (development):

   ```bash
   yarn dev
   ```

   Build the frontend (production):

   ```bash
   yarn build
   ```

   Run the preview server (serve built files):

   ```bash
   yarn start
   ```

   Run the project's test suite (Jest):

   ```bash
   yarn test
   ```

   Start the Storybook component explorer:

   ```bash
   yarn storybook
   ```

   Build Storybook for production:

   ```bash
   yarn build-storybook
   ```

3. Open the app in your browser:

   - Dev server: http://localhost:5173 (when running `yarn dev`)
   - Preview server (after `yarn build` + `yarn start`): the CLI will show the port (default 5173)

Notes:

- Prefer `yarn` for running scripts to keep environment parity across contributors.
- If you must use `npm`, use `npm run <script>` but be aware some scripts rely on Yarn-specific behaviors in CI or documentation.

## Project Structure

- `src/client/`: React (Vite) frontend
  - `index.html`, `main.jsx`, `App.jsx`, `App.css`: app entry point
  - `components/`: UI components (`Header`, `EventsList`, `Event`, `CurrentlyOwned`, `DailyOrundum`, `TotalOrundum`, `Breakdown`, `Orundum`, `Pulls`, `PullCounter`, `InfoButton`), each with Storybook stories
  - `hooks/useStorage.js`: localStorage-backed state hook
  - `utils/`: `orundum.js`, `events.js`, `dates.js`, `images.js` — Orundum/pull calculations and event helpers
  - `settings.json`, `playerStatus.json`: default recurring-income settings and player-owned resources
  - `vite.config.js`: builds to repo-root `dist/`, serves repo-root `public/` as static assets
- `src/server/`: Node.js scraper
  - `scrape.js`: scrapes events from the Arknights wiki (`arknights.wiki.gg`) via its MediaWiki API and writes `public/data/events.json` plus event images
  - `config.js`: wiki API endpoints
  - `lib/`: `network.js`, `parser.js`, `wiki.js`, `normalizeEvent.js`, `storage.js` — scraper internals
- `scripts/`: standalone maintenance scripts (`optimiseImages.js`, `lint-with-local-rules.cjs`, `stop-server.js`, `register-eslint-rules.cjs`)
- `public/data/events.json`: JSON file containing the scraped events (served at `/data/events.json`)
- `public/data/images/`: downloaded/optimised event images
- `__tests__/`: Jest test suite
- `.github/workflows/scrape.yml`: GitHub Actions workflow for daily scraping (runs `yarn scrape` + `yarn optimise-images`, commits changes)
- `.github/workflows/deploy-pages.yml`: GitHub Actions workflow that builds `src/client` and deploys `dist/` to GitHub Pages on push to `main`

## License

This project is open source. Feel free to use and modify.
