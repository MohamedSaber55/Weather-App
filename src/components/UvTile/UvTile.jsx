import React from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import Gauge from '../Gauge/Gauge'
import { UV_RANGES, uvBurnTime, uvLevel, uvProtection } from '../../lib/conditions'
import { formatTime, parseClock } from '../../lib/units'

const BAR_FROM = 7
const BAR_TO = 18

const UvTile = ({ uv, hours = [], nowHour, settings }) => {
  const value = typeof uv === 'number' ? uv : 0
  const level = uvLevel(value)
  const ranges = UV_RANGES.map(r => ({ ...r, active: value >= r.from && value < r.to }))

  const daylight = hours.filter(h => {
    const c = parseClock(h.time)
    return c && c.h >= BAR_FROM && c.h <= BAR_TO
  })
  const peak = hours.reduce((best, h) => ((h.uv ?? 0) > (best?.uv ?? -1) ? h : best), null)

  return (
    <Tile label="UV index" meta={peak?.uv ? `Peak ${formatTime(peak.time, settings.hourFormat)}` : 'Today'} className="t-uv">
      <div className="gauge-row">
        <Gauge ranges={ranges} total={12} value={Math.min(value, 12)} width={120} label={`UV index ${Math.round(value)}: ${level.label}`} />
        <div className="gauge-readout">
          <span className="num-lg">{Math.round(value)}</span>
          <span className="gauge-label">{level.label}</span>
        </div>
      </div>
      {daylight.length > 0 && (
        <div className="uv-bars hide-mobile" aria-hidden="true">
          {daylight.map(h => {
            const c = parseClock(h.time)
            const isNow = c && nowHour != null && c.h === Math.floor(nowHour)
            return (
              <span key={h.time} className={isNow ? 'uv-bar is-now' : 'uv-bar'}>
                <span className="uv-bar-fill" style={{ height: `${Math.max(2, ((h.uv ?? 0) / 11) * 30)}px` }} />
                <span className="uv-bar-label">{String(c.h).padStart(2, '0')}</span>
              </span>
            )
          })}
        </div>
      )}
      <div className="kv-list hide-mobile">
        <KeyValue label="Burn time" value={uvBurnTime(value)} />
        <KeyValue label="Protect" value={uvProtection(value)} />
      </div>
      <p className="tile-note only-mobile">Burn {uvBurnTime(value)}</p>
    </Tile>
  )
}

export default UvTile
