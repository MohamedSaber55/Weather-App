import React from 'react'

const TILES = [
  { className: 't-temp', lines: 3 },
  { className: 't-cond', lines: 3 },
  { className: 't-wind', lines: 2 },
  { className: 't-hum', lines: 2 },
  { className: 't-pres', lines: 2 },
  { className: 't-chart', lines: 5 },
  { className: 't-fc', lines: 5 },
  { className: 't-radar', lines: 5 },
  { className: 't-aqi', lines: 3 },
  { className: 't-uv', lines: 3 },
  { className: 't-sun', lines: 2 },
  { className: 't-moon', lines: 2 },
  { className: 't-adv', lines: 3 },
]

const SkeletonLoader = () => (
  <div className="grid" aria-busy="true" aria-label="Loading weather data">
    {TILES.map(tile => (
      <section key={tile.className} className={`tile skeleton ${tile.className}`}>
        <span className="sk-line sk-head" />
        {Array.from({ length: tile.lines }, (_, i) => (
          <span key={i} className="sk-line" />
        ))}
      </section>
    ))}
  </div>
)

export default SkeletonLoader
