import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const FavoritesContext = createContext(null)

export function placeKey(place) {
  return `${place?.lat ?? ''},${place?.lon ?? ''},${place?.name ?? ''}`
}

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
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full/unavailable — ignore
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => load('weather_favorites', []))
  const [recents, setRecents] = useState(() => load('weather_recents', []))
  const [defaultPlace, setDefaultPlaceState] = useState(() => load('weather_default_place', null))

  const toggleFavorite = useCallback(place => {
    setFavorites(prev => {
      const exists = prev.some(f => placeKey(f) === placeKey(place))
      const next = exists ? prev.filter(f => placeKey(f) !== placeKey(place)) : [...prev, place]
      persist('weather_favorites', next)
      return next
    })
  }, [])

  const addFavorite = useCallback(place => {
    setFavorites(prev => {
      if (prev.some(f => placeKey(f) === placeKey(place))) return prev
      const next = [...prev, place]
      persist('weather_favorites', next)
      return next
    })
  }, [])

  const removeFavorite = useCallback(place => {
    setFavorites(prev => {
      const next = prev.filter(f => placeKey(f) !== placeKey(place))
      persist('weather_favorites', next)
      return next
    })
    setDefaultPlaceState(prev => {
      if (!prev || placeKey(prev) !== placeKey(place)) return prev
      persist('weather_default_place', null)
      return null
    })
  }, [])

  // the place the dashboard opens on
  const setDefaultPlace = useCallback(place => {
    setDefaultPlaceState(place)
    persist('weather_default_place', place)
    if (place) addFavorite(place)
  }, [addFavorite])

  const pushRecent = useCallback(place => {
    setRecents(prev => {
      const next = [place, ...prev.filter(p => placeKey(p) !== placeKey(place))].slice(0, 8)
      persist('weather_recents', next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ favorites, recents, defaultPlace, toggleFavorite, addFavorite, removeFavorite, setDefaultPlace, pushRecent }),
    [favorites, recents, defaultPlace, toggleFavorite, addFavorite, removeFavorite, setDefaultPlace, pushRecent]
  )
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
