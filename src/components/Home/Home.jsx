import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import PlacesPanel from '../PlacesPanel/PlacesPanel'
import MapPicker from '../MapPicker/MapPicker'
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader'
import ErrorRetry from '../ErrorRetry/ErrorRetry'
import { Icon } from '../Icons/Icons'
import { useWeather } from '../../hooks/useWeather'
import { useI18n, useSettings } from '../../context/SettingsContext'
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
  const { settings } = useSettings()
  const { t, days: dayNames, months } = useI18n()
  const { favorites, defaultPlace, toggleFavorite, addFavorite, pushRecent } = useFavorites()
  const [query, setQuery] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_default_place')
      if (saved) return placeQuery(JSON.parse(saved))
      return localStorage.getItem('city') || DEFAULT_CITY
    } catch {
      return DEFAULT_CITY
    }
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [placesOpen, setPlacesOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [notice, setNotice] = useState(null)
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine !== false))
  const wasOffline = useRef(false)

  const { status, data, error, stale, cachedAt, offline, reload, refresh } = useWeather(query, settings.language)
  const noConnection = offline || !online

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible' && !noConnection) refresh()
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [refresh, noConnection])

  // catch up as soon as the connection returns
  useEffect(() => {
    if (wasOffline.current && !noConnection) refresh()
    wasOffline.current = noConnection
  }, [noConnection, refresh])

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

  const handleAddPlace = useCallback(
    place => {
      addFavorite(place)
      handleSelectPlace(place)
    },
    [addFavorite, handleSelectPlace]
  )

  const handleUseCurrentLocation = () => {
    setNotice(null)
    if (!navigator.geolocation) {
      setNotice(t('notice.locationUnsupported'))
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
        setNotice(t('notice.locationDenied'))
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

  // "4 min ago" / "2 h ago" — how old the reading on screen is
  const ago = timestamp => {
    if (!timestamp) return t('time.unknown')
    const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000))
    if (minutes < 1) return t('time.justNow')
    if (minutes < 60) return t('time.minutes', { count: minutes })
    const hours = Math.round(minutes / 60)
    if (hours < 24) return t('time.hours', { count: hours })
    const dayCount = Math.round(hours / 24)
    return dayCount === 1 ? t('time.yesterday') : t('time.days', { count: dayCount })
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
        onOpenPlaces={() => setPlacesOpen(true)}
        defaultName={defaultPlace?.name}
      />

      <div className="statusbar">
        <span>
          {location
            ? `${dateStamp(location.localtime, { days: dayNames, months })} · ${formatTime(location.localtime, settings.hourFormat)} ${t('status.local')}`
            : t('status.connecting')}
        </span>
        <span className="statusbar-live">
          <span
            className={`live-dot${status === 'loading' ? ' is-busy' : ''}${noConnection ? ' is-offline' : ''}`}
            aria-hidden="true"
          />
          {noConnection
            ? t('status.offline', { age: ago(cachedAt) })
            : updated
              ? `${t('status.updated', { time: formatTime(updated, settings.hourFormat) })} · ${t('status.next', { time: addMinutes(updated, 15, settings.hourFormat) })}`
              : t('status.fetching')}
        </span>
      </div>

      {notice && (
        <div className="notice" role="status">
          <Icon name="alert" size={14} />
          <span className="notice-text">{notice}</span>
          <button type="button" className="ghost-btn" onClick={() => setNotice(null)}>
            {t('error.dismiss')}
          </button>
        </div>
      )}

      {noConnection && data && (
        <div className="notice" role="status">
          <Icon name="alert" size={14} />
          <span className="notice-text">{t('offline.banner', { age: ago(cachedAt) })}</span>
          <button type="button" className="ghost-btn" onClick={reload}>
            <Icon name="rotate" size={12} />
            {t('error.retry')}
          </button>
        </div>
      )}

      <main className="wx-main">
        {status === 'loading' && !data && <SkeletonLoader />}
        {status === 'error' && !data && <ErrorRetry error={error} onRetry={reload} offline={noConnection} />}

        {data && current && today && (
          <>
            {error && !noConnection && <ErrorRetry compact error={error} onRetry={reload} />}
            <AlertsBanner alerts={data.alerts} settings={settings} />

            <div className={`grid${stale ? ' is-stale' : ''}`}>
              <TemperatureTile current={current} day={today.day} settings={settings} />
              <ConditionTile current={current} hour={currentHour} settings={settings} />
              <WindTile current={current} settings={settings} />
              <HumidityTile current={current} settings={settings} />
              <PressureTile current={current} settings={settings} />
              <TempChartTile day={today} current={current} location={location} settings={settings} />
              <ForecastTile days={days} settings={settings} />
              <RadarTile lat={location.lat} lon={location.lon} name={location.name} offline={noConnection} />
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
        <span>{t('footer.source')}</span>
        <span className="hide-mobile">
          °{settings.tempUnit} · {speedLabel(settings.speedUnit)} · {settings.distanceUnit} · {settings.pressureUnit} ·{' '}
          {settings.hourFormat}h
        </span>
      </footer>

      <PlacesPanel
        open={placesOpen}
        onClose={() => setPlacesOpen(false)}
        onSelectPlace={handleSelectPlace}
        currentName={location?.name}
        onAddBySearch={() => {
          setPlacesOpen(false)
          document.querySelector('.search-input')?.focus()
        }}
        onAddByMap={() => {
          setPlacesOpen(false)
          setMapOpen(true)
        }}
      />

      <MapPicker
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        onPick={handleAddPlace}
        initial={location ? { lat: location.lat, lon: location.lon } : null}
      />

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
