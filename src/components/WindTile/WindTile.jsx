import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Tile } from '../Tile/Tile'
import { speedLabel, speedValue } from '../../lib/units'

const Compass = ({ degree = 0, size = 96 }) => {
  const c = size / 2
  const r = c - 4
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const a = ((i * 10 - 90) * Math.PI) / 180
    const major = i % 9 === 0
    const r1 = major ? r - 9 : r - 5
    return (
      <path
        key={i}
        className={major ? 'compass-tick is-major' : 'compass-tick'}
        d={`M${(c + r1 * Math.cos(a)).toFixed(1)} ${(c + r1 * Math.sin(a)).toFixed(1)} L${(c + r * Math.cos(a)).toFixed(1)} ${(c + r * Math.sin(a)).toFixed(1)}`}
      />
    )
  })
  const lr = r - 20
  const letter = (text, deg) => {
    const a = ((deg - 90) * Math.PI) / 180
    return (
      <text key={text} className={text === 'N' ? 'compass-letter is-north' : 'compass-letter'} x={(c + lr * Math.cos(a)).toFixed(1)} y={(c + lr * Math.sin(a) + 3.5).toFixed(1)} textAnchor="middle">
        {text}
      </text>
    )
  }

  return (
    <svg className="compass" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className="compass-ring" cx={c} cy={c} r={r} />
      {ticks}
      {[['N', 0], ['E', 90], ['S', 180], ['W', 270]].map(([t, d]) => letter(t, d))}
      <g transform={`rotate(${degree} ${c} ${c})`}>
        <path className="compass-needle" d={`M${c} ${c - r + 12} L${c + 5} ${c} L${c} ${c - 5} L${c - 5} ${c} Z`} />
        <path className="compass-tail" d={`M${c} ${c} L${c} ${c + r - 16}`} />
      </g>
      <circle className="compass-hub" cx={c} cy={c} r="3" />
    </svg>
  )
}

const WindTile = ({ current, settings }) => {
  const { t } = useI18n()
  const unit = settings.speedUnit
  const speed = Math.round(speedValue(current.wind_kph ?? 0, unit))
  const gust = Math.round(speedValue(current.gust_kph ?? 0, unit))
  const degree = current.wind_degree ?? 0

  return (
    <Tile label={t('tile.wind')} meta={`${current.wind_dir || '--'} ${degree}°`} className="t-wind">
      <div className="wind-body">
        <Compass degree={degree} />
        <div className="wind-values">
          <span className="wind-speed">
            <span className="num-lg">{speed}</span>
            <span className="unit">{speedLabel(unit)}</span>
          </span>
          <span className="wind-gust">{t('label.gust')} <b>{gust}</b></span>
        </div>
      </div>
    </Tile>
  )
}

export default WindTile
