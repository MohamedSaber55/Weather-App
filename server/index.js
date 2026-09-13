'use strict'

require('express')
const express = require('express')
const axios = require('axios')
const path = require('node:path')
const fs = require('node:fs')
const { rateLimit } = require('express-rate-limit')
const { TTLCache } = require('./cache')

if (process.env.WEATHER_API_KEY) {
  // key already provided by the host environment
} else {
  try {
    process.loadEnvFile(path.join(__dirname, '.env'))
  } catch {
    // no local .env — rely on host env vars
  }
}

const API_KEY = process.env.WEATHER_API_KEY
const PORT = process.env.PORT || 5000
const UPSTREAM = 'https://api.weatherapi.com/v1'

if (!API_KEY || API_KEY === 'your_weatherapi_key_here') {
  console.error('✖ WEATHER_API_KEY is not set. Copy server/.env.example to server/.env and fill it in.')
}

const app = express()
app.disable('x-powered-by')

const weatherCache = new TTLCache({ ttlMs: 30 * 60 * 1000, maxSize: 300 })
const geocache = new TTLCache({ ttlMs: 12 * 60 * 60 * 1000, maxSize: 300 })

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a minute.' },
})

const upstreamError = (err, res) => {
  const status = err.response?.status || 502
  const message =
    err.response?.data?.error?.message ||
    (status === 502 ? 'Upstream weather service unavailable.' : 'Weather request failed.')
  console.error(`Upstream error ${status}:`, err.response?.data || err.message)
  res.status(status).json({ error: message })
}

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  const origin = process.env.CORS_ORIGIN
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET')
  }
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(API_KEY && API_KEY !== 'your_weatherapi_key_here'),
    time: new Date().toISOString(),
  })
})

app.get('/api/weather', limiter, async (req, res) => {
  if (!API_KEY || API_KEY === 'your_weatherapi_key_here') {
    return res.status(500).json({ error: 'Server is not configured with a WeatherAPI key.' })
  }
  const { q } = req.query
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 7, 1), 10)
  const aqi = req.query.aqi !== 'no' ? 'yes' : 'no'
  const alerts = req.query.alerts !== 'no' ? 'yes' : 'no'
  if (!q || String(q).trim().length === 0) {
    return res.status(400).json({ error: 'Missing "q" query parameter.' })
  }
  if (String(q).length > 200) {
    return res.status(400).json({ error: '"q" is too long.' })
  }

  const cacheKey = `weather:${String(q).trim().toLowerCase()}:${days}:${aqi}:${alerts}`
  try {
    const { fromCache, value } = await weatherCache.getOrFetch(
      cacheKey,
      async () => {
        const { data } = await axios.get(`${UPSTREAM}/forecast.json`, {
          params: {
            key: API_KEY,
            q,
            days,
            aqi,
            alerts,
          },
          timeout: 15000,
        })
        return data
      },
      { ttlMs: 30 * 60 * 1000 }
    )
    res.setHeader('X-Cache', fromCache ? 'HIT' : 'MISS')
    res.setHeader('Cache-Control', 'public, max-age=900')
    res.json(value)
  } catch (err) {
    upstreamError(err, res)
  }
})

app.get('/api/search', limiter, async (req, res) => {
  const { q } = req.query
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 10)
  if (!q || String(q).trim().length === 0) {
    return res.status(400).json({ error: 'Missing "q" query parameter.' })
  }
  if (String(q).length > 200) {
    return res.status(400).json({ error: '"q" is too long.' })
  }

  const cacheKey = `search:${String(q).trim().toLowerCase()}:${limit}`
  try {
    const { fromCache, value } = await geocache.getOrFetch(
      cacheKey,
      async () => {
        const { data } = await axios.get(`${UPSTREAM}/search.json`, {
          params: { key: API_KEY, q, limit },
          timeout: 10000,
        })
        return data
      },
      { ttlMs: 12 * 60 * 60 * 1000 }
    )
    res.setHeader('X-Cache', fromCache ? 'HIT' : 'MISS')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.json(value)
  } catch (err) {
    upstreamError(err, res)
  }
})

app.get('/api/ip-location', async (req, res) => {
  // Geolocation-by-IP as a fallback when the browser refuses coordinates.
  // `ip-addr` means the proxy/server IP — only usable when the client is the requester.
  const addr = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || ''
  if (!addr || addr === '::1' || addr === '127.0.0.1') {
    return res.status(400).json({ error: 'Cannot determine client IP.' })
  }
  try {
    const { data } = await axios.get(`${UPSTREAM}/ip.json`, {
      params: { key: API_KEY, q: addr },
      timeout: 10000,
    })
    res.setHeader('Cache-Control', 'public, max-age=600')
    res.json({ name: data.city, region: data.region, country: data.country, lat: data.lat, lon: data.lon })
  } catch (err) {
    upstreamError(err, res)
  }
})

const buildDir = path.join(__dirname, '..', 'build')
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/')) {
      return res.sendFile(path.join(buildDir, 'index.html'))
    }
    next()
  })
  console.log('▶ Serving frontend from ./build')
}

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error.' })
})

app.listen(PORT, () => {
  const configured = API_KEY && API_KEY !== 'your_weatherapi_key_here'
  console.log(`▶ Weather API proxy listening on http://localhost:${PORT}`)
  console.log(configured ? '✓ WeatherAPI key configured' : '⚠ WeatherAPI key missing — set WEATHER_API_KEY')
})