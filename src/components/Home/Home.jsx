/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Home = () => {
    const [query, setQuery] = useState("cairo");
    const date = new Date();
    const oneDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const twoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`
    const threeDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 2}`
    const fourDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 3}`
    const fiveDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 4}`
    const sixDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 5}`
    const sevenDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 6}`

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayNameOne = days[date.getDay()]
    var dayNameTwo = days[date.getDay() + 1]
    var dayNameThree = days[date.getDay() - 5]
    var dayNameFour = days[date.getDay() - 4]
    var dayNameFive = days[date.getDay() - 3]
    var dayNameSix = days[date.getDay() - 2]
    var dayNameSeven = days[date.getDay() - 1]

    const [oneDayForecast, setOneDayForecast] = useState([])
    const [twoDayForecast, setTwoDayForecast] = useState([])
    const [threeDayForecast, setThreeDayForecast] = useState([])
    const [fourDayForecast, setFourDayForecast] = useState([])
    const [fiveDayForecast, setFiveDayForecast] = useState([])
    const [sixDayForecast, setSixDayForecast] = useState([])
    const [sevenDayForecast, setSevenDayForecast] = useState([])

    const getForecastWeather = async (city, date, callback) => {
        let { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=841319420b9143e1b02180335232302&q=${city}&aqi=yes&dt=${date}`)
        callback(data);
    }

    useEffect(() => {
        getForecastWeather(query, oneDate, setOneDayForecast)
        getForecastWeather(query, twoDate, setTwoDayForecast)
        getForecastWeather(query, threeDate, setThreeDayForecast)
        getForecastWeather(query, fourDate, setFourDayForecast)
        getForecastWeather(query, fiveDate, setFiveDayForecast)
        getForecastWeather(query, sixDate, setSixDayForecast)
        getForecastWeather(query, sevenDate, setSevenDayForecast)
    }, [query])


    function getQuery(e) {
        if (!e.target.value) {
            setQuery("cairo")
        } else {
            setQuery(e.target.value)
        }
    }

    return (
        <>
            {oneDayForecast && twoDayForecast && threeDayForecast && fourDayForecast && fiveDayForecast && sixDayForecast && sevenDayForecast && oneDayForecast.current && oneDayForecast.location && oneDayForecast.forecast && oneDayForecast.forecast.forecastday && twoDayForecast.forecast.forecastday && threeDayForecast.forecast.forecastday && fourDayForecast.forecast.forecastday && fiveDayForecast.forecast.forecastday && sixDayForecast.forecast.forecastday ? <div className="container">
                <div className='row'>
                    <div className="form-label d-flex justify-content-center my-4">
                        <input onChange={getQuery} type="text" className="form-control w-75" placeholder="Search" />
                    </div>
                    <div className="col-lg-8">
                        <div className="box d-flex justify-content-between align-items-center flex-wrap px-4">
                            <div className="">
                                <h2 className="fw-semibold h1" > {oneDayForecast.location.name}</h2>
                                <p className="text-muted">{oneDayForecast.current.condition.text}</p>
                            </div>
                            <div className="text-center">
                                <img src={oneDayForecast.current.condition.icon} alt="icon" />
                                {oneDayForecast.current.is_day === 1 ? <p className="h4">Day</p> : <p className="h4">Night</p>}
                                <p className='fs-1'>{oneDayForecast.current.temp_c}<span>&#176;</span></p>
                            </div>
                        </div>
                        <div className="box py-3 mt-4 px-2">
                            <h5 className="box-title fw-semibold ps-3">Today Forecast</h5>
                            <div className="row align-items-center justify-content-center py-2">
                                <div className="col-6 col-lg-2 col-sm-4 my-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >06:00 AM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[5].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[5].temp_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 col-sm-4 my-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >09:00 AM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[8].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[8].temp_c}<span>&#176;</span></p>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 col-sm-4">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >12:00 PM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[11].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[11].temp_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 col-sm-4 my-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >03:00 PM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[14].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[14].temp_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 col-sm-4 my-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >06:00 PM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[17].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[17].temp_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-2 col-sm-4 my-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <p className="text-light m-0" >09:00 PM</p>
                                        <img className="" src={oneDayForecast.forecast.forecastday[0].hour[20].condition.icon} alt="icon" />
                                        <p className="text-muted fs-2 m-0">{oneDayForecast.forecast.forecastday[0].hour[20].temp_c}<span>&#176;</span> </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="details d-flex justify-content-between align-items-center flex-wrap mt-4 text-muted">
                            <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-sun me-1"></i>UV INDEX</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.uv}</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-wind"></i> WIND</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.wind_kph} Km/h </p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-compass"></i> WIND DIRECTION</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4">{oneDayForecast.current.wind_dir}</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-shower"></i> HUMIDITY</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.humidity} % </p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-eye"></i> VISIBILITY</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.vis_km} Km </p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-temperature-three-quarters"></i> REAL FEEL</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.feelslike_c}<span>&#176;</span> </p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-droplet"></i> CHANCE OF RAIN</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-temperature-three-quarters"></i> PRESSURE</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.current.pressure_mb} hPa</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 pe-sm-2 pe-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-sun-plant-wilt me-1"></i>SUNRISE</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.forecast.forecastday[0].astro.sunrise}</p>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 py-2 ps-sm-2 ps-0">
                                <div className="box p-4">
                                    <p className="fw-semibold fs-5 mb-0" > <i className="fa-solid fa-cloud-sun me-1"></i>SUNSET</p>
                                    <p className="fw-semibold fs-5 mb-0 ms-4"> {oneDayForecast.forecast.forecastday[0].astro.sunset}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 mt-lg-0 mt-4">
                        <div className="box px-4 py-3">
                            <h5> 7 Days Forecast</h5>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">Today</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={oneDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{oneDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{oneDayForecast.forecast.forecastday[0].day.maxtemp_c}/{oneDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameTwo}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={twoDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{twoDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{twoDayForecast.forecast.forecastday[0].day.maxtemp_c}/{twoDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameThree}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={threeDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{threeDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{threeDayForecast.forecast.forecastday[0].day.maxtemp_c}/{threeDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameFour}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={fourDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{fourDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{fourDayForecast.forecast.forecastday[0].day.maxtemp_c}/{fourDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameFive}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={fiveDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{fiveDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{fiveDayForecast.forecast.forecastday[0].day.maxtemp_c}/{fiveDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameSix}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={sixDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{sixDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{sixDayForecast.forecast.forecastday[0].day.maxtemp_c}/{sixDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center flex-column">
                                <div className="row d-flex justify-content-between align-items-center py-3">
                                    <p className="col-4 m-0">{dayNameSeven}</p>
                                    <div className="col-4 d-flex justify-content-end align-items-center flex-row">
                                        <img style={{ width: "50px" }} className="mx-1" src={sevenDayForecast.forecast.forecastday[0].day.condition.icon} alt="" />
                                        <p className="m-0 small">{sevenDayForecast.forecast.forecastday[0].day.condition.text}</p>
                                    </div>
                                    <p className="col-4 text-end m-0 small">{sevenDayForecast.forecast.forecastday[0].day.maxtemp_c}/{sevenDayForecast.forecast.forecastday[0].day.mintemp_c}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : ""}
        </>
    )
}

export default Home