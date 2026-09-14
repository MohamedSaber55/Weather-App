import React from 'react'
import { Stat, Tile } from '../Tile/Tile'
import { ConditionIcon } from '../Icons/Icons'
import { conditionTitleByCategory, getCategory } from '../../lib/conditions'
import { formatVisibility } from '../../lib/units'

const ConditionTile = ({ current, hour, settings }) => {
  const isDay = current.is_day === 1
  const text = current.condition.text
  const vis = formatVisibility(current.vis_km ?? 0, settings.distanceUnit)
  const rain = hour?.chance_of_rain ?? 0

  return (
    <Tile label="Condition" meta={`Code ${current.condition.code}`} className="t-cond">
      <div className="cond-main">
        <ConditionIcon code={current.condition.code} text={text} isDay={isDay} size={60} strokeWidth={1.4} />
        <div className="cond-text">
          <p className={`cond-title${text.length > 14 ? ' is-long' : ''}`}>{text}</p>
          <p className="cond-sub">{isDay ? 'Day' : 'Night'} · {conditionTitleByCategory(getCategory(current.condition.code, text))}</p>
        </div>
      </div>
      <div className="cond-stats">
        <Stat label="Cloud" value={`${current.cloud ?? 0}%`} />
        <Stat label="Rain" value={`${rain}%`} />
        <Stat label="Vis" value={`${vis.value} ${vis.label}`} />
      </div>
    </Tile>
  )
}

export default ConditionTile
