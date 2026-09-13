import { useEffect, useRef, useState } from 'react'

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

    getWeatherSafe(key, controller.signal)
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

let inflight = new Map()

function getWeatherSafe(key, signal) {
  const url = `${process.env.REACT_APP_API_URL || ''}/api/weather?${new URLSearchParams({ q: key, days: '7', aqi: 'yes', alerts: 'yes' })}`

  if (inflight.has(url)) return inflight.get(url)

  const promise = fetch(url, { signal })
    .then(async res => {
      if (!res.ok) {
        let msg = `Request failed (${res.status})`
        try {
          const body = await res.json()
          if (body?.error) msg = body.error
        } catch {
          // ignore
        }
        throw new Error(msg)
      }
      return res.json()
    })
    .finally(() => inflight.delete(url))

  inflight.set(url, promise)
  return promise
}

export default useWeather