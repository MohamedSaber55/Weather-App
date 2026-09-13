/* Premium Weather service worker */
const CACHE = 'weather-v1'
const SHELL = [self.location.origin + '/', self.location.origin + '/manifest.json', self.location.origin + '/WeatherIcon.png']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => Promise.allSettled(SHELL.map(u => cache.add(u)))).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // App shell / navigation: network-first, fall back to cache (offline)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone()
          caches.open(CACHE).then(c => c.put(self.location.origin + '/', copy))
          return res
        })
        .catch(() => caches.match(self.location.origin + '/'))
    )
    return
  }

  // Same-origin static assets: cache-first (our hashed build)
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

  // Map tiles + rain radar: cache-first with an LRU-friendly approach (stale-while-revalidate not needed)
  if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tilecache.rainviewer.com')) {
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