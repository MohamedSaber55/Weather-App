import React, { useState } from 'react'
import { formatTemp, formatTime, parseClock, formatWind, formatVisibility, formatPressure } from '../../lib/units'

const HourlyForecast = ({ hours, settings }) => {
  const [selected, setSelected] = useState(null)

  if (!hours?.length) return null

  const selectedHour = hours.find(h => parseClock(h.time)?.h === selected) || hours[0]

  const detail = selectedHour && [
    { label: 'Feels like', value: formatTemp(selectedHour.feelslike_c, settings.tempUnit) },
    { label: 'Humidity', value: `${selectedHour.humidity}%` },
    { label: 'Wind', value: `${formatWind(selectedHour.wind_kph, settings.speedUnit).value} ${formatWind(selectedHour.wind_kph, settings.speedUnit).label}` },
    { label: 'Gusts', value: `${formatWind(selectedHour.gust_kph ?? 0, settings.speedUnit).value} ${formatWind(selectedHour.gust_kph ?? 0, settings.speedUnit).label}` },
    { label: 'Rain chance', value: `${selectedHour.chance_of_rain ?? 0}%` },
    { label: 'UV', value: String(selectedHour.uv ?? '--') },
    { label: 'Pressure', value: `${formatPressure(selectedHour.pressure_mb ?? 0, settings.pressureUnit).value} ${formatPressure(selectedHour.pressure_mb ?? 0, settings.pressureUnit).label}` },
    { label: 'Visibility', value: `${formatVisibility(selectedHour.vis_km ?? 0, settings.distanceUnit).value} ${formatVisibility(selectedHour.vis_km ?? 0, settings.distanceUnit).label}` },
    { label: 'Cloud', value: `${selectedHour.cloud ?? 0}%` },
  ]

  return (
    <div className="box py-3 px-2">
      <div className="d-flex justify-content-between align-items-center ps-3 pe-2">
        <h5 className="box-title fw-semibold mb-0">HOURLY FORECAST</h5>
        <span className="small text-muted">Tap an hour for details</span>
      </div>
      <div className="d-flex py-2 forecast-container px-2" aria-label="Hourly forecast">
        {hours.map((hourData, idx) => {
          const clock = parseClock(hourData.time)
          const hour = clock?.h ?? idx
          return (
            <button
              key={idx}
              type="button"
              className={`forecast-item text-center${selected === hour ? ' selected' : ''}`}
              onClick={() => setSelected(hour)}
              aria-pressed={selected === hour}
            >
              <p className="m-0 small">{formatTime(hourData.time, settings.hourFormat)}</p>
              <img src={hourData.condition.icon} alt={hourData.condition.text} style={{ width: '64px', height: '64px' }} />
              <p className="m-0 fw-semibold">
                {formatTemp(hourData.temp_c, settings.tempUnit)}
              </p>
              {hourData.chance_of_rain > 0 && (
                <p className="small m-0 text-info">
                  <i className="fa-solid fa-droplet me-1" />{hourData.chance_of_rain}%
                </p>
              )}
            </button>
          )
        })}
      </div>

      {selectedHour && (
        <div className="hour-detail px-3 py-3 mt-1">
          <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
            <img src={selectedHour.condition.icon} alt="" width="48" height="48" />
            <div>
              <p className="fw-semibold mb-0">{selectedHour.condition.text}</p>
              <p className="small text-muted mb-0">
                {formatTime(selectedHour.time, settings.hourFormat)} · {formatTemp(selectedHour.temp_c, settings.tempUnit)}
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3">
            {detail.map((d, i) => (
              <div key={i} className="hour-detail-item">
                <p className="small text-muted mb-0 text-uppercase">{d.label}</p>
                <p className="fw-semibold mb-0">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HourlyForecast