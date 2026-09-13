import { useEffect, useRef, useState } from 'react'
import { getWeather } from '../lib/api'

export function useWeather(query) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null, stale: false })
  const [reloadKey, setReloadKey] = useState(0)
  const cacheRef = useRef(new Map())

  const key = String(query || '').trim().toLowerCase()

  useEffect(() => {
    if (!key) return undefined
    const controller = new AbortController()
    const TTL = 5 * 60 * 1000

    const cached = cacheRef.current.get(key)
    if (cached && Date.now() - cached.ts < TTL) {
      setState({ status: 'success', data: cached.data, error: null, stale: false })
      return undefined
    }

    setState(prev => ({
      status: cached ? 'loading' : 'loading',
      data: cached ? cached.data : prev.data,
      error: null,
      stale: Boolean(cached),
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
          status: cached ? 'success' : 'error',
          data: cached ? cached.data : prev.data,
          error: err,
          stale: Boolean(cached),
        }))
      })

    return () => controller.abort()
  }, [key, reloadKey])

  const reload = () => {
    cacheRef.current.delete(key)
    setReloadKey(k => k + 1)
  }

  return { ...state, reload }
}

export default useWeather