import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import { fixed1, formatPressure, formatVisibility, tempValue } from '../../lib/units'

const SEGMENTS = 20

const HumidityTile = ({ current, settings }) => {
  const { t } = useI18n()
  const humidity = current.humidity ?? 0
  const filled = Math.round((humidity / 100) * SEGMENTS)
  const pressure = formatPressure(current.pressure_mb ?? 0, settings.pressureUnit)
  const vis = formatVisibility(current.vis_km ?? 0, settings.distanceUnit)

  return (
    <Tile label={t('tile.humidity')} meta={t('meta.rh')} className="t-hum">
      <span className="big-reading">
        <span className="num-xl">{humidity}</span>
        <span className="unit">%</span>
      </span>
      <div className="segments" role="meter" aria-label="Relative humidity" aria-valuemin={0} aria-valuemax={100} aria-valuenow={humidity}>
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={i < filled ? 'segment is-on' : 'segment'} />
        ))}
      </div>
      <div className="scale hide-mobile">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
      <div className="kv-list only-mobile">
        <KeyValue label={t('label.dew')} value={current.dewpoint_c != null ? `${fixed1(tempValue(current.dewpoint_c, settings.tempUnit))}°` : '--'} />
        <KeyValue label={pressure.label} value={pressure.value} />
        <KeyValue label={t('label.vis')} value={`${vis.value} ${vis.label}`} />
      </div>
    </Tile>
  )
}

export default HumidityTile
