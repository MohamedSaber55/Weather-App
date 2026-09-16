import { useI18n } from '../../context/SettingsContext'
import React, { useState } from 'react'
import { Icon } from '../Icons/Icons'
import { formatTime } from '../../lib/units'

const HAZARD_COLORS = {
  'flood warning': '#2196F3',
  hurricane: '#9C27B0',
  'tropical storm': '#7B1FA2',
  thunderstorm: '#F44336',
  'severe thunderstorm': '#D32F2F',
  tornado: '#880E4F',
  blizzard: '#607D8B',
  'winter storm': '#5C6BC0',
  'extreme cold': '#3F51B5',
  'extreme heat': '#FF5722',
  fire: '#E64A19',
  'red flag': '#C62828',
}

const AlertsBanner = ({ alerts, settings }) => {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const alert = alerts?.alert?.[0]
  if (!alert) return null

  const title = alert.event || alert.headline || t('alert.title')
  const color = Object.entries(HAZARD_COLORS).find(([k]) => title.toLowerCase().includes(k))?.[1] || '#FF9800'
  const extra = (alerts.alert?.length || 1) - 1

  return (
    <section className="alert-strip" role="alert" style={{ '--hazard': color }}>
      <span className="alert-tag">
        <Icon name="alert" size={13} />
        {t('alert.tag')}
      </span>
      <div className="alert-body">
        <p className="alert-title">{title}</p>
        <p className="alert-meta">
          {[
            alert.areas,
            alert.effective ? t('alert.from', { date: alert.effective.split(' ')[0] }) : null,
            alert.expires ? t('alert.until', { time: formatTime(alert.expires, settings.hourFormat) }) : null,
            extra > 0 ? t('alert.more', { count: extra }) : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {open && (
          <div className="alert-detail">
            {alert.headline && <p className="alert-headline">{alert.headline}</p>}
            {alert.desc && <p>{alert.desc}</p>}
            {alert.instruction && <p className="alert-instruction">{alert.instruction}</p>}
          </div>
        )}
      </div>
      <button type="button" className="ghost-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {open ? t('alert.hide') : t('alert.details')}
        <Icon name="chevronDown" size={12} className={open ? 'is-flipped' : ''} />
      </button>
    </section>
  )
}

export default AlertsBanner
