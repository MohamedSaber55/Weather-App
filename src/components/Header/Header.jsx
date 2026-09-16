import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import { Icon, Logo } from '../Icons/Icons'
import { useI18n, useSettings } from '../../context/SettingsContext'
import { countryCode } from '../../lib/countries'
import { coordsLabel, utcOffsetLabel } from '../../lib/units'

const sameName = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase()

const Header = ({
  location,
  favorites,
  isFavorite,
  onToggleFavorite,
  onSelectPlace,
  onUseCurrentLocation,
  locating,
  onOpenSettings,
  onOpenPlaces,
  defaultName,
}) => {
  const { settings, update } = useSettings()
  const { t } = useI18n()
  const inputRef = useRef(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const isDark = settings.theme !== 'light'

  useEffect(() => {
    const onKeyDown = e => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      e.preventDefault()
      setSearchOpen(true)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const name = location?.name || '—'
  const code = location ? countryCode(location.country) : ''
  const offset = location ? utcOffsetLabel(location.localtime, location.localtime_epoch) : null
  const coords = location ? coordsLabel(location.lat, location.lon) : ''

  const tabs = location && !isFavorite ? [{ name: location.name, lat: location.lat, lon: location.lon }, ...favorites] : favorites

  return (
    <header className="topbar">
      <div className="topbar-id">
        <Logo size={22} />
        <span className="topbar-brand">WX</span>
        <span className="topbar-divider" aria-hidden="true" />
        <h1 className="topbar-place">{code ? `${name}, ${code}` : name}</h1>
        <span className="topbar-coords hide-mobile">{[coords, offset].filter(Boolean).join(' · ')}</span>
      </div>

      <nav className="topbar-tabs" aria-label={t('places.title')}>
        {tabs.map((place, i) => (
          <button
            key={`${place.name}-${place.lat}-${i}`}
            type="button"
            className={`tab${sameName(place.name, location?.name) ? ' is-active' : ''}`}
            onClick={() => onSelectPlace(place)}
            aria-current={sameName(place.name, location?.name) ? 'true' : undefined}
          >
            {sameName(place.name, defaultName) && <Icon name="home" size={11} />}
            {place.name}
          </button>
        ))}
        <button
          type="button"
          className={`tab tab-save${isFavorite ? ' is-saved' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          disabled={!location}
          title={isFavorite ? t('header.saved') : t('header.save')}
        >
          <Icon name="star" size={12} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? t('header.saved') : t('header.save')}
        </button>
        <button type="button" className="tab tab-add" onClick={onOpenPlaces} title={t('places.open')} aria-label={t('places.open')}>
          <Icon name="plus" size={13} />
        </button>
      </nav>

      <div className="topbar-tools">
        <SearchBar inputRef={inputRef} onSelect={onSelectPlace} open={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className="unit-toggle hide-mobile" role="group" aria-label={t('settings.temperature')}>
          {['C', 'F'].map(u => (
            <button
              key={u}
              type="button"
              className={settings.tempUnit === u ? 'is-active' : ''}
              onClick={() => update({ tempUnit: u })}
              aria-pressed={settings.tempUnit === u}
            >
              °{u}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn only-mobile"
          onClick={() => {
            setSearchOpen(true)
            requestAnimationFrame(() => inputRef.current?.focus())
          }}
          aria-label={t('places.open')}
        >
          <Icon name="search" size={16} />
        </button>
        <button
          type="button"
          className="icon-btn hide-mobile"
          onClick={onUseCurrentLocation}
          disabled={locating}
          aria-label={t('header.locate')}
          title={t('header.locate')}
        >
          <Icon name={locating ? 'rotate' : 'locate'} size={16} className={locating ? 'is-spinning' : ''} />
        </button>
        <button
          type="button"
          className="icon-btn hide-mobile"
          onClick={() => update({ theme: isDark ? 'light' : 'dark' })}
          aria-label={t('header.theme')}
          title={t('header.theme')}
        >
          <Icon name={isDark ? 'moon' : 'sun'} size={16} />
        </button>
        <button type="button" className="icon-btn" onClick={onOpenSettings} aria-label={t('header.settings')} title={t('settings.title')}>
          <Icon name="sliders" size={16} />
        </button>
      </div>
    </header>
  )
}

export default Header
