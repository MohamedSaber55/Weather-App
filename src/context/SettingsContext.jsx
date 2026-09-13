import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DEFAULTS = {
  tempUnit: 'C',
  speedUnit: 'kmh',
  distanceUnit: 'km',
  pressureUnit: 'hPa',
  hourFormat: 24,
  theme: 'dark',
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