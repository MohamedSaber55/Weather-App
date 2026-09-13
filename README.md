# Premium Weather App

A full-stack premium weather dashboard — React 18 (CRA) frontend + an Express caching proxy.

## Features

- **Current conditions** — big temperature, feels-like, hi/lo, day/night, sunrise/sunset
- **Hourly forecast** — 24-hour strip; tap any hour for wind, gust, humidity, rain chance, UV, pressure, visibility, cloud
- **Daily forecast** — expandable rows with sunrise/sunset, day length, moon phase & illumination, rain/snow, UV
- **Air Quality Index** — US-EPA scale meter with main pollutant and health advice
- **UV Index** — colored meter with burn-time guidance
- **Daily insights** — clothing, activity, umbrella and comfort recommendations (rule-based)
- **Trend charts** — 24-hour temperature curve and daily high/low (custom SVG, no chart lib)
- **Radar map** — Leaflet + free RainViewer radar tiles (play/pause loop, opacity)
- **Animated backgrounds** — condition-based particles: rain, snow, fog, clouds, stars, thunder flashes
- **Favorites & recents** — quick-switch favorite chips, recent-search history, autocomplete city search
- **Settings** — °C/°F, km/h↔mph, km↔mi, hPa↔inHg, 12/24h clock, light/dark theme (persisted)
- **Severe weather alerts** — WeatherAPI alerts banner with color-coded hazard types
- **PWA** — installable, offline shell via custom service worker
- **Error/retry UI + skeletons**, race-safe fetching, response caching (5 min client / 30 min server)

## Architecture

```
Weather-App/
├── server/            Express 5 proxy — hides the WeatherAPI key, caches, rate-limits
│   ├── index.js       routes: /api/weather, /api/search, /api/ip-location, /api/health
│   ├── cache.js       in-memory TTL cache with in-flight dedupe
│   └── .env           WEATHER_API_KEY (gitignored; see .env.example)
├── src/
│   ├── lib/           api client, unit conversions, condition/advice engine
│   ├── context/       Settings (units/theme) + Favorites (favorites/recents)
│   ├── hooks/         useWeather (SWR-ish cache), useDebouncedValue
│   └── components/    16 feature components
└── public/            manifest, sw.js, icons
```

**Why a backend?** The WeatherAPI free tier is quota-limited. The proxy caches every response
(30 min weather / 12 h search) and dedupes concurrent requests, so your key is used far less
and never exposed to the browser.

**Free-tier forecast length:** WeatherAPI returns 3 forecast days on the free tier. The UI
renders whatever comes back; upgrading the key unlocks all 7 (or more) automatically.

## Local development

```bash
# 1. Configure the API key (one-time)
copy server\.env.example server\.env      # fill in WEATHER_API_KEY

# 2. Install deps
npm install
npm --prefix server install

# 3. Run the backend proxy (port 5000)
npm run server

# 4. In another terminal, run the frontend (port 3000, proxies /api -> :5000)
npm start
```

## Build & test

```bash
npm run build      # production build -> build/  (relative asset paths)
npm test           # unit + integration tests
```

## Deployment

### Option A — single host (recommended, serves everything)

`npm run build`, then `npm start` the server. Express serves both the API and the built
frontend from the same origin. Deploy `server/` + `build/` to Render, Railway, Fly.io, a
VPS, etc. Set `WEATHER_API_KEY` (and `CORS_ORIGIN` if needed) as env vars.

### Option B — frontend on GitHub Pages + backend elsewhere

1. Deploy `server/` to any Node host (Render/Railway) with `WEATHER_API_KEY` set.
2. Build with that URL baked in: copy `.env.example` to `.env` and set
   `REACT_APP_API_URL=https://your-backend-host.example`, then `npm run build`.
3. Deploy `build/` to Pages: `npm run deploy`.

> Note: the API key lives in `server\.env` locally and in host env vars when deployed —
> never in the frontend.

## Scripts

| Command | Action |
|---|---|
| `npm start` | CRA dev server (port 3000) |
| `npm run server` | Express proxy (port 5000) |
| `npm run build` | Production build |
| `npm test` | Jest tests |
| `npm run deploy` | Push `build/` to GitHub Pages |