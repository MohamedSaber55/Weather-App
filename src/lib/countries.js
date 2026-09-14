// WeatherAPI returns country names ("Egypt"); the header shows ISO codes ("EG").
// Reverse the browser's own region-name table instead of shipping a country list.

const ALIASES = {
  'united states of america': 'US',
  usa: 'US',
  'united kingdom': 'GB',
  uk: 'GB',
  turkey: 'TR',
  'czech republic': 'CZ',
  swaziland: 'SZ',
  macedonia: 'MK',
  burma: 'MM',
  'ivory coast': 'CI',
  "cote d'ivoire": 'CI',
  'democratic republic of congo': 'CD',
  congo: 'CG',
  'korea, south': 'KR',
  'korea, north': 'KP',
  palestine: 'PS',
}

let names = null

function buildTable() {
  names = new Map()
  try {
    const display = new Intl.DisplayNames(['en'], { type: 'region' })
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const code = String.fromCharCode(65 + i, 65 + j)
        let name
        try {
          name = display.of(code)
        } catch {
          continue
        }
        if (name && name !== code && !names.has(name.toLowerCase())) names.set(name.toLowerCase(), code)
      }
    }
  } catch {
    // Intl.DisplayNames unavailable — fall back to the full country name
  }
  return names
}

export function countryCode(country) {
  const key = String(country || '').trim().toLowerCase()
  if (!key) return ''
  if (ALIASES[key]) return ALIASES[key]
  return (names || buildTable()).get(key) || String(country).trim()
}
