import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const FavoritesContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full/unavailable — ignore
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => load('weather_favorites', []))
  const [recents, setRecents] = useState(() => load('weather_recents', []))

  const toggleFavorite = useCallback(place => {
    setFavorites(prev => {
      const exists = prev.some(f => fKey(f) === fKey(place))
      const next = exists
        ? prev.filter(f => fKey(f) !== fKey(place))
        : [...prev, place]
      persist('weather_favorites', next)
      return next
    })
  }, [])

  const pushRecent = useCallback(place => {
    setRecents(prev => {
      const next = [place, ...prev.filter(p => fKey(p) !== fKey(place))].slice(0, 8)
      persist('weather_recents', next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ favorites, recents, toggleFavorite, pushRecent }), [favorites, recents, toggleFavorite, pushRecent])
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

function fKey(place) {
  return `${place.lat ?? ''},${place.lon ?? ''},${place.name ?? ''}`
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}