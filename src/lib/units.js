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