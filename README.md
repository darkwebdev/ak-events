# Arknights Events

Calculate your Orundum and pulls by any event.

## Live Demo

View the live site at: [https://darkwebdev.github.io/ak-events/](https://darkwebdev.github.io/ak-events/)

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

- `index.html`: Main HTML page
- `script.js`: Client-side JavaScript for loading and displaying events
- `scrape.js`: Node.js script for scraping events from the Arknights wiki via its MediaWiki API
- `public/data/events.json`: JSON file containing the scraped events (served at `/data/events.json`)
- `.github/workflows/scrape.yml`: GitHub Actions workflow for daily updates

## License

This project is open source. Feel free to use and modify.