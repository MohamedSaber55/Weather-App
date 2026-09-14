const THUNDER = new Set([1087, 1235, 1240, 1273, 1276, 1279, 1282])
const SNOW = new Set([1066, 1069, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258])
const SLEET = new Set([1072, 1204, 1207, 1249, 1252, 1261, 1264, 1168, 1171, 1198, 1201, 1237, 1069])
const RAIN = new Set([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246])
const FOG = new Set([1030, 1135, 1148])
const PARTLY = new Set([1003, 1087])
const CLOUDY = new Set([1006, 1009])
const DUST = new Set([1024, 1027])

// `text` is a fallback for condition codes this map does not know yet
// (WeatherAPI keeps adding them, e.g. blowing dust and sandstorms)
export function getCategory(code, text) {
  const c = Number(code)
  if (THUNDER.has(c)) return 'thunder'
  if (SNOW.has(c)) return 'snow'
  if (SLEET.has(c)) return 'sleet'
  if (FOG.has(c)) return 'fog'
  if (RAIN.has(c)) return 'rain'
  if (PARTLY.has(c)) return 'partly'
  if (CLOUDY.has(c)) return 'cloudy'
  if (DUST.has(c)) return 'dust'

  const t = String(text || '').toLowerCase()
  if (t) {
    if (/dust|sand|smoke|haze/.test(t)) return 'dust'
    if (/thunder|lightning/.test(t)) return 'thunder'
    if (/blizzard|snow/.test(t)) return 'snow'
    if (/sleet|ice pellet|freezing/.test(t)) return 'sleet'
    if (/fog|mist/.test(t)) return 'fog'
    if (/rain|drizzle|shower/.test(t)) return 'rain'
    if (/partly/.test(t)) return 'partly'
    if (/cloud|overcast/.test(t)) return 'cloudy'
  }
  return 'clear'
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
    dust: 'Dust and sand',
  }
  return map[category] || 'Weather'
}

// WeatherAPI condition text shortened for narrow table cells ("Partly cloudy" -> "Pt cloudy")
const ABBREVIATIONS = [
  [/\bthundery outbreaks\b/gi, 'T-storms'],
  [/\bpartly\b/gi, 'Pt'],
  [/\bmoderate\b/gi, 'Mod'],
  [/\bheavy\b/gi, 'Hvy'],
  [/\blight\b/gi, 'Lt'],
  [/\bpossible\b/gi, 'poss'],
  [/\bnearby\b/gi, 'nrby'],
  [/\bshowers\b/gi, 'shwrs'],
]

export function shortCondition(text) {
  let s = String(text || '').trim()
  if (s.length <= 10) return s
  for (const [re, short] of ABBREVIATIONS) s = s.replace(re, short)
  return s
}

export const UV_RANGES = [
  { from: 0, to: 2.5, color: '#4CAF50' },
  { from: 2.5, to: 5.5, color: '#FFC107' },
  { from: 5.5, to: 7.5, color: '#FF9800' },
  { from: 7.5, to: 10.5, color: '#F44336' },
  { from: 10.5, to: 12, color: '#9C27B0' },
]

export function uvLevel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4CAF50' }
  if (uv <= 5) return { label: 'Moderate', color: '#FFC107' }
  if (uv <= 7) return { label: 'High', color: '#FF9800' }
  if (uv <= 10) return { label: 'Very high', color: '#F44336' }
  return { label: 'Extreme', color: '#9C27B0' }
}

export function uvBurnTime(uv) {
  if (uv <= 2) return '30+ min'
  if (uv <= 5) return '~20 min'
  if (uv <= 7) return '~12 min'
  if (uv <= 10) return '~6 min'
  return '<5 min'
}

export function uvProtection(uv) {
  if (uv < 3) return 'None needed'
  if (uv < 6) return 'SPF 30+'
  if (uv < 8) return 'SPF 30+ · 11–16'
  return 'SPF 50+ · 11–16'
}

