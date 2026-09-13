import React, { useState } from 'react'
import { formatTemp, formatTime, formatWind, dayLength } from '../../lib/units'
import { moonPhase } from '../../lib/conditions'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const DailyForecast = ({ forecastdays, settings }) => {
  const [open, setOpen] = useState(null)
  if (!forecastdays?.length) return null

  return (
    <div className="box px-4 py-3">
      <h5 className="fw-semibold mb-0 pb-2 d-flex justify-content-between">
        <span><i className="fa-solid fa-calendar-days me-2 text-info" />DAILY FORECAST</span>
        <span className="small text-muted fw-normal">Tap a day for details</span>
      </h5>
      {forecastdays.map((fd, i) => {
        const date = new Date(`${fd.date}T12:00:00`)
        const name = i === 0 ? 'Today' : WEEKDAYS[date.getDay()]
        const shortDate = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
        const isOpen = open === i
        const rain = fd.day.daily_chance_of_rain ?? 0
        return (
          <div key={fd.date} className={`daily-row${isOpen ? ' open' : ''}`}>
            <button type="button" className="daily-row-main btn w-100 text-start" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <div className="d-flex align-items-center gap-2 col-5 col-md-3">
                  <p className="fw-semibold m-0">{name}</p>
                  <span className="small text-muted">{shortDate}</span>
                </div>
                <div className="d-flex align-items-center gap-2 col-6 col-md-4">
                  <img src={fd.day.condition.icon} alt="" width="36" height="36" loading="lazy" />
                  <p className="m-0 small d-none d-md-block">{fd.day.condition.text}</p>
                  <span className="small text-info d-md-none" title="Rain chance">
                    <i className="fa-solid fa-droplet me-1" />{rain}%
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 col-6 col-md-4 justify-content-end">
                  <span className="moon d-flex align-items-center gap-1 small text-muted" title={fd.astro.moon_phase}>
                    {moonPhase(fd.astro.moon_phase)} {fd.astro.moon_illumination}%
                  </span>
                  {i !== 0 && (
                    <span className="d-none d-md-inline small text-info">
                      <i className="fa-solid fa-droplet me-1" />{rain}%
                    </span>
                  )}
                  <span className="fw-semibold" style={{ color: '#FFC107' }}>
                    {formatTemp(fd.day.maxtemp_c, settings.tempUnit)}
                  </span>
                  <span className="text-muted">
                    {formatTemp(fd.day.mintemp_c, settings.tempUnit)}
                  </span>
                  <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-muted small`} />
                </div>
              </div>
            </button>
            {isOpen && (
              <div className="daily-detail px-3 pb-3">
                <div className="row g-2 small">
                  <Detail label="Sunrise" value={formatTime(fd.astro.sunrise, settings.hourFormat)} />
                  <Detail label="Sunset" value={formatTime(fd.astro.sunset, settings.hourFormat)} />
                  <Detail label="Day length" value={dayLength(fd.astro.sunrise, fd.astro.sunset) || '--'} />
                  <Detail label="Max wind" value={`${formatWind(fd.day.maxwind_kph ?? 0, settings.speedUnit).value} ${formatWind(fd.day.maxwind_kph ?? 0, settings.speedUnit).label}`} />
                  <Detail label="Humidity" value={`${fd.day.avghumidity ?? 0}%`} />
                  <Detail label="UV" value={String(fd.day.uv ?? '--')} />
                  <Detail label="Rain" value={`${rain}% (${fd.day.totalprecip_mm ?? 0} mm)`} />
                  <Detail label="Snow" value={`${fd.day.totalsnow_cm ?? 0} cm`} />
                  <Detail label="Moon" value={fd.astro.moon_phase} />
                  <Detail label="Visibility" value={`${fd.day.avgvis_km ?? 0} km`} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const Detail = ({ label, value }) => (
  <div className="col-6 col-md-4">
    <p className="text-muted mb-0 text-uppercase small">{label}</p>
    <p className="fw-semibold mb-0">{value}</p>
  </div>
)

export default DailyForecast