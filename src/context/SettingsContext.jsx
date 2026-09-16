import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { calendar, isRtl, translator } from '../lib/i18n'

const DEFAULTS = {
  tempUnit: 'C',
  speedUnit: 'kmh',
  distanceUnit: 'km',
  pressureUnit: 'hPa',
  hourFormat: 24,
  theme: 'dark',
  language: 'en',
}

const SettingsContext = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem('weather_settings')
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load)

  useEffect(() => {
    localStorage.setItem('weather_settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.bsTheme = settings.theme
    root.dataset.theme = settings.theme
  }, [settings.theme])

  // language drives both the strings and the page direction
  useEffect(() => {
    const root = document.documentElement
    root.lang = settings.language
    root.dir = isRtl(settings.language) ? 'rtl' : 'ltr'
  }, [settings.language])

  const update = useMemo(() => (patch) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo(() => ({ settings, update }), [settings, update])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}

/** t() for the current language, plus its direction and month/day names */
export function useI18n() {
  const { settings } = useSettings()
  return useMemo(
    () => ({
      t: translator(settings.language),
      language: settings.language,
      rtl: isRtl(settings.language),
      ...calendar(settings.language),
    }),
    [settings.language]
  )
}
