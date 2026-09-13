'use strict'

class TTLCache {
  constructor({ ttlMs = 30 * 60 * 1000, maxSize = 250 } = {}) {
    this.ttlMs = ttlMs
    this.maxSize = maxSize
    this.store = new Map()
    this.inFlight = new Map()
  }

  get(key) {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expires) {
      this.store.delete(key)
      return undefined
    }
    entry.lastHit = Date.now()
    return entry.value
  }

  set(key, value, ttlMs = this.ttlMs) {
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      const oldest = this.store.keys().next().value
      if (oldest !== undefined) this.store.delete(oldest)
    }
    this.store.set(key, { value, expires: Date.now() + ttlMs, lastHit: Date.now() })
  }

  getOrFetch(key, fetchFn, { ttlMs } = {}) {
    const cached = this.get(key)
    if (cached !== undefined) {
      return Promise.resolve({ fromCache: true, value: cached })
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key).then(value => ({ fromCache: true, value }))
    }

    const promise = fetchFn()
      .then(value => {
        this.set(key, value, ttlMs)
        return value
      })
      .finally(() => {
        this.inFlight.delete(key)
      })

    this.inFlight.set(key, promise)
    return promise.then(value => ({ fromCache: false, value }))
  }
}

module.exports = { TTLCache }