import React from 'react'
import { Tile } from '../Tile/Tile'
import Gauge from '../Gauge/Gauge'
import { AQI_COLORS, aqiLevel } from '../../lib/conditions'

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5', cap: 75 },
  { key: 'pm10', label: 'PM10', cap: 150 },
  { key: 'o3', label: 'O₃', cap: 180 },
  { key: 'no2', label: 'NO₂', cap: 100 },
]

const AirQualityTile = ({ airQuality }) => {
  const raw = airQuality?.['us-epa-index']

  if (raw === undefined || raw === null) {
    return (
      <Tile label="Air quality" meta="US EPA" className="t-aqi">
        <p className="tile-empty">No air quality data for this location.</p>
      </Tile>
    )
  }

  const level = aqiLevel(raw)
  const ranges = AQI_COLORS.map((color, i) => ({ from: i, to: i + 1, color, active: i === level.index - 1 }))

  return (
    <Tile label="Air quality" meta={<>US EPA · <span className="no-caps">µg/m³</span></>} className="t-aqi">
      <div className="gauge-row">
        <Gauge ranges={ranges} total={6} value={level.index - 0.5} width={120} label={`US EPA index ${level.index} of 6: ${level.label}`} />
        <div className="gauge-readout">
          <span className="num-lg">
            {level.index}
            <span className="num-sub">/6</span>
          </span>
          <span className="gauge-label">{level.label}</span>
        </div>
      </div>
      <div className="bars hide-mobile">
        {POLLUTANTS.map(p => {
          const value = airQuality[p.key]
          if (typeof value !== 'number') return null
          return (
            <div key={p.key} className="bar-row">
              <span className="bar-key">{p.label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${Math.min(100, (value / p.cap) * 100)}%` }} />
              </span>
              <span className="bar-value">{Math.round(value)}</span>
            </div>
          )
        })}
      </div>
      <p className="tile-note hide-mobile">{level.advice}</p>
      <p className="tile-note only-mobile">
        {typeof airQuality.pm2_5 === 'number' ? `PM2.5 ${Math.round(airQuality.pm2_5)} µg/m³` : level.label}
      </p>
    </Tile>
  )
}

export default AirQualityTile
