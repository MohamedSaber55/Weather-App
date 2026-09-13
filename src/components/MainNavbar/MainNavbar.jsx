import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { useSettings } from '../../context/SettingsContext'
import icon from '../../WeatherIcon.png'

const MainNavbar = ({ query, setQuery, onSelectPlace, onUseCurrentLocation, onOpenSettings, locating }) => {
  const { settings, update } = useSettings()

  return (
    <>
      <nav className="navbar navbar-expand-xl bg-body-tertiary shadow-sm">
        <div className="container d-flex flex-nowrap justify-content-between align-items-center gap-2 gap-md-3">
          <Link className="navbar-brand d-flex align-items-center" to="/" aria-label="Weather App home">
            <img className="navIcon me-2" src={icon} alt="" />
            <span className="fw-bold d-none d-md-inline">WEATHER</span>
          </Link>

          <div className="d-flex flex-grow-1 justify-content-end align-items-center gap-2" style={{ maxWidth: '720px' }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSelect={onSelectPlace}
              placeholder="Search a city…"
            />
            <button
              className="btn btn-outline-secondary shadow-sm d-flex align-items-center justify-content-center px-2 px-md-3"
              onClick={onUseCurrentLocation}
              disabled={locating}
              title="Use my current location"
              aria-label="Use my current location"
            >
              <i className={`fa-solid ${locating ? 'fa-circle-notch fa-spin' : 'fa-location-crosshairs'}`} />
              <span className="d-none d-md-inline ms-1">Current</span>
            </button>
            <button
              className="btn btn-outline-secondary shadow-sm px-2 px-md-3"
              onClick={() => update({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              title="Toggle theme"
              aria-label="Toggle light or dark theme"
            >
              <i className={`fa-solid ${settings.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>
            <button
              className="btn btn-outline-secondary shadow-sm px-2 px-md-3"
              onClick={onOpenSettings}
              title="Settings"
              aria-label="Open settings"
            >
              <i className="fa-solid fa-gear" />
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default MainNavbar