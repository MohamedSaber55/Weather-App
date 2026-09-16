import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from '../Icons/Icons'
import { useI18n } from '../../context/SettingsContext'
import { getSearchResults } from '../../lib/api'
import { coordsLabel } from '../../lib/units'

const BASEMAP = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const markerHtml = `<span class="map-pin"><svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="17" r="2.5" fill="currentColor"/><path d="M17 0v6M17 28v6M0 17h6M28 17h6" stroke="currentColor" stroke-width="2"/></svg></span>`

const MapPicker = ({ open, onClose, onPick, initial }) => {
  const { t } = useI18n()
  const mapDiv = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [picked, setPicked] = useState(null)
  const [place, setPlace] = useState(null)
  const [resolving, setResolving] = useState(false)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (!open || mapRef.current || !mapDiv.current) return undefined
    const map = L.map(mapDiv.current, {
      center: [initial?.lat ?? 26.8, initial?.lon ?? 30.8],
      zoom: initial ? 9 : 5,
      zoomControl: true,
      attributionControl: true,
    })
    map.attributionControl?.setPrefix?.(false)
    L.tileLayer(BASEMAP, { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
    map.on('click', event => {
      const { lat, lng } = event.latlng
      setPicked({ lat, lon: lng })
    })
    mapRef.current = map
    // Leaflet needs a nudge when it starts inside a dialog that was just shown
    setTimeout(() => map.invalidateSize(), 60)

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [open, initial])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !picked) return
    const icon = L.divIcon({ className: 'map-marker', html: markerHtml, iconSize: [34, 34], iconAnchor: [17, 17] })
    if (markerRef.current) markerRef.current.setLatLng([picked.lat, picked.lon])
    else markerRef.current = L.marker([picked.lat, picked.lon], { icon, interactive: false }).addTo(map)
  }, [picked])

  // ask WeatherAPI what it calls this spot, so the saved place has a real name
  useEffect(() => {
    if (!picked) return undefined
    let cancelled = false
    setResolving(true)
    setPlace(null)
    const timer = setTimeout(() => {
      getSearchResults(`${picked.lat},${picked.lon}`, 1)
        .then(results => {
          if (cancelled) return
          setPlace(results?.[0] || null)
          setResolving(false)
        })
        .catch(() => {
          if (!cancelled) setResolving(false)
        })
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [picked])

  useEffect(() => {
    if (!open) {
      setPicked(null)
      setPlace(null)
    }
  }, [open])

  const useMyLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        mapRef.current?.setView([latitude, longitude], 11)
        setPicked({ lat: latitude, lon: longitude })
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  const confirm = () => {
    if (!picked) return
    onPick({
      name: place?.name || `${picked.lat.toFixed(2)}, ${picked.lon.toFixed(2)}`,
      region: place?.region,
      country: place?.country,
      lat: picked.lat,
      lon: picked.lon,
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="modal-backdrop-wx" onClick={onClose} role="presentation">
      <div className="map-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t('map.title')}>
        <header className="map-head">
          <h2 className="tile-label">{t('map.title')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('map.close')}>
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="map-body">
          <div ref={mapDiv} className="map-canvas" />
          {!picked && <p className="map-hint">{t('map.hint')}</p>}
        </div>

        <footer className="map-foot">
          <div className="map-picked">
            <Icon name="pin" size={18} />
            <div>
              <p className="map-name">
                {picked ? place?.name || (resolving ? t('map.lookingUp') : t('map.pin')) : t('map.none')}
              </p>
              <p className="map-coords">
                {picked
                  ? [coordsLabel(picked.lat, picked.lon), place?.region, place?.country].filter(Boolean).join(' · ')
                  : t('map.hint')}
              </p>
            </div>
          </div>
          <div className="map-actions">
            <button type="button" className="btn" onClick={useMyLocation} disabled={locating}>
              <Icon name={locating ? 'rotate' : 'locate'} size={13} className={locating ? 'is-spinning' : ''} />
              {t('map.myLocation')}
            </button>
            <button type="button" className="btn is-primary" onClick={confirm} disabled={!picked}>
              <Icon name="plus" size={13} />
              {t('map.save')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default MapPicker
