# Premium Weather App

A pure frontend premium weather dashboard — React 18 (Create React App), deployed to
**GitHub Pages**. No server needed.

## Features

- **Current conditions** — big temperature, feels-like, hi/lo, day/night, sunrise/sunset
- **Hourly forecast** — 24-hour strip; tap any hour for wind, gust, humidity, rain chance, UV, pressure, visibility, cloud
- **Daily forecast** — expandable rows with sunrise/sunset, day length, moon phase & illumination, rain/snow, UV
- **Air Quality Index** — US-EPA scale meter with main pollutant and health advice
- **UV Index** — colored meter with burn-time guidance
- **Daily insights** — clothing, activity, umbrella and comfort recommendations (rule-based)
- **Trend charts** — 24-hour temperature curve and daily high/low (custom SVG, no chart lib)
- **Radar map** — Leaflet + free RainViewer radar tiles (play/pause loop, opacity) — no API key needed
- **Animated backgrounds** — condition-based particles: rain, snow, fog, clouds, stars, thunder flashes
- **Favorites & recents** — quick-switch favorite chips, recent-search history, autocomplete city search
- **Settings** — °C/°F, km/h↔mph, km↔mi, hPa↔inHg, 12/24h clock, light/dark theme (persisted)
- **Severe weather alerts** — WeatherAPI alerts banner with color-coded hazard types
- **PWA** — installable, offline shell via a scope-aware service worker
- **Error/retry UI + skeletons**, race-safe fetching with a 5-minute in-memory cache

## Data source

All data comes from [WeatherAPI.com](https://www.weatherapi.com). Because this is a static
site, the **API key ships in the client** (`src/lib/config.js`) and counts against that
account's quota — that's inherent to any no-server weather app. A free-tier account returns
**3 forecast days**; the UI renders whatever the API returns, so upgrading the key unlocks
more days automatically without code changes.

RainViewer radar tiles and OpenStreetMap basemap are free and keyless.

## Local development

```bash
npm install
npm start          # http://localhost:3000
```

To use a different WeatherAPI key without editing source, copy `.env.example` to `.env`,
set `REACT_APP_WEATHER_API_KEY`, and rebuild.

## Deploy to GitHub Pages

```bash
npm run build      # production build -> build/
npm run deploy     # gh-pages -d build -> gh-pages branch
```

The app uses hash-based routing (`createHashRouter`), so no server-side route rewrites are
needed. The GitHub Pages base path is configured via the `homepage` field in `package.json`.

## Build & test

```bash
npm run build      # production build (compile + eslint)
npm test           # unit + integration tests
```

## Scripts

| Command | Action |
|---|---|
| `npm start` | CRA dev server (port 3000) |
| `npm run build` | Production build to `build/` |
| `npm run deploy` | Push `build/` to GitHub Pages |
| `npm test` | Jest tests |