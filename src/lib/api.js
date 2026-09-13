const API_URL = process.env.REACT_APP_API_URL || ''

async function handleError(response) {
  let message = `Request failed (${response.status})`
  try {
    const body = await response.json()
    if (body?.error) message = body.error
  } catch {
    // non-JSON body — keep generic message
  }
  throw new Error(message)
}

export async function getWeather(q, { days = 7, aqi = true, alerts = true } = {}) {
  const params = new URLSearchParams({ q, days: String(days) })
  if (aqi) params.set('aqi', 'yes')
  if (alerts) params.set('alerts', 'yes')
  const res = await fetch(`${API_URL}/api/weather?${params.toString()}`)
  if (!res.ok) await handleError(res)
  return res.json()
}

export async function getSearchResults(q, limit = 6) {
  const params = new URLSearchParams({ q, limit: String(limit) })
  const res = await fetch(`${API_URL}/api/search?${params.toString()}`)
  if (!res.ok) await handleError(res)
  return res.json()
}