// Client-side WeatherAPI key. Because the app runs on static GitHub Pages,
// there is no server to hide this — anyone can read it (it's consumed against
// the WeatherAPI quota). Override via REACT_APP_WEATHER_API_KEY in a .env file
// at build time if you want to switch keys without editing source.
export const WEATHER_API_KEY =
  process.env.REACT_APP_WEATHER_API_KEY || '841319420b9143e1b02180335232302'

export default WEATHER_API_KEY