import { useI18n } from '../../context/SettingsContext'
import React, { useState } from 'react'
import { Tile } from '../Tile/Tile'
import { useElementWidth } from '../../hooks/useElementWidth'
import { clamp, clockHours, fixed1, formatTime, parseClock, speedLabel, speedValue, tempValue } from '../../lib/units'

const PAD = { l: 30, r: 8, t: 12, b: 24 }
const TIP_W = 170
const TIP_H = 62

function smoothPath(points) {
  const f = v => v.toFixed(1)
  let d = `M${f(points[0][0])} ${f(points[0][1])}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d
}

const TempChartTile = ({ day, current, location, settings }) => {
  const { t } = useI18n()
  const [wrapRef, width] = useElementWidth(898)
  const [hover, setHover] = useState(null)
  const hours = day?.hour || []
  const unit = settings.tempUnit

  const n = hours.length
  const W = Math.max(width, 240)
  const H = W < 560 ? 180 : 250
  const temps = hours.map(h => tempValue(h.temp_c, unit))
  const minV = n ? Math.min(...temps) : 0
  const maxV = n ? Math.max(...temps) : 1
  const lo = minV - 3
  const hi = maxV + 2
  const step = hi - lo > 30 ? 10 : 5

  const x = i => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, n - 1)
  const y = v => PAD.t + (1 - (v - lo) / (hi - lo)) * (H - PAD.t - PAD.b)
  const valueAt = idx => {
    const i = Math.floor(idx)
    const t = idx - i
    return temps[i] + ((temps[Math.min(i + 1, n - 1)] ?? temps[i]) - temps[i]) * t
  }

  const nowH = clamp(clockHours(location.localtime) ?? 0, 0, Math.max(0, n - 1))
  const active = hover ?? nowH
  const activeX = x(active)
  const activeY = n ? y(valueAt(active)) : 0

  const pickFromPointer = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect.width) return
    const px = ((e.clientX - rect.left) * W) / rect.width
    setHover(clamp(Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1)), 0, n - 1))
  }

  const onKeyDown = e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const base = hover ?? Math.round(nowH)
      setHover(clamp(base + (e.key === 'ArrowRight' ? 1 : -1), 0, n - 1))
    } else if (e.key === 'Escape') {
      setHover(null)
    }
  }

  if (n < 2) return null

  const points = temps.map((v, i) => [x(i), y(v)])
  const line = smoothPath(points)
  const area = `${line} L${x(n - 1).toFixed(1)} ${H - PAD.b} L${x(0).toFixed(1)} ${H - PAD.b} Z`

  const grid = []
  for (let v = Math.ceil(lo / step) * step; v < hi; v += step) grid.push(v)

  const every = W < 560 ? 4 : 2
  const rise = clockHours(day.astro?.sunrise)
  const set = clockHours(day.astro?.sunset)

  const hourData = hover != null ? hours[hover] : null
  const nowHour = hours[Math.floor(nowH)] || hours[0]
  const speedUnit = settings.speedUnit
  const tip = hourData
    ? {
        title: formatTime(hourData.time, settings.hourFormat),
        temp: tempValue(hourData.temp_c, unit),
        feels: tempValue(hourData.feelslike_c, unit),
        uv: hourData.uv,
        rain: hourData.chance_of_rain ?? 0,
        wind: speedValue(hourData.wind_kph ?? 0, speedUnit),
      }
    : {
        title: `${formatTime(location.localtime, settings.hourFormat)} · ${t('label.now')}`,
        temp: tempValue(current.temp_c, unit),
        feels: tempValue(current.feelslike_c, unit),
        uv: current.uv,
        rain: nowHour?.chance_of_rain ?? 0,
        wind: speedValue(current.wind_kph ?? 0, speedUnit),
      }
  const tipX = activeX + 12 + TIP_W > W - PAD.r ? activeX - 12 - TIP_W : activeX + 12

  const hourLabel = h => {
    const c = parseClock(h.time)
    if (!c) return ''
    if (settings.hourFormat === 12) return `${c.h % 12 || 12}${c.h >= 12 ? 'p' : 'a'}`
    return String(c.h).padStart(2, '0')
  }

  return (
    <Tile label={t('tile.chart')} meta={t('meta.hourly', { unit })} className="t-chart">
      <div className="chart-wrap" ref={wrapRef}>
        <svg
          className="chart"
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Hourly temperature today, from ${fixed1(minV)}° to ${fixed1(maxV)}°. Use arrow keys to inspect hours.`}
          tabIndex={0}
          onPointerMove={pickFromPointer}
          onPointerDown={pickFromPointer}
          onPointerLeave={() => setHover(null)}
          onKeyDown={onKeyDown}
          onBlur={() => setHover(null)}
        >
          {grid.map(v => (
            <g key={v}>
              <path className="chart-grid" d={`M${PAD.l} ${y(v).toFixed(1)} H${W - PAD.r}`} />
              <text className="chart-axis" x={PAD.l - 6} y={(y(v) + 3.5).toFixed(1)} textAnchor="end">{v}</text>
            </g>
          ))}
          {rise != null && <rect className="chart-night" x={PAD.l} y={PAD.t} width={Math.max(0, x(rise) - PAD.l)} height={H - PAD.t - PAD.b} />}
          {set != null && <rect className="chart-night" x={x(set)} y={PAD.t} width={Math.max(0, W - PAD.r - x(set))} height={H - PAD.t - PAD.b} />}
          <path className="chart-area" d={area} />
          <path className="chart-line" d={line} />
          <path className="chart-crosshair" d={`M${activeX.toFixed(1)} ${PAD.t} V${H - PAD.b}`} />
          <circle className="chart-dot" cx={activeX.toFixed(1)} cy={activeY.toFixed(1)} r="4.5" />
          <g className="chart-tip" transform={`translate(${tipX.toFixed(1)} ${PAD.t + 6})`}>
            <rect width={TIP_W} height={TIP_H} rx="4" />
            <text className="chart-tip-title" x="10" y="18">{tip.title}</text>
            <text className="chart-tip-temp" x="10" y="38">{fixed1(tip.temp)}°</text>
            <text className="chart-tip-feels" x="62" y="38">{t('label.feelsShort')} {fixed1(tip.feels)}</text>
            <text className="chart-tip-meta" x="10" y="54">
              {t('label.uv')} {tip.uv ?? '--'} · {t('label.rain')} {tip.rain}% · {Math.round(tip.wind)} {speedLabel(speedUnit)}
            </text>
          </g>
          {hours.map((h, i) => (i % every === 0 ? (
            <text key={h.time} className="chart-axis" x={x(i).toFixed(1)} y={H - 6} textAnchor="middle">{hourLabel(h)}</text>
          ) : null))}
        </svg>
      </div>
      <table className="sr-only">
        <caption>Hourly temperature today</caption>
        <tbody>
          {hours.map(h => (
            <tr key={h.time}>
              <th scope="row">{formatTime(h.time, settings.hourFormat)}</th>
              <td>{fixed1(tempValue(h.temp_c, unit))}°{unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Tile>
  )
}

export default TempChartTile
