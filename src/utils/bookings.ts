import type { TripDay } from '../types'

export interface BookingLink {
  label: string
  url: string
  category: 'flight' | 'hotel' | 'activity'
}

function gmailSearchUrl(query: string): string {
  return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`
}

function extractFlightBookings(flights: string): BookingLink[] {
  const links: BookingLink[] = []
  const seen = new Set<string>()

  const segments = flights.split(/[.;]\s*/).filter(Boolean)
  for (const segment of segments) {
    const flightNoMatch = segment.match(/([A-Z]{2}\d{2,4})/)

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
        query = segment.slice(0, 40).trim()
        label = `Flight ${depMatch[1]} → ${depMatch[2]}`
      }
    }

    if (query && !seen.has(query)) {
      seen.add(query)
      links.push({
        label: label || query.slice(0, 40),
        url: gmailSearchUrl(query),
        category: 'flight',
      })
    }
  }

  return links
}

function extractHotelBooking(accommodation: string): BookingLink | null {
  if (!accommodation || accommodation === 'Flight' || accommodation === 'Home') return null

  const hotelName = accommodation.split(',')[0].trim()
  if (!hotelName) return null

  return {
    label: hotelName,
    url: gmailSearchUrl(`${hotelName} booking`),
    category: 'hotel',
  }
}

function extractActivityBookings(notes: string): BookingLink[] {
  if (!notes?.trim()) return []
  const links: BookingLink[] = []
  const seen = new Set<string>()

  const bookedPattern =
    /(?:Activity:\s*)?([^.;]+?)(?:\.\s*)?(?:Booked[^.;]*|booked[^.;]*|on Klook|GetYourGuide|Revolut Stays)/gi

  let match: RegExpExecArray | null
  while ((match = bookedPattern.exec(notes)) !== null) {
    const name = match[1].trim()
    if (name.length < 3 || seen.has(name)) continue
    seen.add(name)
    links.push({
      label: name,
      url: gmailSearchUrl(name),
      category: 'activity',
    })
  }

  if (/booked/i.test(notes) && links.length === 0) {
    const klookMatch = notes.match(/([^.;]+)\s*\(?Booked via klook/i)
    if (klookMatch) {
      const name = klookMatch[1].trim()
      links.push({ label: name, url: gmailSearchUrl(name), category: 'activity' })
    }
  }

  return links
}

export function getBookingLinksForDay(day: TripDay): BookingLink[] {
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
    extractFlightBookings(day.flights).forEach(add)
  }

  const hotel = extractHotelBooking(day.accommodation)
  if (hotel) add(hotel)

  extractActivityBookings(day.notes).forEach(add)

  if (/booked/i.test(day.notes) && day.flights) {
    const airlineInNotes = day.notes.match(/(Qatar Airways|Bangkok Airways|Emirates|Vietnam Airlines)/i)
    if (airlineInNotes) {
      add({
        label: `${airlineInNotes[1]} booking`,
        url: gmailSearchUrl(airlineInNotes[1]),
        category: 'flight',
      })
    }
  }

  return links
}
