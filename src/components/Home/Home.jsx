import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MainNavbar from '../MainNavbar/MainNavbar';


const Home = () => {
    const [query, setQuery] = useState(localStorage.getItem("city") || "beni suef");
    const date = new Date();

    const dates = Array.from({ length: 7 }, (_, i) => {
        const futureDate = new Date();
        futureDate.setDate(date.getDate() + i);
        return `${futureDate.getFullYear()}-${futureDate.getMonth() + 1}-${futureDate.getDate()}`;
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNameIndexes = Array.from({ length: 7 }, (_, i) => (date.getDay() + i) % 7);
    const dayNamesArray = dayNameIndexes.map(index => dayNames[index]);

    const [forecasts, setForecasts] = useState(Array(7).fill([]));

    const getForecastWeather = async (city, date, index) => {
        try {
            const { data } = await axios.get(
                `https://api.weatherapi.com/v1/forecast.json?key=841319420b9143e1b02180335232302&q=${city}&aqi=yes&dt=${date}`
            );
            setForecasts(prev => {
                const updatedForecasts = [...prev];
                updatedForecasts[index] = data;
                return updatedForecasts;
            });
        } catch (error) {
            console.error("Error fetching weather data", error);
        }
    };

    useEffect(() => {
        dates.forEach((date, index) => {
            getForecastWeather(query, date, index);
        });
        localStorage.setItem("city", query);
    }, [dates, query])

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async position => {
                    const { latitude, longitude } = position.coords;
                    const { data } = await axios.get(
                        `https://api.weatherapi.com/v1/search.json?key=841319420b9143e1b02180335232302&q=${latitude},${longitude}`
                    );
                    const city = data[0]?.name || "beni suef";
                    setQuery(city);
                },
                error => {
                    console.error("Error fetching location", error);
                    alert("Unable to fetch current location. Please allow location access.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleQueryChange = e => {
        const value = e.target.value;
        setQuery(value || "beni suef");
    };

    return (
        <>
            <MainNavbar handleQueryChange={handleQueryChange} query={query} handleUseCurrentLocation={handleUseCurrentLocation} />
            <div className="container">
                <div className='row'>
                    {forecasts && forecasts.length > 0 && forecasts[0]?.location ? (<>
                        <div className="col-lg-8">
                            <div className="box d-flex justify-content-between align-items-center flex-wrap px-4">
                                <div>
                                    <h2 className="fw-semibold h1">{forecasts[0].location.name}</h2>
                                    <p className="text-muted">{forecasts[0].current.condition.text}</p>
                                </div>
                                <div className="text-center">
                                    <img src={forecasts[0].current.condition.icon} alt="Weather Icon" />
                                    <p className="h4">{forecasts[0].current.is_day === 1 ? 'Day' : 'Night'}</p>
                                    <p className="fs-1">
                                        {forecasts[0].current.temp_c}
                                        <span>&#176;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="box py-3 mt-4 px-2">
                                <h5 className="box-title fw-semibold ps-3">24-Hour Forecast</h5>
                                <div
                                    className="d-flex py-2 forecast-container"
                                    style={{
                                        overflowX: "scroll",
                                        display: "flex",
                                        gap: "16px",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {forecasts[0].forecast?.forecastday[0]?.hour.map((hourData, idx) => {
                                        const time24 = hourData.time.split(" ")[1];
                                        const [hour, minute] = time24.split(":");
                                        const hour12 = (hour % 12) || 12;
                                        const period = hour < 12 ? "AM" : "PM";

                                        return (
                                            <div
                                                key={idx}
                                                className="text-center forecast-item"
                                            >
                                                <p className="text-light m-0">{`${hour12}:${minute} ${period}`}</p>
                                                <img
                                                    src={hourData.condition.icon}
                                                    alt={`Weather icon at ${hourData.time}`}
                                                    style={{ width: "80px", height: "80px" }}
                                                />
                                                <p className="text-muted fs-2 m-0">
                                                    {hourData.temp_c}
                                                    <span>&#176;</span>
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="details d-flex justify-content-between align-items-center flex-wrap mt-4 text-muted">
                                <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-sun me-1" style={{ color: '#FFC107' }}></i>UV INDEX
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.uv}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-wind" style={{ color: '#00B0FF' }}></i> WIND
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.wind_kph} Km/h </p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-compass" style={{ color: '#32CD32' }}></i> WIND DIRECTION
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4">{forecasts[0].current.wind_dir}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-shower" style={{ color: '#1E90FF' }}></i> HUMIDITY
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.humidity} % </p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-eye" style={{ color: '#808080' }}></i> VISIBILITY
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.vis_km} Km </p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-temperature-three-quarters" style={{ color: '#FF6347' }}></i> REAL FEEL
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.feelslike_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-droplet" style={{ color: '#20B2AA' }}></i> CHANCE OF RAIN
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].forecast?.forecastday[0]?.day.daily_chance_of_rain}%</p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-temperature-three-quarters" style={{ color: '#D3D3D3' }}></i> PRESSURE
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].current.pressure_mb} hPa</p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-sun-plant-wilt me-1" style={{ color: '#FFA500' }}></i>SUNRISE
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].forecast?.forecastday[0]?.astro.sunrise}</p>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                    <div className="box p-4">
                                        <p className="fw-semibold fs-5 mb-0">
                                            <i className="fa-solid fa-cloud-sun me-1" style={{ color: '#FFD700' }}></i>SUNSET
                                        </p>
                                        <p className="fw-semibold fs-5 mb-0 ms-4"> {forecasts[0].forecast?.forecastday[0]?.astro.sunset}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 my-lg-0 my-4">
                            <div className="box px-4 py-3">
                                <h5> 7 Days Forecast</h5>
                                {forecasts.map((forecast, i) => {
                                    return (
                                        <div key={i} className="d-flex justify-content-center flex-column">
                                            <div className="row d-flex justify-content-between align-items-center py-3">
                                                <p className="col-4 m-0">{i === 0 ? "Today" : dayNamesArray[i]}</p>
                                                <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                                    <img style={{ width: "50px" }} className="mx-1" src={forecast.forecast?.forecastday[0]?.day.condition.icon} alt="" />
                                                    <p className="m-0 small">{forecast.forecast?.forecastday[0]?.day.condition.text}</p>
                                                </div>
                                                <p className="col-4 text-end m-0 small">{forecast.forecast?.forecastday[0]?.day.maxtemp_c}/{forecast.forecast?.forecastday[0]?.day.mintemp_c}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                    ) : (
                        <p>No forecast data available</p>
                    )}
                </div>
            </div >
        </>
    )
}

export default Home