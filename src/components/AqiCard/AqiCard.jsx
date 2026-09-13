import React from 'react'
import { aqiLevel } from '../../lib/conditions'

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM10', unit: 'µg/m³' },
  { key: 'o3', label: 'O₃', unit: 'µg/m³' },
  { key: 'no2', label: 'NO₂', unit: 'µg/m³' },
  { key: 'so2', label: 'SO₂', unit: 'µg/m³' },
  { key: 'co', label: 'CO', unit: 'µg/m³' },
]

const AqiCard = ({ airQuality }) => {
  if (!airQuality || airQuality['us-epa-index'] === undefined) return null

  const index = airQuality['us-epa-index']
  const level = aqiLevel(index)

  const primary = POLLUTANTS
    .map(p => ({ ...p, value: airQuality[p.key] }))
    .filter(p => typeof p.value === 'number')
    .sort((a, b) => b.value - a.value)[0]

  return (
    <div className="box p-4 h-100">
      <p className="box-title fw-semibold fs-6 mb-3">
        <i className="fa-solid fa-smog me-2" style={{ color: '#7CB342' }} />AIR QUALITY
      </p>
      <div className="d-flex align-items-baseline gap-3">
        <span className="display-4 fw-bold" style={{ color: level.color }}>{index}</span>
        <div>
          <p className="fw-semibold mb-0" style={{ color: level.color }}>{level.label}</p>
          {primary && (
            <p className="small text-muted mb-0">
              Main pollutant: {primary.label} · {Math.round(primary.value)} {primary.unit}
            </p>
          )}
        </div>
      </div>
      <div className="aqi-bar mt-3">
        <div
          className="aqi-gradient"
          style={{ background: 'linear-gradient(90deg,#4CAF50,#FFC107,#FF9800,#F44336,#9C27B0,#880E4F)' }}
        />
        <span
          className="aqi-marker"
          style={{ left: `${Math.min(index, 300) / 300 * 100}%`, background: level.color }}
        />
      </div>
      <div className="small text-muted mt-2">{level.advice}</div>
    </div>
  )
}

export default AqiCard