# Arknights Events

A static website that displays upcoming and ongoing Arknights events, scraped daily from [oldwell.info](https://oldwell.info/).

## Live Demo

View the live site at: [https://darkwebdev.github.io/ak-events/](https://darkwebdev.github.io/ak-events/)

## Features

- Displays event names, types (e.g., Limited Event, Side Story), and dates
- Automatically updated daily via GitHub Actions
- Responsive design with basic styling

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend/Automation**: Node.js, Puppeteer for scraping
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/darkwebdev/ak-events.git
   cd ak-events
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run the scraper to update `data/events.json`:
   ```bash
   yarn scrape
   ```

4. Start the local server:
   ```bash
   yarn start
   ```

5. Open `http://localhost:8080` in your browser.

## Project Structure

- `index.html`: Main HTML page
- `script.js`: Client-side JavaScript for loading and displaying events
- `scrape.js`: Node.js script for scraping events from oldwell.info
- `data/events.json`: JSON file containing the scraped events
- `.github/workflows/scrape.yml`: GitHub Actions workflow for daily updates

## License

This project is open source. Feel free to use and modify.