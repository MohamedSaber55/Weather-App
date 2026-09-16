import React, { useEffect } from 'react'
import { useI18n, useSettings } from '../../context/SettingsContext'
import { Icon } from '../Icons/Icons'
import { LANGUAGES } from '../../lib/i18n'

const Choice = ({ label, options, value, onChange }) => (
  <div className="setting">
    <p className="setting-label">{label}</p>
    <div className="segmented" role="group" aria-label={label}>
      {options.map(o => (
        <button
          key={String(o.value)}
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
  const { t } = useI18n()

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
      <aside className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label={t('settings.title')}>
        <header className="drawer-head">
          <h2 className="tile-label">{t('settings.title')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('settings.close')}>
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="drawer-body">
          <Choice
            label={t('settings.language')}
            value={settings.language}
            onChange={v => update({ language: v })}
            options={LANGUAGES}
          />
          <Choice
            label={t('settings.theme')}
            value={settings.theme}
            onChange={v => update({ theme: v })}
            options={[{ value: 'dark', label: t('settings.dark') }, { value: 'light', label: t('settings.light') }]}
          />
          <Choice
            label={t('settings.temperature')}
            value={settings.tempUnit}
            onChange={v => update({ tempUnit: v })}
            options={[{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }]}
          />
          <Choice
            label={t('settings.windSpeed')}
            value={settings.speedUnit}
            onChange={v => update({ speedUnit: v })}
            options={[{ value: 'kmh', label: 'km/h' }, { value: 'mph', label: 'mph' }]}
          />
          <Choice
            label={t('settings.distance')}
            value={settings.distanceUnit}
            onChange={v => update({ distanceUnit: v })}
            options={[{ value: 'km', label: 'km' }, { value: 'mi', label: 'mi' }]}
          />
          <Choice
            label={t('settings.pressure')}
            value={settings.pressureUnit}
            onChange={v => update({ pressureUnit: v })}
            options={[{ value: 'hPa', label: 'hPa' }, { value: 'inHg', label: 'inHg' }]}
          />
          <Choice
            label={t('settings.clock')}
            value={settings.hourFormat}
            onChange={v => update({ hourFormat: v })}
            options={[{ value: 24, label: t('settings.hours24') }, { value: 12, label: t('settings.hours12') }]}
          />

          <button type="button" className="btn drawer-locate" onClick={onUseCurrentLocation} disabled={locating}>
            <Icon name={locating ? 'rotate' : 'locate'} size={13} className={locating ? 'is-spinning' : ''} />
            {locating ? `${t('map.lookingUp')}` : t('settings.locate')}
          </button>
        </div>
      </aside>
    </>
  )
}

export default SettingsDrawer
