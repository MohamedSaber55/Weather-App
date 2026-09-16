import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Tile } from '../Tile/Tile'
import { moonIsWaning } from '../../lib/conditions'
import { formatTime } from '../../lib/units'

// Disc lit from the right while waxing, from the left while waning;
// the terminator is an ellipse that flips side past half-moon.
const MoonDisc = ({ illumination = 0, waning = false, size = 56 }) => {
  const r = size / 2 - 1
  const c = size / 2
  const k = Math.min(Math.max(illumination / 100, 0), 1)
  const rx = Math.abs(r * (1 - 2 * k))
  const sweep = k < 0.5 ? 0 : 1

  return (
    <svg className="moon-disc" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <g transform={waning ? `translate(${size} 0) scale(-1 1)` : undefined}>
        <circle className="moon-dark" cx={c} cy={c} r={r} />
        {k > 0.005 && (
          <path
            className="moon-lit"
            d={`M${c} ${c - r} A${r} ${r} 0 0 1 ${c} ${c + r} A${rx.toFixed(2)} ${r} 0 0 ${sweep} ${c} ${c - r}z`}
          />
        )}
      </g>
    </svg>
  )
}

const MoonTile = ({ astro, settings }) => {
  const { t } = useI18n()
  const illumination = Number(astro?.moon_illumination)
  const phase = astro?.moon_phase || 'Moon'
  const rise = astro?.moonrise

  return (
    <Tile label={t('tile.moon')} meta={Number.isFinite(illumination) ? t('meta.illum', { percent: Math.round(illumination) }) : ''} className="t-moon">
      <div className="moon-body">
        <MoonDisc illumination={Number.isFinite(illumination) ? illumination : 0} waning={moonIsWaning(phase)} />
        <div className="moon-text">
          <span className="moon-phase">{t(`moon.${phase}`)}</span>
          <span className="moon-rise">{t('label.rise')} {rise && /\d/.test(rise) ? formatTime(rise, settings.hourFormat) : '--'}</span>
        </div>
      </div>
    </Tile>
  )
}

export default MoonTile
