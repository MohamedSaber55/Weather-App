import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import { clamp, clockHours, dayLength, formatTime } from '../../lib/units'

const W = 280
const H = 96

const SunArc = ({ progress }) => {
  const base = H - 12
  const rx = W / 2 - 14
  const ry = H - 30
  const cx = W / 2
  const angle = Math.PI * (1 - progress)
  const x = cx + rx * Math.cos(angle)
  const y = base - ry * Math.sin(angle)

  return (
    <svg className="sun-arc" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <path className="sun-horizon" d={`M0 ${base} H${W}`} />
      <path className="sun-track" d={`M${cx - rx} ${base} A${rx} ${ry} 0 0 1 ${cx + rx} ${base}`} fill="none" />
      {progress > 0 && (
        <path className="sun-progress" d={`M${cx - rx} ${base} A${rx} ${ry} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`} fill="none" />
      )}
      {progress > 0 && progress < 1 && <circle className="sun-dot" cx={x.toFixed(1)} cy={y.toFixed(1)} r="7" />}
    </svg>
  )
}

const SunTile = ({ astro, localtime, settings }) => {
  const { t } = useI18n()
  const rise = clockHours(astro?.sunrise)
  const set = clockHours(astro?.sunset)
  const now = clockHours(localtime)
  const hasWindow = rise != null && set != null && set > rise && now != null
  const raw = hasWindow ? (now - rise) / (set - rise) : 0
  const progress = clamp(raw, 0, 1)
  const isNight = !hasWindow || raw <= 0 || raw >= 1

  return (
    <Tile label={t('tile.sun')} meta={t('meta.daylight', { length: dayLength(astro?.sunrise, astro?.sunset) || '--' })} className="t-sun">
      <div className="sun-body">
        <SunArc progress={isNight ? 0 : progress} />
        <div className="kv-list">
          <KeyValue label={t('label.rise')} value={formatTime(astro?.sunrise, settings.hourFormat)} />
          <KeyValue label={t('label.set')} value={formatTime(astro?.sunset, settings.hourFormat)} />
          <KeyValue label={t('label.elapsed')} value={isNight ? t('label.night') : `${Math.round(progress * 100)}%`} accent />
        </div>
      </div>
    </Tile>
  )
}

export default SunTile
