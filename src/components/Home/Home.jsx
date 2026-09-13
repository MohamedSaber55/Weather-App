import React, { useCallback, useState } from 'react'
import MainNavbar from '../MainNavbar/MainNavbar'
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground'
import CurrentWeather from '../CurrentWeather/CurrentWeather'
import HourlyForecast from '../HourlyForecast/HourlyForecast'
import DailyForecast from '../DailyForecast/DailyForecast'
import DetailGrid from '../DetailGrid/DetailGrid'
import AqiCard from '../AqiCard/AqiCard'
import UvCard from '../UvCard/UvCard'
import InsightsCard from '../InsightsCard/InsightsCard'
import TrendChart from '../TrendChart/TrendChart'
import WeatherMap from '../WeatherMap/WeatherMap'
import AlertsBanner from '../AlertsBanner/AlertsBanner'
import MoonPhase from '../MoonPhase/MoonPhase'
import FavoritesBar from '../FavoritesBar/FavoritesBar'
import SettingsDrawer from '../SettingsDrawer/SettingsDrawer'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import ErrorRetry from '../ErrorRetry/ErrorRetry'
import { useWeather } from '../../hooks/useWeather'
import { useSettings } from '../../context/SettingsContext'
import { useFavorites } from '../../context/FavoritesContext'
import { getSearchResults } from '../../lib/api'
import { getCategory } from '../../lib/conditions'
import { formatTime, formatDateTime } from '../../lib/units'

const DEFAULTS = {
  city: 'beni suef',
}

const Home = () => {
  const [query, setQuery] = useState(() => localStorage.getItem('city') || DEFAULTS.city)
  const { settings } = useSettings()
  const { favorites, toggleFavorite, pushRecent } = useFavorites()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [locating, setLocating] = useState(false)

  const { status, data, error, stale, reload } = useWeather(query)

  const handleSetQuery = useCallback(value => {
    setQuery(value || DEFAULTS.city)
    localStorage.setItem('city', value || DEFAULTS.city)
  }, [])

  const handleSelectPlace = useCallback(place => {
    const name = place?.name || String(place)
    handleSetQuery(name)
    if (place?.name) pushRecent(place)
    else pushRecent({ name })
  }, [handleSetQuery, pushRecent])

  const ipFallback = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/ip-location`)
      if (!res.ok) throw new Error('ip')
      const place = await res.json()
      if (place?.name) handleSetQuery(place.name)
    } catch {
      // no fallback available — leave current city
    }
  }, [handleSetQuery])

  const handleUseCurrentLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      setLocating(false)
      ipFallback()
      return
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        try {
          const results = await getSearchResults(`${latitude},${longitude}`, 1)
          const place = results[0]
          handleSetQuery(place?.name || `${latitude},${longitude}`)
        } catch {
          handleSetQuery(`${latitude},${longitude}`)
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        ipFallback()
      },
      { timeout: 8000 }
    )
  }

  const category = data?.current ? getCategory(data.current.condition.code) : 'clear'
  const location = data?.location
  const today = data?.forecast?.forecastday?.[0]
  const current = data?.current
  const isFavorite = Boolean(location && favorites.some(f => String(f.name).toLowerCase() === String(location.name).toLowerCase()))

  const handleToggleFavorite = () => {
    if (!location) return
    toggleFavorite({ name: location.name, region: location.region, country: location.country, lat: location.lat, lon: location.lon })
    pushRecent({ name: location.name, region: location.region, country: location.country, lat: location.lat, lon: location.lon })
  }

  const hourlyEntries = today?.hour?.map(h => ({
    label: formatTime(h.time, settings.hourFormat).replace(/:00|:30/g, ''),
    value: h.temp_c,
  }))

  const weeklyBand = data?.forecast?.forecastday?.map((fd, i) => ({
    label: i === 0 ? 'Today' : new Date(`${fd.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' }),
    high: fd.day.maxtemp_c,
    low: fd.day.mintemp_c,
  }))

  const lastUpdated = location?.localtime_epoch
    ? formatDateTime(new Date((location.localtime_epoch) * 1000), settings.hourFormat).time
    : null

  return (
    <>
      <AnimatedBackground category={category} isDay={data?.current?.is_day === 1} code={data?.current?.condition?.code} />
      <MainNavbar
        query={query}
        setQuery={handleSetQuery}
        onSelectPlace={handleSelectPlace}
        onUseCurrentLocation={handleUseCurrentLocation}
        onOpenSettings={() => setDrawerOpen(true)}
        locating={locating}
      />
      <main className="app-main">
        <div className="container position-relative">
          {status === 'loading' && !stale && <SkeletonLoader />}
          {status === 'error' && !data && <ErrorRetry error={error} onRetry={reload} />}
          {stale && error && <ErrorRetry compact error={error} onRetry={reload} />}
          {data && (
            <>
              {lastUpdated && (
                <p className="text-muted small text-end mb-2">Last updated {lastUpdated}</p>
              )}
              <FavoritesBar currentName={location.name} onSelect={handleSelectPlace} />
              <AlertsBanner alerts={data.alerts} settings={settings} />

              <div className="row g-3 g-lg-4">
                <div className="col-lg-8 d-flex flex-column gap-3">
                  <CurrentWeather
                    data={data}
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    settings={settings}
                  />
                  <InsightsCard current={current} day={today?.day} />
                  <HourlyForecast hours={today?.hour} settings={settings} />
                  <div className="row g-3">
                    <div className="col-md-6">
                      <TrendChart
                        title="24-hour temperature"
                        icon="fa-solid fa-temperature-quarter"
                        iconColor="#FF7043"
                        color="#FF7043"
                        entries={hourlyEntries}
                        labelEvery={3}
                      />
                    </div>
                    <div className="col-md-6">
                      <TrendChart
                        title="Daily high / low"
                        icon="fa-solid fa-temperature-arrow-up"
                        iconColor="#26A5EB"
                        color="#FFC107"
                        band={weeklyBand}
                      />
                    </div>
                  </div>
                  <WeatherMap lat={location.lat} lon={location.lon} name={location.name} />
                  <DetailGrid current={current} today={today} settings={settings} />
                </div>
                <div className="col-lg-4 d-flex flex-column gap-3">
                  <DailyForecast forecastdays={data.forecast.forecastday} settings={settings} />
                  <div className="row g-3">
                    <div className="col-md-6 col-lg-12">
                      <AqiCard airQuality={current.air_quality} />
                    </div>
                    <div className="col-md-6 col-lg-12">
                      <UvCard uv={current.uv} />
                    </div>
                  </div>
                  <MoonPhase astro={today?.astro} settings={settings} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <SettingsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <footer className="text-center text-muted small py-4 mt-4 position-relative">
        Premium Weather · Powered by WeatherAPI & RainViewer
      </footer>
    </>
  )
}

export default Home