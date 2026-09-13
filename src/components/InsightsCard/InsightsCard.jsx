import React from 'react'
import { clothingAdvice, rainAdvice, activityAdvice, comfortLabel, getCategory } from '../../lib/conditions'

const InsightsCard = ({ current, day }) => {
  const clothing = clothingAdvice(current.feelslike_c)
  const rain = rainAdvice(day?.daily_chance_of_rain ?? 0)
  const comfort = comfortLabel({ feelslike_c: current.feelslike_c, temp_c: current.temp_c, humidity: current.humidity })
  const activity = activityAdvice({
    category: getCategory(current.condition.code),
    uv: current.uv,
    windKph: current.wind_kph,
    chanceOfRain: day?.daily_chance_of_rain ?? 0,
  })

  const items = [
    { icon: clothing.icon, title: 'What to wear', text: clothing.text },
    { icon: activity.icon, title: 'Activity tip', text: activity.text },
    rain && { icon: rain.icon, title: 'Rain check', text: rain.text },
    { icon: comfort.icon, title: 'Comfort', text: comfort.text },
  ].filter(Boolean)

  return (
    <div className="box p-4">
      <p className="fw-semibold fs-6 mb-3">
        <i className="fa-solid fa-list-check me-2" style={{ color: '#03A9F4' }} />DAILY INSIGHTS
      </p>
      <div className="d-flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div key={i} className="insight d-flex align-items-start gap-2 col-12 col-sm-6 col-lg-auto">
            <i className={`${item.icon} insight-icon`} />
            <div>
              <p className="small fw-semibold text-muted mb-0 text-uppercase">{item.title}</p>
              <p className="mb-0">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightsCard