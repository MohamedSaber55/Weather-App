import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const RAINVIEWER_META = 'https://api.rainviewer.com/public/weather-maps.json'

const WeatherMap = ({ lat, lon, name }) => {
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const radarLayerRef = useRef(null)
  const [meta, setMeta] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [opacity, setOpacity] = useState(0.75)
  const radarOpacityRef = useRef(0.75)

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map(mapDiv.current, {
        center: [0, 0],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)
      mapRef.current = map
      fetch(RAINVIEWER_META)
        .then(r => r.json())
        .then(setMeta)
        .catch(() => {})
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setView([lat, lon], 7, { animate: true })
  }, [lat, lon])

  useEffect(() => {
    const map = mapRef.current
    const timestamps = meta?.radar?.past ?? []
    if (!map || !timestamps.length) return undefined

    let frameIdx = timestamps.length - 1
    let timer = null

    const showFrame = idx => {
      const ts = timestamps[idx]
      const layer = L.tileLayer(
        `https://tilecache.rainviewer.com/v2/radar/${ts}/256/{z}/{x}/{y}/0/1_1.png`,
        { opacity: radarOpacityRef.current, tileSize: 256, zIndex: 500, attribution: 'Radar &copy; <a href="https://www.rainviewer.com">RainViewer</a>' }
      )
      if (radarLayerRef.current) {
        map.removeLayer(radarLayerRef.current)
        radarLayerRef.current = null
      }
      layer.addTo(map)
      radarLayerRef.current = layer
      frameIdx = idx
    }

    showFrame(timestamps.length - 1)

    if (playing) {
      timer = setInterval(() => {
        const next = (frameIdx + 1) % timestamps.length
        showFrame(next)
      }, 750)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [meta, playing])

  useEffect(() => {
    radarOpacityRef.current = opacity
    radarLayerRef.current?.setOpacity(opacity)
  }, [opacity])

  const togglePlay = () => setPlaying(p => !p)

  return (
    <div className="box p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <p className="fw-semibold fs-6 mb-0">
          <i className="fa-solid fa-map-location-dot me-2" style={{ color: '#FF7043' }} />Radar Map
        </p>
        <div className="d-flex align-items-center gap-3">
          <label className="small text-muted d-flex align-items-center gap-2">
            Opacity
            <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
          </label>
          {meta?.radar?.past?.length > 1 && (
            <button type="button" className="btn btn-sm btn-outline-info" onClick={togglePlay}>
              <i className={`fa-solid ${playing ? 'fa-pause' : 'fa-play'} me-1`} />{playing ? 'Pause' : 'Play'} loop
            </button>
          )}
        </div>
      </div>
      <div className="map-container" ref={mapDiv} aria-label={`Radar map near ${name}`} />
    </div>
  )
}

export default WeatherMap