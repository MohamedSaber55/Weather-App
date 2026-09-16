import { useI18n } from '../../context/SettingsContext'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Tile } from '../Tile/Tile'
import { Icon } from '../Icons/Icons'
import { coordsLabel } from '../../lib/units'

const RAINVIEWER_META = 'https://api.rainviewer.com/public/weather-maps.json'
// OpenStreetMap needs no key; the dark look comes from a CSS filter on the tile pane
const BASEMAP = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OPACITY_STEPS = [1, 0.75, 0.5, 0.25]
const ZOOM = 7

const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// weather-maps.json lists frames as {time, path}; older payloads used bare timestamps
function readFrames(meta) {
  const host = meta?.host || 'https://tilecache.rainviewer.com'
  const toFrame = f => {
    const time = typeof f === 'object' && f ? f.time : f
    const path = typeof f === 'object' && f ? f.path : `/v2/radar/${f}`
    return { time, url: `${host}${path}/256/{z}/{x}/{y}/2/1_1.png` }
  }
  const past = (meta?.radar?.past || []).map(toFrame)
  const nowcast = (meta?.radar?.nowcast || []).map(toFrame)
  return { frames: [...past, ...nowcast], latest: past.length - 1 }
}

const markerHtml = name => `<span class="radar-marker-cross"><svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true"><rect x="9" y="9" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M0 18H9M27 18H36M18 0V9M18 27V36" stroke="currentColor" stroke-width="1.5"/></svg></span><span class="radar-marker-label">${escapeHtml(name)}</span>`

const RadarTile = ({ lat, lon, name, offline = false }) => {
  const { t } = useI18n()
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const baseRef = useRef(null)
  const radarRef = useRef(null)
  const markerRef = useRef(null)
  const opacityRef = useRef(0.75)
  const [meta, setMeta] = useState(null)
  const [frameIdx, setFrameIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [opacity, setOpacity] = useState(0.75)

  const { frames, latest } = useMemo(() => readFrames(meta), [meta])

  useEffect(() => {
    const map = L.map(mapDiv.current, { center: [lat, lon], zoom: ZOOM, zoomControl: false, attributionControl: true })
    map.attributionControl?.setPrefix?.(false)
    mapRef.current = map

    let cancelled = false
    fetch(RAINVIEWER_META)
      .then(r => r.json())
      .then(data => { if (!cancelled) setMeta(data) })
      .catch(() => {})

    let observer = null
    if (typeof ResizeObserver !== 'undefined' && mapDiv.current) {
      observer = new ResizeObserver(() => map.invalidateSize?.())
      observer.observe(mapDiv.current)
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      map.remove()
      mapRef.current = null
      baseRef.current = null
      radarRef.current = null
      markerRef.current = null
    }
    // the map is created once; location changes are handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (baseRef.current) return
    const layer = L.tileLayer(BASEMAP, { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' })
    layer.addTo(map)
    baseRef.current = layer
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setView([lat, lon], ZOOM, { animate: false })
    const icon = L.divIcon({ className: 'radar-marker', html: markerHtml(name), iconSize: [36, 36], iconAnchor: [18, 18] })
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon])
      markerRef.current.setIcon(icon)
    } else {
      const marker = L.marker([lat, lon], { icon, interactive: false, keyboard: false })
      marker.addTo(map)
      markerRef.current = marker
    }
  }, [lat, lon, name])

  useEffect(() => {
    setFrameIdx(latest)
  }, [latest, frames])

  useEffect(() => {
    const map = mapRef.current
    const frame = frames[frameIdx]
    if (!map || !frame) return
    const layer = L.tileLayer(frame.url, {
      opacity: opacityRef.current,
      pane: 'overlayPane',
      zIndex: 500,
      maxNativeZoom: ZOOM,
      maxZoom: 19,
      attribution: 'Radar &copy; RainViewer',
    })
    layer.addTo(map)
    const previous = radarRef.current
    radarRef.current = layer
    if (previous) map.removeLayer(previous)
  }, [frames, frameIdx])

  useEffect(() => {
    if (!playing || frames.length < 2) return undefined
    const timer = setInterval(() => setFrameIdx(i => (i + 1) % frames.length), 700)
    return () => clearInterval(timer)
  }, [playing, frames.length])

  useEffect(() => {
    opacityRef.current = opacity
    radarRef.current?.setOpacity?.(opacity)
  }, [opacity])

  const frame = frames[frameIdx]
  const offsetMin = frame ? Math.round((frame.time * 1000 - Date.now()) / 60000) : null
  const metaLabel = offline
    ? t('meta.offline')
    : offsetMin == null
      ? t('radar.source')
      : `${t('radar.source')} · ${offsetMin > 0 ? '+' : '−'}${Math.abs(offsetMin)} min`

  const cycleOpacity = () => {
    const i = OPACITY_STEPS.indexOf(opacity)
    setOpacity(OPACITY_STEPS[(i + 1) % OPACITY_STEPS.length])
  }

  const frameClass = i => {
    if (i === frameIdx) return 'radar-frame is-current'
    if (i > latest) return 'radar-frame is-forecast'
    if (i < frameIdx) return 'radar-frame is-past'
    return 'radar-frame'
  }

  return (
    <Tile label={t('tile.radar')} meta={metaLabel} className="t-radar">
      <div className="radar-map">
        <div ref={mapDiv} className="radar-leaflet" role="region" aria-label={`Radar map near ${name}`} />
        <div className="radar-grid" aria-hidden="true" />
        <span className="radar-coords" aria-hidden="true">{coordsLabel(lat, lon)}</span>
      </div>
      <div className="radar-controls">
        <button
          type="button"
          className="icon-btn is-small"
          onClick={() => setPlaying(p => !p)}
          disabled={frames.length < 2}
          aria-label={playing ? t('radar.pause') : t('radar.play')}
        >
          <Icon name={playing ? 'pause' : 'play'} size={12} fill={playing ? 'none' : 'currentColor'} strokeWidth={playing ? 2 : 1.6} />
        </button>
        {frames.length > 0 ? (
          <div className="radar-frames" role="group" aria-label="Radar frames">
            {frames.map((f, i) => (
              <button
                key={`${f.time}-${i}`}
                type="button"
                className={frameClass(i)}
                onClick={() => {
                  setPlaying(false)
                  setFrameIdx(i)
                }}
                aria-pressed={i === frameIdx}
                aria-label={`Radar frame ${new Date(f.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}${i > latest ? ' (forecast)' : ''}`}
              >
                <span />
              </button>
            ))}
          </div>
        ) : (
          <span className="radar-empty">{offline ? t('offline.radar') : t('radar.unavailable')}</span>
        )}
        <button type="button" className="radar-opacity" onClick={cycleOpacity} aria-label={`Radar opacity ${Math.round(opacity * 100)}%, change`}>
          {t('radar.opacity', { percent: Math.round(opacity * 100) })}
        </button>
      </div>
    </Tile>
  )
}

export default RadarTile
