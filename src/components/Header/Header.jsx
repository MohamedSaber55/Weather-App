import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import { Icon, Logo } from '../Icons/Icons'
import { useSettings } from '../../context/SettingsContext'
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
}) => {
  const { settings, update } = useSettings()
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

  const name = location?.name || 'Locating'
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

      <nav className="topbar-tabs" aria-label="Saved locations">
        {tabs.map((place, i) => (
          <button
            key={`${place.name}-${place.lat}-${i}`}
            type="button"
            className={`tab${sameName(place.name, location?.name) ? ' is-active' : ''}`}
            onClick={() => onSelectPlace(place)}
            aria-current={sameName(place.name, location?.name) ? 'true' : undefined}
          >
            {place.name}
          </button>
        ))}
        <button
          type="button"
          className={`tab tab-save${isFavorite ? ' is-saved' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          disabled={!location}
          title={isFavorite ? 'Remove from saved locations' : 'Save this location'}
        >
          <Icon name="star" size={12} fill={isFavorite ? 'currentColor' : 'none'} />
          {isFavorite ? 'Saved' : 'Save'}
        </button>
      </nav>

      <div className="topbar-tools">
        <SearchBar inputRef={inputRef} onSelect={onSelectPlace} open={searchOpen} onClose={() => setSearchOpen(false)} />
        <div className="unit-toggle hide-mobile" role="group" aria-label="Temperature unit">
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
          aria-label="Open search"
        >
          <Icon name="search" size={16} />
        </button>
        <button
          type="button"
          className="icon-btn hide-mobile"
          onClick={onUseCurrentLocation}
          disabled={locating}
          aria-label="Use my current location"
          title="Use my current location"
        >
          <Icon name={locating ? 'rotate' : 'locate'} size={16} className={locating ? 'is-spinning' : ''} />
        </button>
        <button
          type="button"
          className="icon-btn hide-mobile"
          onClick={() => update({ theme: isDark ? 'light' : 'dark' })}
          aria-label="Toggle light or dark theme"
          title="Toggle theme"
        >
          <Icon name={isDark ? 'moon' : 'sun'} size={16} />
        </button>
        <button type="button" className="icon-btn" onClick={onOpenSettings} aria-label="Open settings" title="Settings">
          <Icon name="sliders" size={16} />
        </button>
      </div>
    </header>
  )
}

export default Header
