import React from 'react'

function arcPath(cx, cy, r, fromDeg, toDeg) {
  const point = deg => [cx + r * Math.cos((deg * Math.PI) / 180), cy - r * Math.sin((deg * Math.PI) / 180)]
  const [x0, y0] = point(fromDeg)
  const [x1, y1] = point(toDeg)
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

// Semicircle gauge: colored ranges, the active one at full strength, needle at `value`
const Gauge = ({ ranges, total, value, label, width = 120, stroke = 10 }) => {
  const height = width / 2 + 8
  const cx = width / 2
  const cy = width / 2
  const r = width / 2 - stroke / 2 - 2
  const v = Math.min(Math.max(Number(value) || 0, 0), total)
  const angle = ((180 - (v / total) * 180) * Math.PI) / 180
  const needle = r - stroke / 2 - 6

  return (
    <svg className="gauge" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {ranges.map((range, i) => (
        <path
          key={i}
          d={arcPath(cx, cy, r, 180 - (range.from / total) * 180 - 1, 180 - (range.to / total) * 180 + 1)}
          fill="none"
          stroke={range.color}
          strokeWidth={stroke}
          opacity={range.active ? 1 : 0.28}
        />
      ))}
      <path
        className="gauge-needle"
        d={`M${cx} ${cy} L${(cx + needle * Math.cos(angle)).toFixed(1)} ${(cy - needle * Math.sin(angle)).toFixed(1)}`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="gauge-hub" cx={cx} cy={cy} r="4" />
    </svg>
  )
}

export default Gauge
