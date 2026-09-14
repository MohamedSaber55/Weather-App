import React, { useCallback, useEffect, useState } from 'react'
import Header from '../Header/Header'
import AlertsBanner from '../AlertsBanner/AlertsBanner'
import TemperatureTile from '../TemperatureTile/TemperatureTile'
import ConditionTile from '../ConditionTile/ConditionTile'
import WindTile from '../WindTile/WindTile'
import HumidityTile from '../HumidityTile/HumidityTile'
import PressureTile from '../PressureTile/PressureTile'
import TempChartTile from '../TempChartTile/TempChartTile'
import ForecastTile from '../ForecastTile/ForecastTile'
import RadarTile from '../RadarTile/RadarTile'
import AirQualityTile from '../AirQualityTile/AirQualityTile'
import UvTile from '../UvTile/UvTile'
import SunTile from '../SunTile/SunTile'
import MoonTile from '../MoonTile/MoonTile'
import AdvisoriesTile from '../AdvisoriesTile/AdvisoriesTile'
import SettingsDrawer from '../SettingsDrawer/SettingsDrawer'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import ErrorRetry from '../ErrorRetry/ErrorRetry'
import { Icon } from '../Icons/Icons'
import { useWeather } from '../../hooks/useWeather'
import { useSettings } from '../../context/SettingsContext'
import { useFavorites } from '../../context/FavoritesContext'
import { getSearchResults } from '../../lib/api'
import { addMinutes, clockHours, dateStamp, formatTime, speedLabel } from '../../lib/units'

const DEFAULT_CITY = 'beni suef'
const REFRESH_MS = 10 * 60 * 1000

// WeatherAPI accepts an id, "lat,lon" or a plain name — prefer the most precise one
function placeQuery(place) {
  if (!place) return DEFAULT_CITY
  if (place.id) return `id:${place.id}`
  if (typeof place.lat === 'number' && typeof place.lon === 'number') return `${place.lat},${place.lon}`
  return place.name || String(place)
}

const Home = () => {
  const [query, setQuery] = useState(() => {
    try {
      return localStorage.getItem('city') || DEFAULT_CITY
    } catch {
      return DEFAULT_CITY
    }
  })
  const { settings } = useSettings()
  const { favorites, toggleFavorite, pushRecent } = useFavorites()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [notice, setNotice] = useState(null)

  const { status, data, error, stale, reload, refresh } = useWeather(query)

  useEffect(() => {
    const id = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') refresh()
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh])

  const applyQuery = useCallback(value => {
    const next = value || DEFAULT_CITY
    setQuery(next)
    try {
      localStorage.setItem('city', next)
    } catch {
      // private mode — the city just will not be remembered
    }
  }, [])

  const handleSelectPlace = useCallback(
    place => {
      applyQuery(placeQuery(place))
      pushRecent({
        name: place?.name || String(place),
        region: place?.region,
        country: place?.country,
        lat: place?.lat,
        lon: place?.lon,
        id: place?.id,
      })
    },
    [applyQuery, pushRecent]
  )

  const handleUseCurrentLocation = () => {
    setNotice(null)
    if (!navigator.geolocation) {
      setNotice('This browser cannot share your location.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords
        try {
          const results = await getSearchResults(`${latitude},${longitude}`, 1)
          handleSelectPlace(results[0] || { name: `${latitude},${longitude}` })
        } catch {
          applyQuery(`${latitude},${longitude}`)
        } finally {
          setLocating(false)
          setDrawerOpen(false)
        }
      },
      () => {
        setLocating(false)
        setNotice('Location access was blocked. Search for a city instead.')
      },
      { timeout: 8000 }
    )
  }

  const location = data?.location
  const current = data?.current
  const days = data?.forecast?.forecastday || []
  const today = days[0]
  const nowHour = location ? clockHours(location.localtime) : null
  const currentHour = today?.hour?.[Math.floor(nowHour ?? 0)]

  const isFavorite = Boolean(
    location && favorites.some(f => String(f.name).toLowerCase() === String(location.name).toLowerCase())
  )

  const handleToggleFavorite = () => {
    if (!location) return
    toggleFavorite({
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    })
  }

  const updated = current?.last_updated || location?.localtime

  return (
    <div className="wx-app">
      <Header
        location={location}
        favorites={favorites}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onSelectPlace={handleSelectPlace}
        onUseCurrentLocation={handleUseCurrentLocation}
        locating={locating}
        onOpenSettings={() => setDrawerOpen(true)}
      />

      <div className="statusbar">
        <span>{location ? `${dateStamp(location.localtime)} · ${formatTime(location.localtime, settings.hourFormat)} local` : 'Connecting…'}</span>
        <span className="statusbar-live">
          <span className={`live-dot${status === 'loading' ? ' is-busy' : ''}`} aria-hidden="true" />
          {updated
            ? `Updated ${formatTime(updated, settings.hourFormat)} · Next ${addMinutes(updated, 15, settings.hourFormat)}`
            : 'Fetching…'}
        </span>
      </div>

      {notice && (
        <div className="notice" role="status">
          <Icon name="alert" size={14} />
          <span className="notice-text">{notice}</span>
          <button type="button" className="ghost-btn" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div>
      )}

      <main className="wx-main">
        {status === 'loading' && !data && <SkeletonLoader />}
        {status === 'error' && !data && <ErrorRetry error={error} onRetry={reload} />}

        {data && current && today && (
          <>
            {error && <ErrorRetry compact error={error} onRetry={reload} />}
            <AlertsBanner alerts={data.alerts} settings={settings} />

            <div className={`grid${stale ? ' is-stale' : ''}`}>
              <TemperatureTile current={current} day={today.day} settings={settings} />
              <ConditionTile current={current} hour={currentHour} settings={settings} />
              <WindTile current={current} settings={settings} />
              <HumidityTile current={current} settings={settings} />
              <PressureTile current={current} settings={settings} />
              <TempChartTile day={today} current={current} location={location} settings={settings} />
              <ForecastTile days={days} settings={settings} />
              <RadarTile lat={location.lat} lon={location.lon} name={location.name} />
              <AirQualityTile airQuality={current.air_quality} />
              <UvTile uv={current.uv} hours={today.hour} nowHour={nowHour} settings={settings} />
              <SunTile astro={today.astro} localtime={location.localtime} settings={settings} />
              <MoonTile astro={today.astro} settings={settings} />
              <AdvisoriesTile current={current} day={today.day} />
            </div>
          </>
        )}
      </main>

      <footer className="wx-footer">
        <span>Src weatherapi.com · Radar rainviewer · Map OSM</span>
        <span className="hide-mobile">
          Units °{settings.tempUnit} · {speedLabel(settings.speedUnit)} · {settings.distanceUnit} · {settings.pressureUnit} ·{' '}
          {settings.hourFormat}h
        </span>
      </footer>

      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUseCurrentLocation={handleUseCurrentLocation}
        locating={locating}
      />
    </div>
  )
}

export default Home
