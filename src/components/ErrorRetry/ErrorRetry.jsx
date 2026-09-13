import React from 'react'

const ErrorRetry = ({ error, onRetry, compact }) => {
  if (compact) {
    return (
      <div className="error-banner" role="alert">
        <i className="fa-solid fa-triangle-exclamation me-2 text-warning" />
        <span className="flex-grow-1">{error?.message || 'Something went wrong.'}</span>
        <button className="btn btn-sm btn-outline-warning border-0" onClick={onRetry}>
          <i className="fa-solid fa-rotate me-1" />Retry
        </button>
      </div>
    )
  }
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <div className="box p-5 text-center" role="alert">
        <i className="fa-solid fa-cloud-bolt fs-1 text-warning mb-3 d-block" />
        <h4 className="fw-bold">Could not load weather</h4>
        <p className="text-muted mb-4">{error?.message || 'The weather service did not respond.'}</p>
        <button className="btn btn-warning px-4" onClick={onRetry}>
          <i className="fa-solid fa-rotate me-2" />Try again
        </button>
      </div>
    </div>
  )
}

export default ErrorRetry