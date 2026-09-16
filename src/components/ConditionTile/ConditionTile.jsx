import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Stat, Tile } from '../Tile/Tile'
import { ConditionIcon } from '../Icons/Icons'
import { conditionTitleKey, getCategory } from '../../lib/conditions'
import { formatVisibility } from '../../lib/units'

const ConditionTile = ({ current, hour, settings }) => {
  const { t } = useI18n()
  const isDay = current.is_day === 1
  const text = current.condition.text
  const vis = formatVisibility(current.vis_km ?? 0, settings.distanceUnit)
  const rain = hour?.chance_of_rain ?? 0

  return (
    <Tile label={t('tile.condition')} meta={t('meta.code', { code: current.condition.code })} className="t-cond">
      <div className="cond-main">
        <ConditionIcon code={current.condition.code} text={text} isDay={isDay} size={60} strokeWidth={1.4} />
        <div className="cond-text">
          <p className={`cond-title${text.length > 14 ? ' is-long' : ''}`}>{text}</p>
          <p className="cond-sub">{isDay ? t('label.dayTime') : t('label.nightTime')} · {t(conditionTitleKey(getCategory(current.condition.code, text)))}</p>
        </div>
      </div>
      <div className="cond-stats">
        <Stat label={t('label.cloud')} value={`${current.cloud ?? 0}%`} />
        <Stat label={t('label.rain')} value={`${rain}%`} />
        <Stat label={t('label.vis')} value={`${vis.value} ${vis.label}`} />
      </div>
    </Tile>
  )
}

export default ConditionTile
