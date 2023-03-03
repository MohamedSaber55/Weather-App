import React from 'react'
import { Link } from 'react-router-dom';
import icon from './../../WeatherIcon.png'

const MainNavbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand" to="/"> <img className="navIcon" src={icon} alt="" /> WEATHER</Link>
                </div>
            </nav>
        </>
    )
}

export default MainNavbar