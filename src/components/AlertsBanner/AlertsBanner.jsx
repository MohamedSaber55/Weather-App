import React, { useState } from 'react'
import { formatTime } from '../../lib/units'

const HAZARD_COLORS = {
  'flood warning': '#2196F3',
  'hurricane': '#9C27B0',
  'tropical storm': '#7B1FA2',
  'thunderstorm': '#F44336',
  'severe thunderstorm': '#D32F2F',
  'tornado': '#880E4F',
  'blizzard': '#607D8B',
  'winter storm': '#5C6BC0',
  'extreme cold': '#3F51B5',
  'extreme heat': '#FF5722',
  'fire': '#E64A19',
  'red flag': '#C62828',
}

const AlertsBanner = ({ alerts, settings }) => {
  const [open, setOpen] = useState(false)
  if (!alerts?.alert?.length) return null
  const alert = alerts.alert[0]

  const title = alert.event || alert.headline || 'Weather alert'
  const color = Object.entries(HAZARD_COLORS).find(([k]) => title.toLowerCase().includes(k))?.[1] || '#FF9800'

  return (
    <div className="alert-banner box p-3 d-flex align-items-center gap-3" role="alert">
      <i className="fa-solid fa-triangle-exclamation fs-3" style={{ color }} />
      <div className="flex-grow-1">
        <p className="fw-semibold mb-0" style={{ color }}>{title}</p>
        <p className="small text-muted mb-0">
          {alert.areas && <span>{alert.areas} · </span>}
          {alert.effective && <span>From {alert.effective.split(' ')[0]} </span>}
          {alert.expires && <span>until {formatTime(alert.expires, settings.hourFormat)}</span>}
        </p>
      </div>
      <button className="btn btn-sm btn-outline-warning border-0 ms-auto" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {open ? 'Hide' : 'Details'}
      </button>
      {open && (
        <div className="alert-detail small">
          {alert.headline && <p className="fw-semibold">{alert.headline}</p>}
          {alert.desc && <p className="text-muted">{alert.desc}</p>}
          {alert.instruction && <p className="text-info">{alert.instruction}</p>}
        </div>
      )}
    </div>
  )
}

export default AlertsBanner