const THUNDER = new Set([1087, 1235, 1240, 1273, 1276, 1279, 1282])
const SNOW = new Set([1066, 1069, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258])
const SLEET = new Set([1072, 1204, 1207, 1249, 1252, 1261, 1264, 1168, 1171, 1198, 1201, 1237, 1069])
const RAIN = new Set([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246])
const FOG = new Set([1030, 1135, 1148])
const PARTLY = new Set([1003, 1087])
const CLOUDY = new Set([1006, 1009])

export function getCategory(code) {
  const c = Number(code)
  if (THUNDER.has(c)) return 'thunder'
  if (SNOW.has(c)) return 'snow'
  if (SLEET.has(c)) return 'sleet'
  if (FOG.has(c)) return 'fog'
  if (RAIN.has(c)) return 'rain'
  if (PARTLY.has(c)) return 'partly'
  if (CLOUDY.has(c)) return 'cloudy'
  return 'clear'
}

export function uvLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4CAF50' }
  if (uv <= 5) return { label: 'Moderate', color: '#FFC107' }
  if (uv <= 7) return { label: 'High', color: '#FF9800' }
  if (uv <= 10) return { label: 'Very High', color: '#F44336' }
  return { label: 'Extreme', color: '#9C27B0' }
}

export function aqiLevel(index) {
  if (index <= 50) return { label: 'Good', color: '#4CAF50', advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.' }
  if (index <= 100) return { label: 'Moderate', color: '#FFC107', advice: 'Air quality is acceptable. Sensitive people should limit prolonged outdoor exertion.' }
  if (index <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#FF9800', advice: 'Children, the elderly and people with respiratory conditions should reduce outdoor activity.' }
  if (index <= 200) return { label: 'Unhealthy', color: '#F44336', advice: 'Everyone may begin to experience health effects. Avoid prolonged outdoor exertion.' }
  if (index <= 300) return { label: 'Very Unhealthy', color: '#9C27B0', advice: 'Health alert: everyone may experience more serious health effects. Stay indoors.' }
  return { label: 'Hazardous', color: '#880E4F', advice: 'Emergency conditions. Avoid all outdoor activity.' }
}

const MOON_PHASES = {
  'New Moon': '🌑',
  'Waxing Crescent': '🌒',
  'First Quarter': '🌓',
  'Waxing Gibbous': '🌔',
  'Full Moon': '🌕',
  'Waning Gibbous': '🌖',
  'Last Quarter': '🌗',
  'Waning Crescent': '🌘',
}

export function moonPhase(name) {
  return MOON_PHASES[name] || '🌙'
}

export function clothingAdvice(feelslikeC) {
  const c = Number(feelslikeC)
  if (c >= 32) return { text: 'Tank top, shorts and open shoes — it is very hot.', icon: 'fa-solid fa-tshirt' }
  if (c >= 25) return { text: 'Short sleeves and light fabrics.', icon: 'fa-solid fa-tshirt' }
  if (c >= 18) return { text: 'A light jacket or long sleeves feels right.', icon: 'fa-solid fa-shirt' }
  if (c >= 10) return { text: 'A warm coat, sweater and closed shoes.', icon: 'fa-solid fa-vest' }
  if (c >= 0) return { text: 'Heavy winter coat, hat, scarf and gloves.', icon: 'fa-solid fa-mitten' }
  return { text: 'Insulated gear — extreme cold. Layer up fully.', icon: 'fa-solid fa-boot-heeled' }
}

export function rainAdvice(chance) {
  if (chance >= 60) return { text: 'High rain chance — take an umbrella.', icon: 'fa-solid fa-umbrella' }
  if (chance >= 30) return { text: 'Some rain possible — a compact umbrella is smart.', icon: 'fa-solid fa-umbrella' }
  return null
}

export function activityAdvice({ category, uv, windKph, chanceOfRain }) {
  if (category === 'thunder') return { text: 'Thunderstorms — postpone outdoor activities.', icon: 'fa-solid fa-cloud-bolt' }
  if (category === 'snow' || category === 'sleet') return { text: 'Snow/ice — drive carefully, dress warm.', icon: 'fa-solid fa-person-snowboarding' }
  if (chanceOfRain >= 70) return { text: 'Heavy rain — indoor plan recommended.', icon: 'fa-solid fa-house-chimney' }
  if (category === 'rain' && chanceOfRain >= 40) return { text: 'Rain likely — bring gear if heading out.', icon: 'fa-solid fa-umbrella' }
  if (uv >= 8) return { text: 'Extreme UV — sunscreen SPF 50+, avoid midday sun.', icon: 'fa-solid fa-sun' }
  if (uv >= 6) return { text: 'High UV — wear SPF 30+ and sunglasses.', icon: 'fa-solid fa-glasses' }
  if (windKph >= 40) return { text: 'Very windy — caution near trees and scaffolding.', icon: 'fa-solid fa-wind' }
  if (windKph >= 25) return { text: 'Breezy — great for kites, harder for cycling.', icon: 'fa-solid fa-wind' }
  if (category === 'clear' || category === 'partly') return { text: 'Pleasant — a great day to be outdoors.', icon: 'fa-solid fa-tree' }
  return { text: 'A decent day for light outdoor activity.', icon: 'fa-solid fa-person-walking' }
}

export function comfortLabel({ feelslikeC, tempC, humidity }) {
  const delta = Number(feelslikeC) - Number(tempC)
  if (humidity >= 80 && tempC >= 27) return { text: 'Hot and muggy — feels stickier than the reading.', icon: 'fa-solid fa-face-grin-sweat' }
  if (delta >= 3) return { text: 'Feels warmer than the actual temperature.', icon: 'fa-solid fa-temperature-arrow-up' }
  if (delta <= -3) return { text: 'Wind chill makes it feel noticeably colder.', icon: 'fa-solid fa-temperature-arrow-down' }
  if (humidity >= 65) return { text: 'Moderately humid — comfortable but a little sticky.', icon: 'fa-solid fa-droplet' }
  return { text: 'Comfortable humidity levels.', icon: 'fa-solid fa-smile' }
}

export function conditionTitleByCategory(category) {
  const map = {
    clear: 'Clear sky',
    partly: 'Partly cloudy',
    cloudy: 'Cloudy',
    fog: 'Foggy',
    rain: 'Rainy',
    snow: 'Snowy',
    sleet: 'Wintry mix',
    thunder: 'Thunderstorms',
  }
  return map[category] || 'Weather'
}