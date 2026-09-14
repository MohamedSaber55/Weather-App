import React from 'react'

export const Tile = ({ label, meta, className = '', children, ...rest }) => (
  <section className={`tile ${className}`.trim()} {...rest}>
    <header className="tile-head">
      <h2 className="tile-label">{label}</h2>
      {meta != null && meta !== '' && <span className="tile-meta">{meta}</span>}
    </header>
    {children}
  </section>
)

// label / value pair used across tiles ("RISE ... 06:31")
export const KeyValue = ({ label, value, accent = false, className = '' }) => (
  <div className={`kv ${className}`.trim()}>
    <span className="kv-key">{label}</span>
    <span className={`kv-value${accent ? ' is-accent' : ''}`}>{value}</span>
  </div>
)

// small stacked stat ("CLOUD / 0%")
export const Stat = ({ label, value }) => (
  <div className="stat">
    <span className="stat-key">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
)

export default Tile
