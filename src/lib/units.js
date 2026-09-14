export const round1 = n => Math.round(n * 10) / 10
export const round = n => Math.round(n)

const pad = n => String(n).padStart(2, '0')

export function formatTemp(celsius, unit) {
  const value = unit === 'F' ? round((celsius * 9) / 5 + 32) : round(celsius)
  return `${value}°${unit}`
}

export function formatTempValue(celsius, unit) {
  return unit === 'F' ? round1((celsius * 9) / 5 + 32) : round1(celsius)
}

export function formatWind(kph, unit) {
  const value = unit === 'mph' ? round1(kph * 0.621371) : round1(kph)
  const label = unit === 'mph' ? 'mph' : 'km/h'
  return { value: `${value}`, label }
}

export function formatVisibility(km, unit) {
  const value = unit === 'mi' ? round1(km * 0.621371) : round1(km)
  const label = unit === 'mi' ? 'mi' : 'km'
  return { value: `${value}`, label }
}

export function formatPressure(mb, unit) {
  if (unit === 'inHg') return { value: round1(mb * 0.0295299830714), label: 'inHg' }
  return { value: round(mb), label: 'hPa' }
}

export function parseClock(input) {
  if (!input) return null
  const m = String(input).match(/((?:0?[0-9]|1[0-9]|2[0-3])):([0-5][0-9])\s*(AM|PM)?/i)
  if (!m) return null
  let h = parseInt(m[1], 10)
  const mi = parseInt(m[2], 10)
  const ap = (m[3] || '').toUpperCase()
  if (ap === 'PM' && h < 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return { h, mi }
}

export function formatTime(input, hourFormat) {
  const clock = parseClock(input)
  if (!clock) return input || '--'
  let { h, mi } = clock
  if (hourFormat === 12) {
    const ap = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${pad(mi)} ${ap}`
  }
  return `${pad(h)}:${pad(mi)}`
}

export function dayLength(sunrise, sunset) {
  const s = parseClock(sunrise)
  const e = parseClock(sunset)
  if (!s || !e) return null
  let minutes = e.h * 60 + e.mi - (s.h * 60 + s.mi)
  if (minutes < 0) minutes += 24 * 60
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function localTime(localtime) {
  // "2026-09-13 05:30" (per the location's timezone)
  const m = String(localtime || '').match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
  if (!m) return null
  const [, y, mo, d, h, mi] = m.map(Number)
  return new Date(y, mo - 1, d, h, mi)
}

export function formatDateTime(date, hourFormat) {
  if (!date || Number.isNaN(date.getTime())) return '--'
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const datePart = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  const time = formatTime(`${pad(date.getHours())}:${pad(date.getMinutes())}`, hourFormat)
  return { datePart, time }
}
export const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export function fixed1(n) {
  const v = Number(n)
  return n === null || n === undefined || Number.isNaN(v) ? '--' : v.toFixed(1)
}

export function tempValue(celsius, unit) {
  return unit === 'F' ? (celsius * 9) / 5 + 32 : celsius
}

export function speedValue(kph, unit) {
  return unit === 'mph' ? kph * 0.621371 : kph
}

export const speedLabel = unit => (unit === 'mph' ? 'mph' : 'km/h')

// "06:31 AM" / "2026-09-14 12:40" -> 6.52 / 12.67 (fractional hours)
export function clockHours(input) {
  const c = parseClock(input)
  return c ? c.h + c.mi / 60 : null
}

// Offset between the location's wall clock and UTC, e.g. "UTC+3" or "UTC+5:30"
export function utcOffsetLabel(localtime, epoch) {
  const m = String(localtime || '').match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})/)
  if (!m || !epoch) return null
  const wallAsUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 1000
  const minutes = Math.round((wallAsUtc - epoch) / 900) * 15
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const mi = abs % 60
  return `UTC${minutes < 0 ? '-' : '+'}${h}${mi ? `:${pad(mi)}` : ''}`
}

export function coordsLabel(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return ''
  return `${Math.abs(lat).toFixed(2)}${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}${lon >= 0 ? 'E' : 'W'}`
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "2026-09-14 12:40" -> "Mon 14 Sep 2026"
export function dateStamp(localtime) {
  const d = localTime(localtime)
  if (!d) return ''
  return `${DAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

// "2026-09-14" -> "Mon 14"
export function dayStamp(date) {
  const d = new Date(`${date}T12:00:00`)
  if (Number.isNaN(d.getTime())) return String(date || '')
  return `${DAYS_SHORT[d.getDay()]} ${d.getDate()}`
}

// "2026-09-14 12:30" + 15 -> "12:45" (in the location's wall clock)
export function addMinutes(localtime, minutes, hourFormat) {
  const d = localTime(localtime)
  if (!d) return '--'
  d.setMinutes(d.getMinutes() + minutes)
  return formatTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`, hourFormat)
}
