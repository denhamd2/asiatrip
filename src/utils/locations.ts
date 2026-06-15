export interface LocationMeta {
  city: string
  country: string
  timezone: string
}

const LOCATION_MAP: Record<string, LocationMeta> = {
  Transit: { city: 'In transit', country: '', timezone: 'Europe/Dublin' },
  Singapore: { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  'Koh Samui': { city: 'Koh Samui', country: 'Thailand', timezone: 'Asia/Bangkok' },
  Bangkok: { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  'Bangkok → Da Nang': { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  'Da Nang': { city: 'Da Nang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  'Hoi An': { city: 'Hoi An', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  Hanoi: { city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  'Halong Bay': { city: 'Ha Long', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  'Ha Long Bay': { city: 'Ha Long', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  Departure: { city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  Dublin: { city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
}

export function getLocationMeta(location: string): LocationMeta {
  const normalized = location.split('→')[0].trim()
  return (
    LOCATION_MAP[location] ??
    LOCATION_MAP[normalized] ?? {
      city: normalized || location,
      country: '',
      timezone: 'UTC',
    }
  )
}

export function formatLocationPin(venue: string | null, location: string): string {
  const meta = getLocationMeta(location)
  if (venue && meta.country) return `${venue}, ${meta.city}, ${meta.country}`
  if (venue) return `${venue}, ${meta.city}`
  if (meta.country) return `${meta.city}, ${meta.country}`
  return meta.city
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const KNOWN_VENUES = [
  'Marina Bay Sands',
  'Furama City Centre',
  'Universal Studios Singapore',
  'Harry Potter: Visions of Magic',
  'Resorts World Sentosa',
  'Gardens by the Bay',
  'Merlion Park',
  'Maxwell Food Centre',
  'Lau Pa Sat',
  'Raffles Long Bar',
  'Fort Canning Park',
  'Jewel Changi Airport',
  'Changi Airport',
  'Nora Buri',
  'Fisherman\'s Village',
  'Samui Elephant Home',
  'The Berkeley Hotel Pratunam',
  'ICONSIAM',
  'King Power Mahanakhon',
  'Mahanakhon SkyVerse',
  'Grand Palace',
  'Wat Pho',
  'MBK Center',
  'Peninsula Hotel Da Nang',
  'Ba Na Hills',
  'Sun World Ba Na Hills',
  'Golden Bridge',
  'Solar Castle',
  'My Khe Beach',
  'Lady Buddha',
  'Marble Mountains',
  'Dragon Bridge',
  'Little Hoi An',
  'Hoi An Ancient Town',
  'Peridot Grand Luxury Boutique Hotel',
  'Azura Cruise Halong Bay',
  'Proverb Hotel',
  'Temple of Literature',
  'Hoan Kiem Lake',
  'Thang Long Water Puppet Theatre',
]

export function extractVenue(text: string): string | null {
  for (const venue of KNOWN_VENUES) {
    if (text.toLowerCase().includes(venue.toLowerCase())) return venue
  }

  const beforeColon = text.split(':')[0]?.trim()
  if (beforeColon && beforeColon.length > 3 && beforeColon.length < 60) {
    const skip = /^(leave|grab|mrt|bts|check|pack|return|head|walk|optional|evening|day|morning|afternoon|night)/i
    if (!skip.test(beforeColon)) return beforeColon
  }

  return null
}

export const TIMEZONES_USED = [
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Europe/Dublin',
] as const
