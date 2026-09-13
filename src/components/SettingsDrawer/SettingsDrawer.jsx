import React from 'react'
import { useSettings } from '../../context/SettingsContext'

const Choice = ({ label, options, value, onChange }) => (
  <div className="mb-3">
    <p className="small text-muted text-uppercase fw-semibold mb-1">{label}</p>
    <div className="btn-group w-100" role="group" aria-label={label}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          className={`btn btn-sm ${value === o.value ? 'btn-warning' : 'btn-outline-secondary'}`}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  </div>
)

const SettingsDrawer = ({ open, onClose }) => {
  const { settings, update } = useSettings()

  return (
    <>
      <div className={`drawer-backdrop${open ? ' show' : ''}`} onClick={onClose} />
      <aside className={`settings-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0"><i className="fa-solid fa-sliders me-2" />Settings</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Close settings">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <Choice
          label="Theme"
          value={settings.theme}
          onChange={v => update({ theme: v })}
          options={[
            { value: 'dark', label: '🌙 Dark' },
            { value: 'light', label: '☀️ Light' },
          ]}
        />
        <Choice
          label="Temperature"
          value={settings.tempUnit}
          onChange={v => update({ tempUnit: v })}
          options={[
            { value: 'C', label: '°Celsius' },
            { value: 'F', label: '°Fahrenheit' },
          ]}
        />
        <Choice
          label="Wind speed"
          value={settings.speedUnit}
          onChange={v => update({ speedUnit: v })}
          options={[
            { value: 'kmh', label: 'km/h' },
            { value: 'mph', label: 'mph' },
          ]}
        />
        <Choice
          label="Distance"
          value={settings.distanceUnit}
          onChange={v => update({ distanceUnit: v })}
          options={[
            { value: 'km', label: 'Kilometers' },
            { value: 'mi', label: 'Miles' },
          ]}
        />
        <Choice
          label="Pressure"
          value={settings.pressureUnit}
          onChange={v => update({ pressureUnit: v })}
          options={[
            { value: 'hPa', label: 'hPa' },
            { value: 'inHg', label: 'inHg' },
          ]}
        />
        <Choice
          label="Clock"
          value={settings.hourFormat}
          onChange={v => update({ hourFormat: v })}
          options={[
            { value: 24, label: '24-hour' },
            { value: 12, label: '12-hour' },
          ]}
        />
      </aside>
    </>
  )
}

export default SettingsDrawer