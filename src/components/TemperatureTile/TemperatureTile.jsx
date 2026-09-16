import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Tile } from '../Tile/Tile'
import { ConditionIcon } from '../Icons/Icons'
import { clamp, fixed1, tempValue } from '../../lib/units'
import { conditionTitleKey, getCategory } from '../../lib/conditions'

const TemperatureTile = ({ current, day, settings }) => {
  const { t } = useI18n()
  const unit = settings.tempUnit
  const temp = tempValue(current.temp_c, unit)
  const low = tempValue(day?.mintemp_c ?? current.temp_c, unit)
  const high = tempValue(day?.maxtemp_c ?? current.temp_c, unit)
  const position = high > low ? clamp((temp - low) / (high - low), 0, 1) * 100 : 50
  const isDay = current.is_day === 1

  return (
    <Tile label={t('tile.temperature')} meta={`°${unit}`} className="t-temp">
      <div className="temp-top">
        <div className="temp-readout" aria-label={`${fixed1(temp)} degrees`}>
          <span className="temp-value">{fixed1(temp)}</span>
          <span className="temp-degree">°</span>
        </div>
        <ConditionIcon code={current.condition.code} text={current.condition.text} isDay={isDay} size={48} strokeWidth={1.4} className="only-mobile" />
      </div>
      <div className="temp-sub">
        <span>{t('label.feels')} <b>{fixed1(tempValue(current.feelslike_c, unit))}°</b></span>
        <span>{t('label.dew')} <b>{current.dewpoint_c != null ? `${fixed1(tempValue(current.dewpoint_c, unit))}°` : '--'}</b></span>
      </div>
      <p className="temp-condition only-mobile">
        {current.condition.text} · {t(conditionTitleKey(getCategory(current.condition.code, current.condition.text)))}
      </p>
      <div className="rail">
        <span className="rail-end">{fixed1(low)}</span>
        <div className="rail-track" role="meter" aria-label="Current temperature within today's range" aria-valuemin={low} aria-valuemax={high} aria-valuenow={temp}>
          <span className="rail-fill" />
          <span className="rail-tick" style={{ left: `${position}%` }} />
        </div>
        <span className="rail-end">{fixed1(high)}</span>
      </div>
    </Tile>
  )
}

export default TemperatureTile
