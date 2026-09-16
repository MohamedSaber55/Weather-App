# Premium Weather App

A pure frontend weather dashboard — React 18 (Create React App), deployed to
**GitHub Pages**. No server needed.

The interface is an **instrument panel**: graphite tiles on a 12-column grid,
monospaced figures (IBM Plex Mono), hairline borders, gauges for the readings
that have a scale. Everything the app knows is on one screen; nothing is hidden
behind a tab.

## Panels

- **Temperature** — current, feels-like, dew point, and a rail showing where the
  reading sits inside today's low/high
- **Condition** — icon, condition text, day/night, cloud, rain chance, visibility
- **Wind** — compass dial with the wind direction, speed and gusts
- **Humidity / Pressure** — segmented humidity meter, pressure in both units
- **Temperature · 24 h** — hourly curve with night shading; hover, tap or use the
  arrow keys to read any hour (temperature, feels-like, UV, rain chance, wind)
- **Forecast** — a table of the returned days; pick a row for sunrise, sunset,
  max wind, precipitation, humidity and moon
- **Radar** — Leaflet + free RainViewer radar tiles over OpenStreetMap, with a
  frame timeline, play/pause loop and an opacity control — no API key needed
- **Air quality** — US EPA category gauge (1–6) with the main pollutants
- **UV index** — gauge, hour-by-hour bars, burn time and protection advice
- **Sun / Moon** — daylight arc with elapsed share, moon phase drawn to the
  reported illumination
- **Advisories** — clothing, activity, rain and comfort tips (rule-based)
- **Search & saved locations** — autocomplete search (press `/` to focus), saved
  location tabs, recent searches
- **Settings** — °C/°F, km/h↔mph, km↔mi, hPa↔inHg, 12/24h clock, light/dark theme
  (persisted)
- **Severe weather alerts** — WeatherAPI alerts banner with color-coded hazards
- **PWA** — installable, offline shell via a scope-aware service worker
- **Error/retry UI + skeletons**, race-safe fetching with a 5-minute in-memory
  cache and a silent refresh every 10 minutes

## Saved places and the default location

The **+** next to the location tabs opens Places: everything you have saved, with
two ways to add — search by name, or **pick a spot on a map** (Leaflet over
OpenStreetMap; the coordinates are run through WeatherAPI search so the place
gets a real name). The house icon marks the **default** place, which is what the
dashboard opens on and is flagged in the tab strip. The bin removes a place.

## Arabic and right-to-left

Settings has a language switch (English / العربية). Arabic mirrors the whole
layout via `dir="rtl"`, translates every label, advisory, air-quality and UV
level, and asks WeatherAPI for Arabic condition text. Readings, units and the
hourly chart stay left-to-right inside the mirrored layout, the way charts and
numbers are normally set in Arabic typography. Digits stay Western, as Egypt
writes them.

## Without a connection

The last response per location is kept in localStorage, so opening the site
offline shows that reading instead of an error: the status line reads
`Offline · 20 min ago`, a banner names the age of the reading with a Retry
button, and the radar tile and city search explain what needs the internet. The
ten-minute refresh pauses while offline and fires once the connection returns.

## Data source

All data comes from [WeatherAPI.com](https://www.weatherapi.com). Because this is a static
site, the **API key ships in the client** (`src/lib/config.js`) and counts against that
account's quota — that's inherent to any no-server weather app. A free-tier account returns
**3 forecast days**; the UI renders whatever the API returns, so upgrading the key unlocks
more days automatically without code changes.

RainViewer radar tiles and the OpenStreetMap basemap are free and keyless. The
basemap is plain OpenStreetMap; the graphite look is a CSS filter over the base
tiles only, so radar colors stay true.

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
| `npm test -- --watchAll=false` | Run tests once |
| `npm run build` | Production build to `build/` |
| `npm run deploy` | Push `build/` to GitHub Pages |
| `npm test` | Jest tests |