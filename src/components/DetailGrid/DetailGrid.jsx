import React from 'react'
import { formatTemp, formatWind, formatVisibility, formatPressure, formatTime, dayLength } from '../../lib/units'

const DetailGrid = ({ current, today, settings }) => {
  const wind = formatWind(current.wind_kph, settings.speedUnit)
  const gust = formatWind(current.gust_kph ?? 0, settings.speedUnit)
  const vis = formatVisibility(current.vis_km, settings.distanceUnit)
  const press = formatPressure(current.pressure_mb, settings.pressureUnit)
  const astro = today?.astro

  const cards = [
    { icon: 'fa-solid fa-wind', color: '#00B0FF', label: 'Wind', value: `${wind.value} ${wind.label}` },
    { icon: 'fa-solid fa-compass', color: '#32CD32', label: 'Wind direction', value: current.wind_dir || '--' },
    { icon: 'fa-solid fa-wind', color: '#4DD0E1', label: 'Wind gusts', value: `${gust.value} ${gust.label}` },
    { icon: 'fa-solid fa-droplet', color: '#1E90FF', label: 'Humidity', value: `${current.humidity}%` },
    { icon: 'fa-solid fa-eye', color: '#B0BEC5', label: 'Visibility', value: `${vis.value} ${vis.label}` },
    { icon: 'fa-solid fa-temperature-three-quarters', color: '#FF6347', label: 'Real feel', value: formatTemp(current.feelslike_c, settings.tempUnit) },
    { icon: 'fa-solid fa-shower', color: '#20B2AA', label: 'Chance of rain', value: `${today?.day?.daily_chance_of_rain ?? 0}%` },
    { icon: 'fa-solid fa-gauge-high', color: '#D3D3D3', label: 'Pressure', value: `${press.value} ${press.label}` },
    { icon: 'fa-solid fa-droplet-slash', color: '#81C784', label: 'Dew point', value: formatTemp(current.dewpoint_c, settings.tempUnit) },
    { icon: 'fa-solid fa-cloud', color: '#90A4AE', label: 'Cloud cover', value: `${current.cloud ?? 0}%` },
    { icon: 'fa-solid fa-sun', color: '#FFC107', label: 'Sunrise', value: formatTime(astro?.sunrise, settings.hourFormat) },
    { icon: 'fa-solid fa-cloud-sun', color: '#FFA500', label: 'Sunset', value: formatTime(astro?.sunset, settings.hourFormat) },
    { icon: 'fa-solid fa-clock', color: '#CE93D8', label: 'Day length', value: dayLength(astro?.sunrise, astro?.sunset) || '--' },
  ]

  return (
    <div className="details d-flex flex-wrap">
      {cards.map((c, i) => (
        <div key={i} className="col-12 col-sm-6 col-lg-4 py-2 pe-lg-2 d-flex">
          <div className="box p-3 flex-grow-1 d-flex align-items-center gap-3">
            <div className="metric-icon">
              <i className={c.icon} style={{ color: c.color }} />
            </div>
            <div>
              <p className="fw-semibold small text-muted text-uppercase mb-0">{c.label}</p>
              <p className="fw-semibold fs-5 mb-0">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DetailGrid