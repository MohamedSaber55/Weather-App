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

// translation key for the category, e.g. "cond.partly"
export function conditionTitleKey(category) {
  return `cond.${category || 'clear'}`
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
  if (uv <= 2) return { key: 'uv.low', color: '#4CAF50' }
  if (uv <= 5) return { key: 'uv.moderate', color: '#FFC107' }
  if (uv <= 7) return { key: 'uv.high', color: '#FF9800' }
  if (uv <= 10) return { key: 'uv.veryHigh', color: '#F44336' }
  return { key: 'uv.extreme', color: '#9C27B0' }
}

export function uvBurnTimeKey(uv) {
  if (uv <= 2) return 'uvBurn.30'
  if (uv <= 5) return 'uvBurn.20'
  if (uv <= 7) return 'uvBurn.12'
  if (uv <= 10) return 'uvBurn.6'
  return 'uvBurn.5'
}

export function uvProtectionKey(uv) {
  if (uv < 3) return 'uvProtect.none'
  if (uv < 6) return 'uvProtect.spf30'
  if (uv < 8) return 'uvProtect.spf30midday'
  return 'uvProtect.spf50midday'
}

const AQI_COLORS_LIST = ['#4CAF50', '#FFC107', '#FF9800', '#F44336', '#9C27B0', '#880E4F']

export const AQI_COLORS = AQI_COLORS_LIST

// WeatherAPI's `us-epa-index` is the US EPA category (1–6), not the 0–500 AQI number
export function aqiLevel(index) {
  const i = Math.min(6, Math.max(1, Math.round(Number(index) || 1)))
  return { index: i, color: AQI_COLORS_LIST[i - 1], key: `aqi.${i}`, adviceKey: `aqiAdvice.${i}` }
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
  if (c >= 32) return { key: 'wear.veryHot' }
  if (c >= 25) return { key: 'wear.hot' }
  if (c >= 18) return { key: 'wear.mild' }
  if (c >= 10) return { key: 'wear.cool' }
  if (c >= 0) return { key: 'wear.cold' }
  return { key: 'wear.freezing' }
}

export function rainAdvice(chance) {
  if (chance >= 60) return { key: 'rain.high' }
  if (chance >= 30) return { key: 'rain.some' }
  return null
}

export function activityAdvice({ category, uv, windKph, chanceOfRain }) {
  if (category === 'dust') return { tag: 'dust', key: 'activity.dust' }
  if (category === 'thunder') return { tag: 'storm', key: 'activity.storm' }
  if (category === 'snow' || category === 'sleet') return { tag: 'snow', key: 'activity.snow' }
  if (chanceOfRain >= 70) return { tag: 'rain', key: 'activity.heavyRain' }
  if (category === 'rain' && chanceOfRain >= 40) return { tag: 'rain', key: 'activity.rain' }
  if (uv >= 8) return { tag: 'uv', key: 'activity.extremeUv' }
  if (uv >= 6) return { tag: 'uv', key: 'activity.highUv' }
  if (windKph >= 40) return { tag: 'wind', key: 'activity.veryWindy' }
  if (windKph >= 25) return { tag: 'wind', key: 'activity.breezy' }
  if (category === 'clear' || category === 'partly') return { tag: 'outdoor', key: 'activity.pleasant' }
  return { tag: 'outdoor', key: 'activity.ok' }
}

export function comfortLabel({ feelslikeC, tempC, humidity }) {
  const delta = Number(feelslikeC) - Number(tempC)
  if (humidity >= 80 && tempC >= 27) return { key: 'comfort.muggy' }
  if (delta >= 3) return { key: 'comfort.warmer' }
  if (delta <= -3) return { key: 'comfort.colder' }
  if (humidity >= 65) return { key: 'comfort.humid' }
  return { key: 'comfort.fine' }
}
