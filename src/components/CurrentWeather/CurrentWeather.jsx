import React from 'react'
import { formatTemp, formatDateTime, localTime, formatTime } from '../../lib/units'
import { getCategory } from '../../lib/conditions'

const CurrentWeather = ({ data, isFavorite, onToggleFavorite, settings }) => {
  const { location, current, forecast } = data
  const today = forecast?.forecastday?.[0]
  const day = today?.day
  const astro = today?.astro

  const isDay = current.is_day === 1
  const local = localTime(location.localtime)
  const { time } = formatDateTime(local, settings.hourFormat)
  const category = getCategory(current.condition.code)

  return (
    <div className="box current-weather px-4 py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-semibold h1 mb-0">{location.name}</h2>
            <button
              type="button"
              className={`btn btn-sm btn-outline-warning fav-btn${isFavorite ? ' active' : ''}`}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-star`} />
            </button>
          </div>
          <p className="text-muted mb-1">
            {location.region && `${location.region}, `}{location.country}
          </p>
          <p className="small text-muted mb-0">
            <i className="fa-regular fa-clock me-1" />
            Local time {time}
            {location.tz_id && <span className="mx-1">·</span>}
            {location.tz_id}
          </p>
        </div>
        <div className="text-center">
          <div className="condition-icon-wrap">
            <img src={current.condition.icon} alt="" width="90" height="90" />
            <span className={`day-night-badge${isDay ? ' day' : ' night'}`}>
              <i className={`fa-solid ${isDay ? 'fa-sun' : 'fa-moon'} me-1`} />
              {isDay ? 'Day' : 'Night'}
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-4 mt-3">
        <div className="big-temp">
          <span className="temp-number">{formatTemp(current.temp_c, settings.tempUnit)}</span>
          <span className="feels text-muted d-block">
            Feels like {formatTemp(current.feelslike_c, settings.tempUnit)}
          </span>
        </div>
        <div className="current-condition">
          <p className="h4 fw-semibold mb-1">{current.condition.text}</p>
          <p className="small text-muted mb-0 text-capitalize">{category} conditions</p>
        </div>
        <div className="hi-lo ms-sm-auto">
          <p className="fw-semibold mb-1">
            <i className="fa-solid fa-arrow-up text-success me-1" />H {formatTemp(day?.maxtemp_c, settings.tempUnit)}
          </p>
          <p className="fw-semibold mb-0">
            <i className="fa-solid fa-arrow-down text-primary me-1" />L {formatTemp(day?.mintemp_c, settings.tempUnit)}
          </p>
        </div>
      </div>

      {astro && (
        <div className="sun-path d-flex gap-4 mt-3 small text-muted">
          <span><i className="fa-solid fa-sun me-1 text-warning" />Rise {formatTime(astro.sunrise, settings.hourFormat)}</span>
          <span><i className="fa-solid fa-cloud-sun me-1 text-info" />Set {formatTime(astro.sunset, settings.hourFormat)}</span>
        </div>
      )}
    </div>
  )
}

export default CurrentWeather
