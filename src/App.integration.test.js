import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { FavoritesProvider } from './context/FavoritesContext';

// plain functions, not jest.fn(): CRA resets mock implementations before every test
jest.mock('leaflet', () => {
  const noop = () => {};
  return {
    map: () => ({
      setView: noop,
      remove: noop,
      removeLayer: noop,
      invalidateSize: noop,
      attributionControl: { setPrefix: noop },
    }),
    tileLayer: () => ({ addTo: noop, setOpacity: noop, remove: noop }),
    marker: () => ({ addTo: noop, setLatLng: noop, setIcon: noop }),
    divIcon: () => ({}),
  };
});

const buildHour = h => ({
  time: `2026-09-13 ${String(h).padStart(2, '0')}:00`,
  temp_c: 28 + (h % 6),
  feelslike_c: 30,
  humidity: 45,
  wind_kph: 12,
  gust_kph: 18,
  chance_of_rain: 10,
  uv: 5,
  pressure_mb: 1013,
  vis_km: 10,
  cloud: 20,
  condition: { text: 'Sunny', icon: 'http://cdn.weatherapi.com/weather/64x64/day/113.png', code: 1000 },
});

const day = i => ({
  date: `2026-09-${13 + i}`,
  astro: {
    sunrise: '06:00 AM',
    sunset: '06:00 PM',
    moonrise: '08:00 PM',
    moonset: '07:00 AM',
    moon_phase: 'Waxing Crescent',
    moon_illumination: 42,
  },
  day: {
    maxtemp_c: 35,
    mintemp_c: 25,
    daily_chance_of_rain: 10,
    maxwind_kph: 18,
    avghumidity: 40,
    uv: 8,
    totalprecip_mm: 0,
    totalsnow_cm: 0,
    avgvis_km: 10,
    condition: { text: 'Sunny', icon: 'http://cdn.weatherapi.com/weather/64x64/day/113.png', code: 1000 },
  },
  hour: Array.from({ length: 24 }, (_, h) => buildHour(h)),
});

const weather = {
  location: {
    name: 'Cairo',
    region: 'Al Qahirah',
    country: 'Egypt',
    lat: 30.04,
    lon: 31.24,
    tz_id: 'Africa/Cairo',
    localtime: '2026-09-13 14:00',
    localtime_epoch: 1786701600,
  },
  current: {
    last_updated: '2026-09-13 13:45',
    temp_c: 32,
    feelslike_c: 33,
    is_day: 1,
    humidity: 40,
    wind_kph: 15,
    gust_kph: 20,
    wind_dir: 'N',
    wind_degree: 355,
    vis_km: 10,
    pressure_mb: 1013,
    dewpoint_c: 18,
    cloud: 0,
    uv: 8,
    condition: { text: 'Sunny', icon: 'http://cdn.weatherapi.com/weather/64x64/day/113.png', code: 1000 },
    air_quality: { 'us-epa-index': 2, pm2_5: 8, pm10: 12, o3: 40, no2: 9 },
  },
  forecast: { forecastday: [day(0), day(1), day(2)] },
  alerts: { alert: [] },
};

beforeEach(() => {
  global.fetch = jest.fn(url => {
    if (String(url).includes('api.weatherapi.com') && String(url).includes('forecast.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(weather) });
    }
    if (String(url).includes('api.weatherapi.com') && String(url).includes('search.json')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    }
    if (String(url).includes('rainviewer.com/public/weather-maps.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ host: 'https://tilecache.rainviewer.com', radar: { past: [{ time: 1786700000, path: '/v2/radar/1786700000' }], nowcast: [] } }),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve('') });
  });
});

function renderApp() {
  return render(
    <SettingsProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </SettingsProvider>
  );
}

describe('Instrument panel dashboard', () => {
  test('renders every panel with real data', async () => {
    renderApp();
    expect(await screen.findByRole('heading', { name: /cairo/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText(/temperature · 24 h/i).length).toBeGreaterThan(0));
    expect(screen.getAllByText(/^forecast$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/air quality/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/uv index/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/advisories/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/radar/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/wear/i).length).toBeGreaterThan(0);
    // current readings: temperature, humidity and wind
    expect(screen.getByText('32.0')).toBeInTheDocument();
    expect(screen.getAllByText('40').length).toBeGreaterThan(0);
    expect(screen.getByText(/N 355°/)).toBeInTheDocument();
  });

  test('reports the US EPA air quality category, not a 0-500 index', async () => {
    renderApp();
    expect(await screen.findByText(/moderate/i)).toBeInTheDocument();
    expect(screen.getByText('/6')).toBeInTheDocument();
  });

  test('shows an error state when the API fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('network down')));
    renderApp();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});
