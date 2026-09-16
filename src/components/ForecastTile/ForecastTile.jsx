import { useI18n } from '../../context/SettingsContext'
import React, { useState } from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import { ConditionIcon } from '../Icons/Icons'
import { moonAbbreviation, shortCondition } from '../../lib/conditions'
import { dayStamp, fixed1, formatTime, speedLabel, speedValue, tempValue } from '../../lib/units'

const ForecastTile = ({ days, settings }) => {
  const { t, days: dayNames } = useI18n()
  const [selected, setSelected] = useState(0)
  if (!days?.length) return null

  const unit = settings.tempUnit
  const detail = days[Math.min(selected, days.length - 1)]
  const moonIllumination = detail.astro?.moon_illumination

  return (
    <Tile label={t('tile.forecast')} meta={days.length === 1 ? t('meta.day', { count: 1 }) : t('meta.days', { count: days.length })} className="t-fc">
      <table className="fc-table">
        <colgroup>
          <col className="fc-col-day" />
          <col />
          <col className="fc-col-num" />
          <col className="fc-col-num" />
          <col className="fc-col-rain" />
          <col className="fc-col-uv hide-mobile" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">{t('label.day')}</th>
            <th scope="col">{t('label.cond')}</th>
            <th scope="col" className="num">{t('label.lo')}</th>
            <th scope="col" className="num">{t('label.hi')}</th>
            <th scope="col" className="num">{t('label.rain')}</th>
            <th scope="col" className="num hide-mobile">{t('label.uv')}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((fd, i) => {
            const rain = fd.day.daily_chance_of_rain ?? 0
            return (
              <tr key={fd.date} className={i === selected ? 'is-selected' : ''} onClick={() => setSelected(i)}>
                <th scope="row">
                  <button type="button" className="fc-day" onClick={() => setSelected(i)} aria-pressed={i === selected}>
                    {dayStamp(fd.date, { days: dayNames })}
                  </button>
                </th>
                <td>
                  <span className="fc-cond">
                    <ConditionIcon code={fd.day.condition.code} text={fd.day.condition.text} size={16} />
                    <span className="fc-cond-text" title={fd.day.condition.text}>{shortCondition(fd.day.condition.text)}</span>
                  </span>
                </td>
                <td className="num fc-lo">{fixed1(tempValue(fd.day.mintemp_c, unit))}</td>
                <td className="num fc-hi">{fixed1(tempValue(fd.day.maxtemp_c, unit))}</td>
                <td className={`num fc-rain${rain > 0 ? ' is-wet' : ''}`}>{rain}%</td>
                <td className="num fc-uv hide-mobile">{fd.day.uv ?? '--'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="fc-detail" aria-live="polite">
        <KeyValue label={t('label.rise')} value={formatTime(detail.astro?.sunrise, settings.hourFormat)} />
        <KeyValue label={t('label.set')} value={formatTime(detail.astro?.sunset, settings.hourFormat)} />
        <KeyValue label={t('label.maxWind')} value={`${Math.round(speedValue(detail.day.maxwind_kph ?? 0, settings.speedUnit))} ${speedLabel(settings.speedUnit)}`} />
        <KeyValue label={t('label.precip')} value={`${fixed1(detail.day.totalprecip_mm ?? 0)} mm`} />
        <KeyValue label={t('label.humidity')} value={`${detail.day.avghumidity ?? '--'}%`} />
        <KeyValue label={t('label.moon')} value={`${moonAbbreviation(detail.astro?.moon_phase)} ${moonIllumination != null ? `${Math.round(moonIllumination)}%` : ''}`.trim()} />
      </div>
    </Tile>
  )
}

export default ForecastTile
