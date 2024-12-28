import React from 'react'
import { Link } from 'react-router-dom';
import icon from './../../WeatherIcon.png'

const MainNavbar = ({ handleQueryChange, query, handleUseCurrentLocation }) => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
                <div className="container d-flex  flex-nowrap justify-content-between align-items-center gap-3">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <img className="navIcon me-2" src={icon} alt="Weather Icon" />
                        <span className="fw-bold d-none d-md-inline">WEATHER</span>
                    </Link>

                    <div className="d-flex gap-2 justify-content-end">
                        <input
                            onChange={handleQueryChange}
                            // value={query}
                            type="text"
                            className="form-control px-3 shadow-sm w-100"
                            placeholder="Choose location..."
                        />
                        <button
                            className="btn btn-warning shadow-sm d-flex align-items-center justify-content-center gap-1"
                            onClick={handleUseCurrentLocation}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            <i className="fa-solid fa-location-crosshairs"></i>
                            <span className="d-none d-md-inline">Current</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default MainNavbar;
