import { useCallback, useEffect, useRef, useState } from 'react'
import { getWeather } from '../lib/api'
import { loadCachedWeather, saveCachedWeather } from '../lib/weatherCache'

const TTL = 5 * 60 * 1000

const browserOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false

export function useWeather(query, language = 'en') {
  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: null,
    stale: false,
    cachedAt: null,
    offline: false,
  })
  const [reloadKey, setReloadKey] = useState(0)
  const cacheRef = useRef(new Map())
  const silentRef = useRef(false)

  const key = `${String(query || '').trim().toLowerCase()}|${language}`

  useEffect(() => {
    if (!query) return undefined
    const controller = new AbortController()
    let cancelled = false

    // a silent refresh keeps the current dashboard on screen while new data loads
    const silent = silentRef.current
    silentRef.current = false

    const cached = cacheRef.current.get(key)
    if (cached && Date.now() - cached.ts < TTL) {
      setState({ status: 'success', data: cached.data, error: null, stale: false, cachedAt: cached.ts, offline: false })
      return undefined
    }

    setState(prev => ({
      status: 'loading',
      data: cached ? cached.data : prev.data,
      error: null,
      stale: Boolean(cached) || (silent && Boolean(prev.data)),
      cachedAt: cached ? cached.ts : prev.cachedAt,
      offline: false,
    }))

    // show what was saved last time before the network answers
    if (!cached) {
      const entry = loadCachedWeather(key)
      if (entry) {
        setState(prev =>
          prev.data
            ? prev
            : { status: 'success', data: entry.data, error: null, stale: true, cachedAt: entry.ts, offline: browserOffline() }
        )
      }
    }

    const fallback = () => cached || loadCachedWeather(key)

    if (browserOffline()) {
      const entry = fallback()
      setState(prev => ({
        status: entry || prev.data ? 'success' : 'error',
        data: entry ? entry.data : prev.data,
        error: new Error('No internet connection'),
        stale: true,
        cachedAt: entry ? entry.ts : prev.cachedAt,
        offline: true,
      }))
      return () => controller.abort()
    }

    getWeather(query, { days: 7, aqi: true, alerts: true, lang: language, signal: controller.signal })
      .then(data => {
        if (controller.signal.aborted || cancelled) return
        cacheRef.current.set(key, { data, ts: Date.now() })
        saveCachedWeather(key, data)
        setState({ status: 'success', data, error: null, stale: false, cachedAt: Date.now(), offline: false })
      })
      .catch(err => {
        if (controller.signal.aborted || cancelled) return
        const entry = fallback()
        const offline = browserOffline()
        setState(prev => ({
          status: entry || prev.data ? 'success' : 'error',
          data: entry ? entry.data : prev.data,
          error: offline ? new Error('No internet connection') : err,
          stale: true,
          cachedAt: entry ? entry.ts : prev.cachedAt,
          offline,
        }))
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [key, query, language, reloadKey])

  const reload = useCallback(() => {
    cacheRef.current.delete(key)
    setReloadKey(k => k + 1)
  }, [key])

  const refresh = useCallback(() => {
    silentRef.current = true
    cacheRef.current.delete(key)
    setReloadKey(k => k + 1)
  }, [key])

  return { ...state, reload, refresh }
}

export default useWeather
