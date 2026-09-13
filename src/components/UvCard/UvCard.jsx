import React from 'react'
import { uvLevel } from '../../lib/conditions'

const UV_STOPS = [
  { at: 0, color: '#4CAF50' },
  { at: 2, color: '#FFC107' },
  { at: 5, color: '#FF9800' },
  { at: 7, color: '#F44336' },
  { at: 10, color: '#9C27B0' },
]

function burnTime(uv) {
  if (uv <= 2) return 'Up to 30+ min before burning'
  if (uv <= 5) return '~20 min before burning'
  if (uv <= 7) return '~12 min before burning'
  if (uv <= 10) return '~6 min before burning'
  return 'Under 5 min before burning'
}

const UvCard = ({ uv }) => {
  if (typeof uv !== 'number') return null
  const level = uvLevel(uv)
  const pct = Math.min(uv, 11) / 11 * 100

  return (
    <div className="box p-4 h-100">
      <p className="box-title fw-semibold fs-6 mb-3">
        <i className="fa-solid fa-sun me-2" style={{ color: '#FFC107' }} />UV INDEX
      </p>
      <div className="d-flex align-items-baseline gap-3">
        <span className="display-4 fw-bold" style={{ color: level.color }}>{Math.round(uv)}</span>
        <div>
          <p className="fw-semibold mb-0" style={{ color: level.color }}>{level.label}</p>
          <p className="small text-muted mb-0">{burnTime(uv)}</p>
        </div>
      </div>
      <div className="uv-bar mt-3" role="meter" aria-valuenow={Math.round(uv)} aria-valuemin="0" aria-valuemax="11">
        {UV_STOPS.map((s, i) => (
          <span key={i} className="uv-stop" style={{ background: s.color }} />
        ))}
        <span className="uv-marker" style={{ left: `${pct}%` }} />
      </div>
      <div className="uv-labels d-flex justify-content-between small text-muted mt-1">
        <span>0</span><span>3</span><span>6</span><span>8</span><span>10</span><span>11+</span>
      </div>
      {uv >= 6 && (
        <div className="small text-warning mt-2">
          <i className="fa-solid fa-circle-exclamation me-1" />Use SPF {uv >= 8 ? '50+' : '30+'}, sunglasses and shade between 11:00–16:00.
        </div>
      )}
    </div>
  )
}

export default UvCard