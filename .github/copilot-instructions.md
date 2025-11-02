# Arknights Events - AI Agent Instructions

## Architecture Overview

This is a dual-architecture application:

- **Frontend**: React app (Vite) for Orundum/pull calculations
- **Backend**: Node.js scraper that fetches Arknights event data from wiki APIs
- **Data Flow**: Scraper → `public/data/events.json` → React app consumption

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
yarn test           # Jest tests with debug fixtures in __tests__/debug_html/
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
- `src/server/scrape.js` - Wiki API scraper with rerun detection
- `src/server/lib/parser.js` - HTML parsing for event data extraction
- `package.json` - Yarn scripts, ES modules config
- `.github/workflows/scrape.yml` - Daily automated data updates

## Common Patterns

- **Rerun handling**: Events with `/Rerun` URLs get `(Rerun)` suffix
- **Error resilience**: Network failures return null, app degrades gracefully
- **Date calculations**: Event timing logic in `utils/dates.js`
- **Orundum math**: Pull calculations in `utils/orundum.js`
