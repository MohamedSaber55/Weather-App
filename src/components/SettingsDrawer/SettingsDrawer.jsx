import React, { useEffect } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { Icon } from '../Icons/Icons'

const Choice = ({ label, options, value, onChange }) => (
  <div className="setting">
    <p className="setting-label">{label}</p>
    <div className="segmented" role="group" aria-label={label}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          className={value === o.value ? 'is-active' : ''}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
)

const SettingsDrawer = ({ open, onClose, onUseCurrentLocation, locating }) => {
  const { settings, update } = useSettings()

  useEffect(() => {
    if (!open) return undefined
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div className={`drawer-backdrop${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label="Settings">
        <header className="drawer-head">
          <h2 className="tile-label">Settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close settings">
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="drawer-body">
          <Choice
            label="Theme"
            value={settings.theme}
            onChange={v => update({ theme: v })}
            options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
          />
          <Choice
            label="Temperature"
            value={settings.tempUnit}
            onChange={v => update({ tempUnit: v })}
            options={[{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }]}
          />
          <Choice
            label="Wind speed"
            value={settings.speedUnit}
            onChange={v => update({ speedUnit: v })}
            options={[{ value: 'kmh', label: 'km/h' }, { value: 'mph', label: 'mph' }]}
          />
          <Choice
            label="Distance"
            value={settings.distanceUnit}
            onChange={v => update({ distanceUnit: v })}
            options={[{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }]}
          />
          <Choice
            label="Pressure"
            value={settings.pressureUnit}
            onChange={v => update({ pressureUnit: v })}
            options={[{ value: 'hPa', label: 'hPa' }, { value: 'inHg', label: 'inHg' }]}
          />
          <Choice
            label="Clock"
            value={settings.hourFormat}
            onChange={v => update({ hourFormat: v })}
            options={[{ value: 24, label: '24 h' }, { value: 12, label: '12 h' }]}
          />

          <button type="button" className="btn drawer-locate" onClick={onUseCurrentLocation} disabled={locating}>
            <Icon name={locating ? 'rotate' : 'locate'} size={13} className={locating ? 'is-spinning' : ''} />
            {locating ? 'Locating…' : 'Use my current location'}
          </button>
        </div>
      </aside>
    </>
  )
}

export default SettingsDrawer
