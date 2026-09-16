const PREFIX = 'weather_cache:'
const LAST_KEY = 'weather_cache_last'

/**
 * The last response per location, kept in localStorage so the dashboard can open
 * with real data when the browser is offline. `useWeather` keeps its own
 * in-memory cache for the session; this one survives a reload.
 */
export function saveCachedWeather(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now() }))
    localStorage.setItem(LAST_KEY, key)
  } catch {
    // quota exceeded or storage blocked — we simply lose the offline copy
  }
}

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw)
    return entry?.data ? entry : null
  } catch {
    return null
  }
}

/** Cached weather for this location, or the last one shown if that is all there is */
export function loadCachedWeather(key) {
  const exact = read(key)
  if (exact) return { ...exact, exact: true }
  try {
    const lastKey = localStorage.getItem(LAST_KEY)
    if (!lastKey || lastKey === key) return null
    const fallback = read(lastKey)
    return fallback ? { ...fallback, exact: false } : null
  } catch {
    return null
  }
}
