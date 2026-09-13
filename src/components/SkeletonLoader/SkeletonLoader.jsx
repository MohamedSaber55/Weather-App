import React from 'react'

const SkeletonLoader = () => (
  <div className="skeleton-wrap" aria-busy="true" aria-label="Loading weather data">
    <div className="box skeleton skeleton-hero" />
    <div className="row g-3 mt-0">
      <div className="col-lg-8">
        <div className="box skeleton skeleton-card" />
        <div className="box skeleton skeleton-card" />
        <div className="d-flex flex-wrap gap-3 mt-3">
          <div className="box skeleton skeleton-tile" />
          <div className="box skeleton skeleton-tile" />
          <div className="box skeleton skeleton-tile" />
          <div className="box skeleton skeleton-tile" />
        </div>
      </div>
      <div className="col-lg-4">
        <div className="box skeleton skeleton-card" />
      </div>
    </div>
  </div>
)

export default SkeletonLoader