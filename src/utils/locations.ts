export interface LocationMeta {
  city: string
  country: string
  timezone: string
}

const LOCATION_MAP: Record<string, LocationMeta> = {
  Transit: { city: 'In transit', country: '', timezone: 'Europe/Dublin' },
  'Hamad International Airport, Doha': {
    city: 'Doha',
    country: 'Qatar',
    timezone: 'Asia/Qatar',
  },
  Doha: { city: 'Doha', country: 'Qatar', timezone: 'Asia/Qatar' },
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
  'Hamad International Airport',
  'Oryx Airport Hotel',
  'teamLab Future World',
  'ArtScience Museum',
  'Little India',
  'Tekka Centre',
  'Cloud Forest',
  'Flower Dome',
  'Satay by the Bay',
  'Nora Buri',
  'Fisherman\'s Village',
  'Overlap Stone',
  'Coco Tam\'s',
  'Samui Elephant Home',
  'The Jungle Club',
  'Pig Island Tour',
  'Koh Tao',
  'Palawan Beach',
  'The Berkeley Hotel Pratunam',
  'Bubble Forest Cafe',
  'ICONSIAM',
  'Pop Mart',
  'CentralWorld',
  'King Power Mahanakhon',
  'Mahanakhon SkyVerse',
  'Grand Palace',
  'Wat Pho',
  'Wat Phra Kaew',
  'MBK Center',
  'Terminal 21',
  'Peninsula Hotel Da Nang',
  'Ba Na Hills',
  'Sun World Ba Na Hills',
  'Golden Bridge',
  'Solar Castle',
  'My Khe Beach',
  'Lady Buddha',
  'Linh Ung Pagoda',
  'Marble Mountains',
  'Dragon Bridge',
  'Han Market',
  'Little Hoi An',
  'Hoi An Ancient Town',
  'Japanese Covered Bridge',
  'Cam Thanh Basket Boat',
  'Peridot Grand Luxury Boutique Hotel',
  'NonLa Healing Spa',
  'Azura Cruise Halong Bay',
  'Proverb Hotel',
  'Temple of Literature',
  'Hoan Kiem Lake',
  'Thang Long Water Puppet Theatre',
  'Train Street',
  'Tran Quoc Pagoda',
  'Truc Bach Lake',
  'Viet Hai Village',
  'Dublin Airport',
  'Suvarnabhumi Airport',
  'Da Nang International Airport',
  'Noi Bai International Airport',
  'Samui Airport',
]

const KNOWN_VENUES_SORTED = [...KNOWN_VENUES].sort((a, b) => b.length - a.length)

const VENUE_ALIASES: Array<{ pattern: RegExp; venue: string }> = [
  { pattern: /\bland changi t1\b/i, venue: 'Changi Airport' },
  { pattern: /\bchangi t1\b/i, venue: 'Changi Airport' },
  { pattern: /\bMBS\b/, venue: 'Marina Bay Sands' },
  { pattern: /\bfurama breakfast\b/i, venue: 'Furama City Centre' },
  { pattern: /\bharry potter on sentosa\b/i, venue: 'Harry Potter: Visions of Magic' },
  { pattern: /\bsky park observation deck\b/i, venue: 'Marina Bay Sands' },
  { pattern: /\binfinity pool\b/i, venue: 'Marina Bay Sands' },
  { pattern: /\bmahanakhon skywalk\b/i, venue: 'King Power Mahanakhon' },
]

export function extractVenue(text: string): string | null {
  for (const venue of KNOWN_VENUES_SORTED) {
    if (text.toLowerCase().includes(venue.toLowerCase())) return venue
  }

  for (const { pattern, venue } of VENUE_ALIASES) {
    if (pattern.test(text)) return venue
  }

  return null
}

export const TIMEZONES_USED = [
  'Asia/Singapore',
  'Asia/Bangkok',
  'Asia/Ho_Chi_Minh',
  'Europe/Dublin',
] as const
