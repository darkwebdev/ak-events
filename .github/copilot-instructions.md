# Arknights Events - AI Agent Instructions

## Architecture Overview

This is a dual-architecture application:

- **Frontend**: React app (Vite) for Orundum/pull calculations, with a light/dark theme system
  (CSS custom properties in `App.css`, documented via the `Palette`/`Typography` Storybook pages)
- **Backend**: Node.js scraper that fetches Arknights event data from wiki APIs, matches each
  event to its headhunting banner (rate-up operators, Limited status, per-operator spark cost) by
  start-date overlap, and maintains caches of which operators are Limited and which event each
  operator debuted on
- **Data Flow**: Scraper → `public/data/events.json` (+ `operators.json`/`operator_debuts.json`
  caches) → React app consumption

## Critical Workflows

### Development Setup

```bash
yarn install  # Never use npm - project uses Yarn-specific behaviors
yarn dev      # Start Vite dev server (http://localhost:5173)
yarn scrape   # Update event data from Arknights wiki
```

### Build & Deploy

```bash
yarn build    # Builds to /dist with base path '/ak-events/' for GitHub Pages
yarn start    # Preview built app
```

### Testing & Quality

```bash
yarn test           # Vitest tests with debug fixtures in __tests__/debug_html/
yarn lint           # Custom ESLint with local rules (no-duplicate-exports)
yarn storybook      # Component development with Storybook
```

## Project Conventions

### Import Style

- **ES modules only**: `"type": "module"` in package.json
- **File extensions required**: `import { foo } from './bar.js'`
- **Default imports for built-ins**: `import fs from 'fs'`

### Component Patterns

- **Storybook-first**: Every component has `.stories.jsx` with mock data
- **CSS modules**: Components have dedicated `.css` files
- **Props interface**: Use `defaultProps` pattern in stories

### Data Management

- **JSON fixtures**: Test data in `__tests__/debug_html/` for parser validation
- **Local storage**: User settings via `useStorage` hook
- **Static data**: Event data served from `/data/events.json`

### Custom ESLint Rules

- **Local rules**: `eslint-rules/no-duplicate-exports.cjs` prevents export conflicts
- **Custom linter**: `scripts/lint-with-local-rules.cjs` loads rules dynamically
- **Rule registration**: Manual `linter.defineRule()` calls

### Image Pipeline

- **Download**: Scraper fetches event banners
- **Optimization**: `scripts/optimiseImages.js` converts PNGs to JPEGs
- **Storage**: Images in `public/data/images/` served statically

## Key Files

- `src/client/App.jsx` - Main React app with event calculation logic
- `src/client/App.css` - Light/dark theme tokens (`--ak-*` custom properties)
- `src/server/scrape.js` - Wiki API scraper with rerun detection and banner matching
- `src/server/lib/parser.js` - HTML parsing for event data extraction
- `src/server/lib/banners.js` - Parses headhunting banner pages, indexes them by start date
- `src/server/lib/operatorCache.js` - Resolves/caches whether an operator is Limited
- `src/server/lib/operatorDebuts.js` - Resolves/caches which event an operator first debuted on
- `package.json` - Yarn scripts, ES modules config
- `.github/workflows/scrape.yml` - Daily automated data updates
- `.github/workflows/deploy-storybook.yml` - Deploys Storybook to GitHub Pages after `deploy-pages.yml`

## Common Patterns

- **Rerun handling**: Events with `/Rerun` URLs get `(Rerun)` suffix
- **Error resilience**: Network failures return null, app degrades gracefully
- **Date calculations**: Event timing logic in `utils/dates.js`
- **Orundum math**: Pull calculations in `utils/orundum.js`
- **Event-to-banner matching**: by exact start-date overlap with `Headhunting/Banners/{year}` and
  `/Upcoming`, not by parsing the event page's prose (too inconsistent across pages to rely on)
- **Limited-operator detection**: an operator is Limited exactly when its wiki categories include
  none of "obtainable through X" (Standard/Kernel Headhunting, Recruitment) — there's no direct
  "Limited" category to check instead
- **Rate-up vs. sparkable**: an operator being rate-up on a banner and being redeemable via the
  Headhunting Data Contract Store are different things — a Limited operator is rate-up on the
  banner where they debut but not sparkable there, only once carried over to a later banner. This
  is read from the operator's own wiki page: their Changelog section's earliest (last-listed)
  entry names their real debut event, and only matches when it says "Introduced."
