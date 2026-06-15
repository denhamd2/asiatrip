import type { TripDay } from '../types'
import { getBookingLinksForDay } from './bookings'
import { googleMapsSearchUrl, TIMEZONES_USED } from './locations'
import {
  parseAllActivities,
  parseDayItinerary,
  parseFlightEvents,
  type ParsedActivity,
} from './parseItinerary'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatICSDateLocal(date: Date): string {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  )
}

function formatICSDateUTC(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function buildVTimezone(tzid: string): string {
  const offsets: Record<string, string> = {
    'Asia/Singapore': '0800',
    'Asia/Bangkok': '0700',
    'Asia/Ho_Chi_Minh': '0700',
    'Europe/Dublin': '0100',
  }
  const offset = offsets[tzid] ?? '0000'
  return [
    'BEGIN:VTIMEZONE',
    `TZID:${tzid}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    `TZOFFSETFROM:+${offset}`,
    `TZOFFSETTO:+${offset}`,
    'END:STANDARD',
    'END:VTIMEZONE',
  ].join('\r\n')
}

function buildDescription(activity: ParsedActivity, day: TripDay): string {
  const parts: string[] = [activity.description]

  parts.push(`\\n\\nMap: ${googleMapsSearchUrl(activity.locationPin)}`)

  const bookings = getBookingLinksForDay(day)
  if (bookings.length > 0) {
    parts.push('\\n\\nBookings (Gmail):')
    for (const b of bookings.slice(0, 5)) {
      parts.push(`- ${b.label}: ${b.url}`)
    }
  }

  return escapeICS(parts.join(''))
}

function buildVEvent(activity: ParsedActivity, day: TripDay, uid: string): string {
  const now = new Date()
  return [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDateUTC(now)}`,
    `DTSTART;TZID=${activity.timezone}:${formatICSDateLocal(activity.start)}`,
    `DTEND;TZID=${activity.timezone}:${formatICSDateLocal(activity.end)}`,
    `SUMMARY:${escapeICS(activity.summary)}`,
    `LOCATION:${escapeICS(activity.locationPin)}`,
    `DESCRIPTION:${buildDescription(activity, day)}`,
    'END:VEVENT',
  ].join('\r\n')
}

export function generateICS(tripData: TripDay[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Asia Family Holiday 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Asia Family Holiday 2026',
  ]

  for (const tz of TIMEZONES_USED) {
    lines.push(buildVTimezone(tz))
  }

  let eventIndex = 0
  for (const day of tripData) {
    const itineraryActivities = parseDayItinerary(day.date, day.location, day.itinerary)
    const flightActivities =
      !day.itinerary?.trim() && day.flights?.trim()
        ? parseFlightEvents(day.date, day.location, day.flights)
        : []

    const dayActivities = [...itineraryActivities, ...flightActivities]

    for (const activity of dayActivities) {
      const uid = `asia-trip-2026-${eventIndex++}@localhost`
      lines.push(buildVEvent(activity, day, uid))
    }
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(tripData: TripDay[], filename = 'asia-itinerary-2026.ics'): void {
  const ics = generateICS(tripData)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function buildGoogleCalendarUrl(activity: ParsedActivity): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: activity.summary,
    dates: `${fmt(activity.start)}/${fmt(activity.end)}`,
    details: activity.description,
    location: activity.locationPin,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getActivitiesForDay(day: TripDay): ParsedActivity[] {
  const activities = parseDayItinerary(day.date, day.location, day.itinerary)
  if (!day.itinerary?.trim() && day.flights?.trim()) {
    activities.push(...parseFlightEvents(day.date, day.location, day.flights))
  }
  return activities
}

export { parseAllActivities }
