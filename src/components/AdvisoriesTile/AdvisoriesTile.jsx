import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Tile } from '../Tile/Tile'
import { activityAdvice, clothingAdvice, comfortLabel, getCategory, rainAdvice } from '../../lib/conditions'

const AdvisoriesTile = ({ current, day }) => {
  const { t } = useI18n()
  const chanceOfRain = day?.daily_chance_of_rain ?? 0
  const activity = activityAdvice({
    category: getCategory(current.condition.code, current.condition.text),
    uv: current.uv,
    windKph: current.wind_kph,
    chanceOfRain,
  })
  const rain = rainAdvice(chanceOfRain)

  const rows = [
    { tag: 'wear', key: clothingAdvice(current.feelslike_c).key },
    { tag: activity.tag, key: activity.key },
    rain && { tag: 'rain', key: rain.key },
    { tag: 'comfort', key: comfortLabel({ feelslikeC: current.feelslike_c, tempC: current.temp_c, humidity: current.humidity }).key },
  ].filter(Boolean)

  return (
    <Tile label={t('tile.advisories')} meta={t('meta.ruleBased')} className="t-adv">
      <ul className="adv-list">
        {rows.map((row, i) => (
          <li key={`${row.tag}-${i}`} className="adv-row">
            <span className="adv-tag">{t(`advTag.${row.tag}`)}</span>
            <span className="adv-text">{t(row.key)}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}

export default AdvisoriesTile