const AQI_LEVELS = [
  { label: 'Good', color: '#4CAF50', advice: 'Air quality is satisfactory, with little or no risk.' },
  { label: 'Moderate', color: '#FFC107', advice: 'Sensitive groups: limit prolonged outdoor exertion.' },
  { label: 'Unhealthy for sensitive groups', color: '#FF9800', advice: 'Children, older adults and people with lung conditions should reduce outdoor activity.' },
  { label: 'Unhealthy', color: '#F44336', advice: 'Everyone may feel effects. Avoid prolonged outdoor exertion.' },
  { label: 'Very unhealthy', color: '#9C27B0', advice: 'Health alert: stay indoors when possible.' },
  { label: 'Hazardous', color: '#880E4F', advice: 'Emergency conditions. Avoid all outdoor activity.' },
]

export const AQI_COLORS = AQI_LEVELS.map(l => l.color)

// WeatherAPI's `us-epa-index` is the US EPA category (1–6), not the 0–500 AQI number
export function aqiLevel(index) {
  const i = Math.min(6, Math.max(1, Math.round(Number(index) || 1)))
  return { index: i, ...AQI_LEVELS[i - 1] }
}

const MOON_ABBREVIATIONS = {
  'New Moon': 'NEW',
  'Waxing Crescent': 'WXC',
  'First Quarter': '1QTR',
  'Waxing Gibbous': 'WXG',
  'Full Moon': 'FULL',
  'Waning Gibbous': 'WNG',
  'Last Quarter': '3QTR',
  'Waning Crescent': 'WNC',
}

export function moonAbbreviation(phase) {
  return MOON_ABBREVIATIONS[phase] || String(phase || '--').slice(0, 4).toUpperCase()
}

export function moonIsWaning(phase) {
  return /waning|last quarter/i.test(String(phase || ''))
}

export function clothingAdvice(feelslikeC) {
  const c = Number(feelslikeC)
  if (c >= 32) return { text: 'Tank top, shorts and open shoes — it is very hot.' }
  if (c >= 25) return { text: 'Short sleeves and light fabrics.' }
  if (c >= 18) return { text: 'A light jacket or long sleeves feels right.' }
  if (c >= 10) return { text: 'A warm coat, sweater and closed shoes.' }
  if (c >= 0) return { text: 'Heavy winter coat, hat, scarf and gloves.' }
  return { text: 'Insulated gear — extreme cold. Layer up fully.' }
}

export function rainAdvice(chance) {
  if (chance >= 60) return { text: 'High rain chance — take an umbrella.' }
  if (chance >= 30) return { text: 'Some rain possible — a compact umbrella is smart.' }
  return null
}

export function activityAdvice({ category, uv, windKph, chanceOfRain }) {
  if (category === 'dust') return { tag: 'Dust', text: 'Dust in the air — keep windows shut and wear a mask outdoors.' }
  if (category === 'thunder') return { tag: 'Storm', text: 'Thunderstorms — postpone outdoor activities.' }
  if (category === 'snow' || category === 'sleet') return { tag: 'Snow', text: 'Snow/ice — drive carefully, dress warm.' }
  if (chanceOfRain >= 70) return { tag: 'Rain', text: 'Heavy rain — indoor plan recommended.' }
  if (category === 'rain' && chanceOfRain >= 40) return { tag: 'Rain', text: 'Rain likely — bring gear if heading out.' }
  if (uv >= 8) return { tag: 'UV', text: 'Extreme UV — sunscreen SPF 50+, avoid midday sun.' }
  if (uv >= 6) return { tag: 'UV', text: 'High UV — wear SPF 30+ and sunglasses.' }
  if (windKph >= 40) return { tag: 'Wind', text: 'Very windy — caution near trees and scaffolding.' }
  if (windKph >= 25) return { tag: 'Wind', text: 'Breezy — great for kites, harder for cycling.' }
  if (category === 'clear' || category === 'partly') return { tag: 'Outdoor', text: 'Pleasant — a great day to be outdoors.' }
  return { tag: 'Outdoor', text: 'A decent day for light outdoor activity.' }
}

export function comfortLabel({ feelslikeC, tempC, humidity }) {
  const delta = Number(feelslikeC) - Number(tempC)
  if (humidity >= 80 && tempC >= 27) return { text: 'Hot and muggy — feels stickier than the reading.' }
  if (delta >= 3) return { text: 'Feels warmer than the actual temperature.' }
  if (delta <= -3) return { text: 'Wind chill makes it feel noticeably colder.' }
  if (humidity >= 65) return { text: 'Moderately humid — comfortable but a little sticky.' }
  return { text: 'Comfortable humidity levels.' }
}
