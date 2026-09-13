import React from 'react'
import { moonPhase } from '../../lib/conditions'
import { dayLength, formatTime } from '../../lib/units'

const MoonPhase = ({ astro, settings }) => {
  if (!astro) return null
  const phase = astro.moon_phase || 'Moon'
  const illumination = astro.moon_illumination

  return (
    <div className="box p-4 h-100">
      <p className="fw-semibold fs-6 mb-2">
        <i className="fa-solid fa-moon me-2" style={{ color: '#9FA8DA' }} />MOON
      </p>
      <div className="moon-big text-center">
        <span className="moon-emoji">{moonPhase(phase)}</span>
        <p className="fw-semibold mb-0 mt-2">{phase}</p>
        <p className="small text-muted">{typeof illumination === 'number' ? `${Math.round(illumination)}% illuminated` : 'Illumination n/a'}</p>
      </div>
      {astro.moonrise && astro.moonset && (
        <div className="d-flex justify-content-between mt-3 small">
          <span className="text-muted"><i className="fa-solid fa-arrow-up-long text-success me-1" />{formatTime(astro.moonrise, settings.hourFormat)}</span>
          <span className="text-muted"><i className="fa-solid fa-arrow-down-long text-danger me-1" />{formatTime(astro.moonset, settings.hourFormat)}</span>
        </div>
      )}
      {astro.sunrise && (
        <p className="small text-muted mt-2 mb-0">
          <i className="fa-regular fa-sun me-1" />Day length {dayLength(astro.sunrise, astro.sunset)}
        </p>
      )}
    </div>
  )
}

export default MoonPhase