import React from 'react'
import { KeyValue, Tile } from '../Tile/Tile'
import { formatVisibility } from '../../lib/units'

const PressureTile = ({ current, settings }) => {
  const mb = current.pressure_mb ?? 0
  const hPa = { value: String(Math.round(mb)), label: 'hPa' }
  const inHg = { value: (mb * 0.0295299830714).toFixed(2), label: 'inHg' }
  const [main, alternate] = settings.pressureUnit === 'inHg' ? [inHg, hPa] : [hPa, inHg]
  const vis = formatVisibility(current.vis_km ?? 0, settings.distanceUnit)

  return (
    <Tile label="Pressure" meta="MSL" className="t-pres">
      <span className="big-reading">
        <span className="num-xl">{main.value}</span>
        <span className="unit">{main.label}</span>
      </span>
      <div className="kv-list tile-foot">
        <KeyValue label={alternate.label} value={alternate.value} />
        <KeyValue label="Visibility" value={`${vis.value} ${vis.label}`} />
      </div>
    </Tile>
  )
}

export default PressureTile
