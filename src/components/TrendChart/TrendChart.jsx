import React from 'react'

const W = 640
const H = 220
const PAD = { l: 40, r: 14, t: 16, b: 30 }

const TrendChart = ({ title, icon, iconColor, entries, band, color = '#FFC107', labelEvery = 1 }) => {
  const hasSeries = entries && entries.length > 1
  const hasBand = band && band.length > 0

  if (!hasSeries && !hasBand) return null

  let minT = hasSeries ? Math.min(...entries.map(e => e.value)) : Infinity
  let maxT = hasSeries ? Math.max(...entries.map(e => e.value)) : -Infinity
  if (hasBand) {
    minT = Math.min(minT, ...band.map(b => b.low))
    maxT = Math.max(maxT, ...band.map(b => b.high))
  }
  const pad = Math.max(1, (maxT - minT) * 0.15)
  minT = Math.floor(minT - pad)
  maxT = Math.ceil(maxT + pad)

  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const x = i => PAD.l + (i / Math.max(1, (entries || band).length - 1)) * iw
  const y = v => PAD.t + ih - ((v - minT) / (maxT - minT)) * ih

  const gridLines = Array.from({ length: 5 }, (_, i) => minT + ((maxT - minT) / 4) * i)

  const linePath = hasSeries
    ? entries.map((e, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(e.value).toFixed(1)}`).join(' ')
    : ''

  const areaPath = hasSeries
    ? `${linePath} L${x(entries.length - 1).toFixed(1)},${(PAD.t + ih).toFixed(1)} L${x(0).toFixed(1)},${(PAD.t + ih).toFixed(1)} Z`
    : ''

  const bandHigh = hasBand
    ? band.map((b, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(b.high).toFixed(1)}`).join(' ')
    : ''
  const bandLow = hasBand
    ? band.map((b, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(b.low).toFixed(1)}`).join(' ')
    : ''

  return (
    <div className="box p-4">
      <p className="box-title fw-semibold fs-6 mb-2">
        <i className={`${icon} me-2`} style={{ color: iconColor }} />{title}
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="trend-chart" role="img" aria-label={title}>
        <defs>
          <linearGradient id={`grad-${iconColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridLines.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="grid-line" />
            <text x={PAD.l - 6} y={y(v) + 4} className="axis-label" textAnchor="end">{Math.round(v)}°</text>
          </g>
        ))}

        {hasSeries && (
          <>
            <path d={areaPath} fill={`url(#grad-${iconColor.replace('#', '')})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
          </>
        )}

        {hasBand && (
          <>
            <path d={bandHigh} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            <path d={bandLow} fill="none" stroke="#26A5EB" strokeWidth="2" strokeLinejoin="round" />
            <path d={`${bandHigh} L${bandLow.split(' ').reverse().join(' ').slice(1)} Z`} fill={color} opacity="0.08" />
          </>
        )}

        {(hasSeries ? entries : band).map((p, i) => (
          <g key={i}>
            <line x1={x(i)} x2={x(i)} y1={PAD.t} y2={PAD.t + ih} className="grid-line-vertical" />
            {hasSeries && (
              <circle cx={x(i)} cy={y(p.value)} r="3" fill={color}>
                <title>{`${p.label}: ${Math.round(p.value)}°`}</title>
              </circle>
            )}
            {hasBand && (
              <>
                <circle cx={x(i)} cy={y(p.high)} r="2.5" fill={color}>
                  <title>{`${p.label} high: ${Math.round(p.high)}°`}</title>
                </circle>
                <circle cx={x(i)} cy={y(p.low)} r="2.5" fill="#26A5EB">
                  <title>{`${p.label} low: ${Math.round(p.low)}°`}</title>
                </circle>
              </>
            )}
            <text x={x(i)} y={H - 8} className="axis-label" textAnchor="middle">{i % labelEvery === 0 || i === (entries || band).length - 1 ? p.label : ''}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default TrendChart