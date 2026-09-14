import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
    <div className="error-pane">
        <div className="tile error-tile">
            <header className="tile-head">
                <h2 className="tile-label">404</h2>
                <span className="tile-meta">Not found</span>
            </header>
            <p className="error-message">That page does not exist.</p>
            <Link className="btn" to="/">Back to the dashboard</Link>
        </div>
    </div>
)

export default NotFound
