import React from 'react'
import { Icon } from '../Icons/Icons'

const ErrorRetry = ({ error, onRetry, compact }) => {
  const message = error?.message || 'The weather service did not respond.'

  if (compact) {
    return (
      <div className="notice is-error" role="alert">
        <Icon name="alert" size={14} />
        <span className="notice-text">{message}</span>
        <button type="button" className="ghost-btn" onClick={onRetry}>
          <Icon name="rotate" size={12} />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="error-pane" role="alert">
      <div className="tile error-tile">
        <header className="tile-head">
          <h2 className="tile-label">Connection error</h2>
          <span className="tile-meta">No data</span>
        </header>
        <p className="error-message">{message}</p>
        <button type="button" className="btn" onClick={onRetry}>
          <Icon name="rotate" size={13} />
          Retry
        </button>
      </div>
    </div>
  )
}

export default ErrorRetry
