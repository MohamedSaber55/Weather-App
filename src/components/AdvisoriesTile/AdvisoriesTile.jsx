import React from 'react'
import { Tile } from '../Tile/Tile'
import { activityAdvice, clothingAdvice, comfortLabel, getCategory, rainAdvice } from '../../lib/conditions'

const AdvisoriesTile = ({ current, day }) => {
  const chanceOfRain = day?.daily_chance_of_rain ?? 0
  const activity = activityAdvice({
    category: getCategory(current.condition.code, current.condition.text),
    uv: current.uv,
    windKph: current.wind_kph,
    chanceOfRain,
  })
  const rain = rainAdvice(chanceOfRain)

  const rows = [
    { tag: 'Wear', text: clothingAdvice(current.feelslike_c).text },
    { tag: activity.tag, text: activity.text },
    rain && { tag: 'Rain', text: rain.text },
    { tag: 'Comfort', text: comfortLabel({ feelslikeC: current.feelslike_c, tempC: current.temp_c, humidity: current.humidity }).text },
  ].filter(Boolean)

  return (
    <Tile label="Advisories" meta="Rule-based" className="t-adv">
      <ul className="adv-list">
        {rows.map((row, i) => (
          <li key={`${row.tag}-${i}`} className="adv-row">
            <span className="adv-tag">{row.tag}</span>
            <span className="adv-text">{row.text}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}

export default AdvisoriesTile
