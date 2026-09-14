/* Premium Weather service worker — scope-aware */

const CACHE = 'weather-v2'

self.addEventListener('install', event => {
  const scope = self.registration.scope // e.g. https://user.github.io/Weather-App/
  const shell = [scope, scope + 'manifest.json', scope + 'WeatherIcon.png']

  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(shell.map(u => cache.add(u)))
    ).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Navigation: network-first, fall back to the cached shell for offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone()
          caches.open(CACHE).then(c => c.put(event.request, copy))
          return res
        })
        .catch(() => caches.match(self.registration.scope))
    )
    return
  }

  // Same-origin static assets: cache-first (CRA-hashed filenames)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(hit => {
        if (hit) return hit
        return fetch(event.request).then(res => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then(c => c.put(event.request, copy))
          }
          return res
        })
      })
    )
    return
  }

  // Map tiles (OSM + RainViewer): cache-first
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('tilecache.rainviewer.com')
  ) {
    event.respondWith(
      caches.match(event.request).then(hit => {
        const fetchAndCache = fetch(event.request).then(res => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then(c => c.put(event.request, copy))
          }
          return res
        })
        return hit || fetchAndCache
      })
    )
  }
})