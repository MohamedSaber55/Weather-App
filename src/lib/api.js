import { WEATHER_API_KEY } from './config'

const BASE = 'https://api.weatherapi.com/v1'

async function handleError(response) {
  let message = `Request failed (${response.status})`
  try {
    const body = await response.json()
    if (body?.error) message = body.error.message || body.error
  } catch {
    // non-JSON body — keep generic message
  }
  throw new Error(message)
}

export async function getWeather(q, { days = 7, aqi = true, alerts = true, signal } = {}) {
  const params = new URLSearchParams({ key: WEATHER_API_KEY, q, days: String(days) })
  if (aqi) params.set('aqi', 'yes')
  if (alerts) params.set('alerts', 'yes')
  const res = await fetch(`${BASE}/forecast.json?${params.toString()}`, { signal })
  if (!res.ok) await handleError(res)
  return res.json()
}

export async function getSearchResults(q, limit = 6) {
  const params = new URLSearchParams({ key: WEATHER_API_KEY, q, limit: String(limit) })
  const res = await fetch(`${BASE}/search.json?${params.toString()}`)
  if (!res.ok) await handleError(res)
  return res.json()
}