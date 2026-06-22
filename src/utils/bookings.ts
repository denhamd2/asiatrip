import { bookingEmailUrls } from '../data/bookingEmails'
import type { TripDay } from '../types'

export interface BookingLink {
  label: string
  url: string
  category: 'flight' | 'hotel' | 'activity'
  isDirect: boolean
}

const GMAIL_ACCOUNT = 0

const GMAIL_URL_PATTERN =
  /https:\/\/mail\.google\.com\/mail\/[^\s"'<>]+/gi

const GARBAGE_LABEL =
  /^(booked(\s|&|$)|flight$|booked and paid|booked & paid|booked and paid for|booked and paid for on|booked and paid for with|booked elephant experience & paid for)$/i

function gmailSearchUrl(query: string, category: BookingLink['category']): string {
  let q = query.trim()
  if (category === 'flight') {
    q = q.includes(' ') ? `"${q}" confirmation` : `${q} confirmation`
  } else if (category === 'hotel') {
    const shortName = q.replace(/\s+booking$/i, '')
    q = `"${shortName}" confirmation OR reservation`
  } else {
    q = `"${q}" confirmation OR booking`
  }
  return `https://mail.google.com/mail/u/${GMAIL_ACCOUNT}/#search/${encodeURIComponent(q)}`
}

/** Normalize a full Gmail URL or bare thread ID into a direct thread link. */
export function gmailThreadUrl(threadIdOrUrl: string): string {
  const trimmed = threadIdOrUrl.trim()
  const hashMatch = trimmed.match(/#(?:inbox|all|sent|drafts)\/([^/?#]+)/i)
  if (hashMatch) {
    return `https://mail.google.com/mail/u/${GMAIL_ACCOUNT}/#all/${hashMatch[1]}`
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://mail.google.com/mail/u/${GMAIL_ACCOUNT}/#all/${trimmed}`
}

function extractGmailUrls(text: string): string[] {
  if (!text) return []
  return [...text.matchAll(GMAIL_URL_PATTERN)].map((m) => m[0])
}

function extractExplicitGmailUrl(day: TripDay): string | undefined {
  if (day.gmailUrl?.trim()) {
    return day.gmailUrl.trim()
  }

  const gmailPrefix = day.notes.match(/^Gmail:\s*(https:\/\/mail\.google\.com\/\S+)/i)
  if (gmailPrefix) {
    return gmailPrefix[1]
  }

  const notesUrls = extractGmailUrls(day.notes)
  if (notesUrls.length === 1) {
    return notesUrls[0]
  }

  return undefined
}

function bookingLookupKeys(label: string): string[] {
  const keys = new Set<string>()
  keys.add(label)
  keys.add(label.split(' - ')[0].trim())
  keys.add(label.split(',')[0].trim())
  keys.add(label.replace(/\s+booking$/i, ''))
  return [...keys].filter(Boolean)
}

function findMappedUrl(label: string): string | undefined {
  for (const key of bookingLookupKeys(label)) {
    if (bookingEmailUrls[key]) {
      return bookingEmailUrls[key]
    }
  }

  const lowerLabel = label.toLowerCase()
  for (const [key, url] of Object.entries(bookingEmailUrls)) {
    const lowerKey = key.toLowerCase()
    if (lowerLabel.startsWith(lowerKey) || lowerKey.startsWith(lowerLabel)) {
      return url
    }
  }

  return undefined
}

function resolveBookingUrl(
  label: string,
  fallbackQuery: string,
  category: BookingLink['category'],
  explicitUrl?: string,
): Pick<BookingLink, 'url' | 'isDirect'> {
  if (explicitUrl) {
    return { url: gmailThreadUrl(explicitUrl), isDirect: true }
  }

  const mapped = findMappedUrl(label)
  if (mapped) {
    return { url: gmailThreadUrl(mapped), isDirect: true }
  }

  return { url: gmailSearchUrl(fallbackQuery, category), isDirect: false }
}

function isGarbageLabel(label: string): boolean {
  const trimmed = label.trim()
  if (trimmed.length < 3) return true
  if (GARBAGE_LABEL.test(trimmed)) return true
  if (/^(pickup|airport meet|evening|morning|afternoon|optional|pack for|check-in|check in)/i.test(trimmed)) {
    return true
  }
  return false
}

function looksLikeBookedActivityTitle(line: string): boolean {
  if (!line || line.length > 60 || isGarbageLabel(line)) return false
  if (/^\d/.test(line) || /^\d{1,2}:\d{2}/.test(line)) return false
  if (/^(pickup|evening|morning|afternoon|optional|pack|check-in|check in|12:|1:|2:|3:)/i.test(line)) {
    return false
  }
  if (/^[A-Z][a-z]+ [a-z]+ –/.test(line)) return false
  return /tour|experience|studios|club|cafe|castle|island|elephant|forest|universal|bubble|jungle|azura|cruse|cruise|feeding|hopping|pig island|koh tao|water puppet/i.test(
    line,
  )
}

function isTransferNotes(notes: string): boolean {
  return /hoppa|minibus|minivan|transfer|pickup from|pickup at/i.test(notes)
}

function shortHotelName(accommodation: string): string {
  const name = accommodation.split(',')[0].trim()
  const dashIdx = name.indexOf(' - ')
  return dashIdx > 0 ? name.slice(0, dashIdx).trim() : name
}

function extractFlightBookings(
  flights: string,
  explicitUrl?: string,
): BookingLink[] {
  const links: BookingLink[] = []
  const seen = new Set<string>()

  const segments = flights.split(/[\n.;]+/).map((s) => s.trim()).filter(Boolean)
  for (const segment of segments) {
    const flightNoMatch = segment.match(/\b([A-Z]{2}\d{2,4})\b/)

    let query = ''
    let label = ''

    if (flightNoMatch) {
      query = flightNoMatch[1]
      label = `Flight ${flightNoMatch[1]}`
    }

    const airlineName = segment.match(
      /(Qatar Airways|Bangkok Airways|Emirates|Vietnam Airlines)/i,
    )?.[1]
    if (airlineName) {
      query = query ? `${airlineName} ${query}` : airlineName
      label = label || airlineName
    }

    if (!query) {
      const depMatch = segment.match(/([A-Z]{3})\s*→\s*([A-Z]{3})/)
      if (depMatch) {
        query = `${depMatch[1]} ${depMatch[2]} ${airlineName || 'flight'}`
        label = `Flight ${depMatch[1]} → ${depMatch[2]}`
      }
    }

    if (!query) {
      if (/transfer|minibus|minivan|pickup|taxi|car transfer/i.test(segment)) continue
      continue
    }

    if (seen.has(label)) continue
    seen.add(label)

    const resolved = resolveBookingUrl(label, query, 'flight', explicitUrl)
    links.push({
      label,
      category: 'flight',
      ...resolved,
    })
  }

  return links
}

function extractHotelBooking(
  accommodation: string,
  explicitUrl?: string,
): BookingLink | null {
  if (!accommodation || accommodation === 'Flight' || accommodation === 'Home' || accommodation === 'flight') {
    return null
  }

  const hotelName = accommodation.split(',')[0].trim()
  if (!hotelName) return null

  const label = shortHotelName(accommodation)
  const resolved = resolveBookingUrl(label, `${label} booking`, 'hotel', explicitUrl)
  return {
    label,
    category: 'hotel',
    ...resolved,
  }
}

function extractActivityBookings(
  notes: string,
  itinerary: string,
  explicitUrl?: string,
): BookingLink[] {
  const links: BookingLink[] = []
  const seen = new Set<string>()

  const addActivity = (name: string) => {
    const trimmed = name.trim()
    if (isGarbageLabel(trimmed) || seen.has(trimmed)) return
    seen.add(trimmed)
    const resolved = resolveBookingUrl(trimmed, trimmed, 'activity', explicitUrl)
    links.push({
      label: trimmed,
      category: 'activity',
      ...resolved,
    })
  }

  if (isTransferNotes(notes)) {
    return links
  }

  const activityFromItinerary = itinerary
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  if (/booked|klook|getyourguide|revolut stays|reservation/i.test(notes)) {
    if (activityFromItinerary && looksLikeBookedActivityTitle(activityFromItinerary)) {
      addActivity(activityFromItinerary)
    }
  }

  const klookMatch = notes.match(/(?:Made\s+)?(?:reservation|resevation)\s+via\s+klook/i)
  if (klookMatch && activityFromItinerary && /bubble forest|cafe/i.test(activityFromItinerary)) {
    addActivity(activityFromItinerary)
  }

  const activityMatch = notes.match(/^Activity:\s*(.+)$/im)
  if (activityMatch) {
    addActivity(activityMatch[1])
  }

  return links
}

export function getBookingLinksForDay(day: TripDay): BookingLink[] {
  const explicitUrl = extractExplicitGmailUrl(day)
  const links: BookingLink[] = []
  const seen = new Set<string>()

  const add = (link: BookingLink) => {
    const key = `${link.category}:${link.label}`
    if (!seen.has(key)) {
      seen.add(key)
      links.push(link)
    }
  }

  if (day.flights) {
    extractFlightBookings(day.flights, explicitUrl).forEach(add)
  }

  const hotel = extractHotelBooking(day.accommodation, explicitUrl)
  if (hotel) add(hotel)

  extractActivityBookings(day.notes, day.itinerary, explicitUrl).forEach(add)

  return links
}
