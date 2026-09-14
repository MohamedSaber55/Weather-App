import React, { useState } from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import { ConditionIcon } from '../Icons/Icons'
import { moonAbbreviation, shortCondition } from '../../lib/conditions'
import { dayStamp, fixed1, formatTime, speedLabel, speedValue, tempValue } from '../../lib/units'

const ForecastTile = ({ days, settings }) => {
  const [selected, setSelected] = useState(0)
  if (!days?.length) return null

  const unit = settings.tempUnit
  const detail = days[Math.min(selected, days.length - 1)]
  const moonIllumination = detail.astro?.moon_illumination

  return (
    <Tile label="Forecast" meta={`${days.length} ${days.length === 1 ? 'day' : 'days'}`} className="t-fc">
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
            <th scope="col">Day</th>
            <th scope="col">Cond</th>
            <th scope="col" className="num">Lo</th>
            <th scope="col" className="num">Hi</th>
            <th scope="col" className="num">Rain</th>
            <th scope="col" className="num hide-mobile">UV</th>
          </tr>
        </thead>
        <tbody>
          {days.map((fd, i) => {
            const rain = fd.day.daily_chance_of_rain ?? 0
            return (
              <tr key={fd.date} className={i === selected ? 'is-selected' : ''} onClick={() => setSelected(i)}>
                <th scope="row">
                  <button type="button" className="fc-day" onClick={() => setSelected(i)} aria-pressed={i === selected}>
                    {dayStamp(fd.date)}
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
        <KeyValue label="Rise" value={formatTime(detail.astro?.sunrise, settings.hourFormat)} />
        <KeyValue label="Set" value={formatTime(detail.astro?.sunset, settings.hourFormat)} />
        <KeyValue label="Max wind" value={`${Math.round(speedValue(detail.day.maxwind_kph ?? 0, settings.speedUnit))} ${speedLabel(settings.speedUnit)}`} />
        <KeyValue label="Precip" value={`${fixed1(detail.day.totalprecip_mm ?? 0)} mm`} />
        <KeyValue label="Humidity" value={`${detail.day.avghumidity ?? '--'}%`} />
        <KeyValue label="Moon" value={`${moonAbbreviation(detail.astro?.moon_phase)} ${moonIllumination != null ? `${Math.round(moonIllumination)}%` : ''}`.trim()} />
      </div>
    </Tile>
  )
}

export default ForecastTile
