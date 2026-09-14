import React from 'react'
import { getCategory } from '../../lib/conditions'

const CLOUD_HIGH = 'M7 14h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 5.1 4.5 4.5 0 0 0 7 14z'

const PATHS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  locate: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.5" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  sliders: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  partly: <><path d="M8 2.5V4M2.5 8H4M4.1 4.1l1 1M11.9 4.1l-1 1" /><path d="M5.4 10.9A3.5 3.5 0 0 1 11.3 6.4" /><path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.4 12.3 3.9 3.9 0 0 0 9 20z" /></>,
  partlyNight: <><path d="M8.6 3a4 4 0 0 0 3.6 5.6 4.2 4.2 0 0 1-7.9-1.6A4.2 4.2 0 0 1 8.6 3z" /><path d="M9 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.4 12.3 3.9 3.9 0 0 0 9 20z" /></>,
  cloud: <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.6 9.6 4.5 4.5 0 0 0 7 18.5z" />,
  fog: <><path d={CLOUD_HIGH} /><path d="M4 17.5h16M7 21h10" /></>,
  rain: <><path d={CLOUD_HIGH} /><path d="M8 17.5l-1 3M12 17.5l-1 3M16 17.5l-1 3" /></>,
  snow: <><path d={CLOUD_HIGH} /><path d="M8 18h.01M12 18h.01M16 18h.01M10 21.5h.01M14 21.5h.01" /></>,
  sleet: <><path d={CLOUD_HIGH} /><path d="M8 17.5l-1 3M12 18h.01M16 17.5l-1 3M12 21.5h.01" /></>,
  thunder: <><path d={CLOUD_HIGH} /><path d="M12.5 14.5L10 18.5h4l-2.5 4" /></>,
  dust: <><path d="M3 8h11a2.5 2.5 0 1 0-2.4-3.2" /><path d="M3 12h15.5a2.5 2.5 0 1 1-2.4 3.2" /><path d="M3 16h8" /><path d="M17 8.5h.01M20 12h.01M8 20h.01M13 19.5h.01" /></>,
  star: <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />,
  play: <path d="M8 5.5v13l10-6.5z" />,
  pause: <path d="M9 5v14M15 5v14" />,
  alert: <><path d="M12 3.5L2.5 20h19z" /><path d="M12 10v4.5M12 17.5h.01" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  rotate: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  history: <><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" /><path d="M3 4v4h4M12 7.5V12l3 2" /></>,
}

export function Icon({ name, size = 16, strokeWidth = 1.6, fill = 'none', className = '', title }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  )
}

export function conditionIconName(code, isDay = true, text) {
  switch (getCategory(code, text)) {
    case 'clear':
      return isDay ? 'sun' : 'moon'
    case 'partly':
      return isDay ? 'partly' : 'partlyNight'
    case 'fog':
      return 'fog'
    case 'rain':
      return 'rain'
    case 'snow':
      return 'snow'
    case 'sleet':
      return 'sleet'
    case 'thunder':
      return 'thunder'
    case 'dust':
      return 'dust'
    default:
      return 'cloud'
  }
}

export function ConditionIcon({ code, isDay = true, text, size = 16, strokeWidth = 1.6, className = '', title }) {
  const name = conditionIconName(code, isDay, text)
  return <Icon name={name} size={size} strokeWidth={strokeWidth} className={`cond-icon cond-icon--${name} ${className}`} title={title} />
}

export function Logo({ size = 22 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 22 22" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="4" fill="currentColor" />
    </svg>
  )
}

export default Icon
