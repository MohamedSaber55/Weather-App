import { useCallback, useEffect, useRef, useState } from 'react'
import { getWeather } from '../lib/api'

export function useWeather(query) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null, stale: false })
  const [reloadKey, setReloadKey] = useState(0)
  const cacheRef = useRef(new Map())
  const silentRef = useRef(false)

  const key = String(query || '').trim().toLowerCase()

  useEffect(() => {
    if (!key) return undefined
    const controller = new AbortController()
    const TTL = 5 * 60 * 1000

    // a silent refresh keeps the current dashboard on screen while new data loads
    const silent = silentRef.current
    silentRef.current = false

    const cached = cacheRef.current.get(key)
    if (cached && Date.now() - cached.ts < TTL) {
      setState({ status: 'success', data: cached.data, error: null, stale: false })
      return undefined
    }

    setState(prev => ({
      status: 'loading',
      data: cached ? cached.data : prev.data,
      error: null,
      stale: Boolean(cached) || (silent && Boolean(prev.data)),
    }))

    getWeather(key, { days: 7, aqi: true, alerts: true, signal: controller.signal })
      .then(data => {
        cacheRef.current.set(key, { data, ts: Date.now() })
        if (!controller.signal.aborted) {
          setState({ status: 'success', data, error: null, stale: false })
        }
      })
      .catch(err => {
        if (controller.signal.aborted) return
        setState(prev => ({
          status: cached || (silent && prev.data) ? 'success' : 'error',
          data: cached ? cached.data : prev.data,
          error: err,
          stale: Boolean(cached) || (silent && Boolean(prev.data)),
        }))
      })

    return () => controller.abort()
  }, [key, reloadKey])

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
