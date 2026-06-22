import { extractVenue, formatLocationPin, getLocationMeta } from './locations'

export interface ParsedActivity {
  start: Date
  end: Date
  summary: string
  description: string
  timeLabel: string
  dayLocation: string
  locationPin: string
  venue: string | null
  timezone: string
}

const MONTH_MAP: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

const WORD_TIME_DEFAULTS: Record<string, { hour: number; minute: number; durationMin: number }> = {
  morning: { hour: 9, minute: 0, durationMin: 120 },
  afternoon: { hour: 14, minute: 0, durationMin: 120 },
  evening: { hour: 19, minute: 0, durationMin: 120 },
  night: { hour: 21, minute: 0, durationMin: 90 },
  day: { hour: 10, minute: 0, durationMin: 480 },
}

export function parseTripDate(dateStr: string, year = 2026): Date | null {
  const match = dateStr.match(/(\w+),\s*(\w+)\s+(\d+)/i)
  if (!match) return null
  const month = MONTH_MAP[match[2].toLowerCase()]
  if (month === undefined) return null
  return new Date(year, month, parseInt(match[3], 10))
}

function parseTimeToken(token: string): { hour: number; minute: number } | null {
  const cleaned = token.trim().replace(/\+$/, '')
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm|h|H)?$/i)
  if (!match) return null

  let hour = parseInt(match[1], 10)
  const minute = match[2] ? parseInt(match[2], 10) : 0
  const period = match[3]?.toUpperCase()

  if (period === 'AM' || period === 'PM') {
    if (hour > 12) return { hour, minute }
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
  } else if (hour >= 13 && hour <= 23) {
    // already 24h
  } else if (hour <= 7) {
    // ambiguous morning times like 6, 7 without AM/PM -> assume AM for travel
  } else if (hour >= 8 && hour <= 11) {
    // likely AM for itinerary context
  }

  return { hour, minute }
}

interface ParsedTimeRange {
  timeLabel: string
  start: { hour: number; minute: number }
  end?: { hour: number; minute: number }
  defaultDurationMin: number
}

function parseTimeLabel(label: string): ParsedTimeRange | null {
  const trimmed = label.replace(/[:\-]$/, '').trim()

  const wordMatch = trimmed.match(/^(Morning|Afternoon|Evening|Night|Day)/i)
  if (wordMatch) {
    const key = wordMatch[1].toLowerCase()
    const def = WORD_TIME_DEFAULTS[key]
    return {
      timeLabel: trimmed,
      start: { hour: def.hour, minute: def.minute },
      defaultDurationMin: def.durationMin,
    }
  }

  const rangeMatch = trimmed.match(
    /^(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?)\s*-\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?)/i,
  )
  if (rangeMatch) {
    const start = parseTimeToken(rangeMatch[1])
    const end = parseTimeToken(rangeMatch[2])
    if (start && end) {
      return { timeLabel: trimmed, start, end, defaultDurationMin: 60 }
    }
  }

  const singleMatch = trimmed.match(/^(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?\+?)/i)
  if (singleMatch) {
    const start = parseTimeToken(singleMatch[1])
    if (start) {
      return { timeLabel: trimmed, start, defaultDurationMin: 60 }
    }
  }

  return null
}

export function cleanTimeLabel(timeLabel: string): string {
  return timeLabel.replace(/[:\s-]+$/g, '').trim()
}

export function splitItineraryLine(line: string): { timeLabel: string; text: string } {
  const timeRegex =
    /^(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?(?:\+)?\s*(?:-\s*(?:\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?|Noon|Midnight))?[:\s-]*)/i
  const wordTimeRegex = /^((?:Morning|Afternoon|Evening|Night|Day)[:\s-]*)/i
  const bare24hRegex = /^(\d{1,2}:\d{2}:?\s*)/

  const match = line.match(timeRegex)
  const wordMatch = line.match(wordTimeRegex)
  const bareMatch = line.match(bare24hRegex)

  if (match) {
    const rawLabel = match[1]
    return { timeLabel: cleanTimeLabel(rawLabel), text: line.substring(rawLabel.length).trim() }
  }
  if (wordMatch) {
    const rawLabel = wordMatch[1]
    return { timeLabel: cleanTimeLabel(rawLabel), text: line.substring(rawLabel.length).trim() }
  }
  if (bareMatch && !/^\d{1,2}:\d{2}\s*(AM|PM)/i.test(line)) {
    const rawLabel = bareMatch[1]
    return { timeLabel: cleanTimeLabel(rawLabel), text: line.substring(rawLabel.length).trim() }
  }

  return { timeLabel: '', text: line.trim() }
}

function makeDateTime(baseDate: Date, hour: number, minute: number): Date {
  const d = new Date(baseDate)
  d.setHours(hour, minute, 0, 0)
  return d
}

function minutesBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60000)
}

export function parseDayItinerary(
  dateStr: string,
  location: string,
  itinerary: string,
): ParsedActivity[] {
  if (!itinerary?.trim()) return []

  const baseDate = parseTripDate(dateStr)
  if (!baseDate) return []

  const meta = getLocationMeta(location)
  const lines = itinerary.split('\n').filter((l) => l.trim())
  const raw: Array<{
    timeLabel: string
    text: string
    parsed: ParsedTimeRange | null
  }> = []

  for (const line of lines) {
    const { timeLabel, text } = splitItineraryLine(line)
    let body = text
    if (body.startsWith('-') || body.startsWith('•')) body = body.substring(1).trim()
    raw.push({ timeLabel, text: body, parsed: timeLabel ? parseTimeLabel(timeLabel) : null })
  }

  const activities: ParsedActivity[] = []

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i]
    if (!item.parsed) continue

    const start = makeDateTime(
      baseDate,
      item.parsed.start.hour,
      item.parsed.start.minute,
    )

    let end: Date
    if (item.parsed.end) {
      end = makeDateTime(baseDate, item.parsed.end.hour, item.parsed.end.minute)
      if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000)
    } else {
      const next = raw.slice(i + 1).find((r) => r.parsed)
      if (next?.parsed) {
        end = makeDateTime(baseDate, next.parsed.start.hour, next.parsed.start.minute)
        if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000)
      } else {
        end = new Date(start.getTime() + item.parsed.defaultDurationMin * 60000)
      }
    }

    if (minutesBetween(start, end) < 15) {
      end = new Date(start.getTime() + Math.max(item.parsed.defaultDurationMin, 30) * 60000)
    }

    const venue = extractVenue(item.text)
    const summary = item.text.length > 80 ? `${item.text.slice(0, 77)}...` : item.text

    activities.push({
      start,
      end,
      summary,
      description: item.text,
      timeLabel: item.parsed.timeLabel,
      dayLocation: location,
      locationPin: formatLocationPin(venue, location),
      venue,
      timezone: meta.timezone,
    })
  }

  return activities
}

const FLIGHT_TIME_REGEX =
  /(\d{1,2}[.:]\d{2})\s*(?:am|pm)?\s*[-–]\s*(\d{1,2}[.:]\d{2})\s*(?:am|pm)?/gi

export function parseFlightEvents(
  dateStr: string,
  location: string,
  flights: string,
): ParsedActivity[] {
  if (!flights?.trim()) return []

  const baseDate = parseTripDate(dateStr)
  if (!baseDate) return []

  const meta = getLocationMeta(location)
  const activities: ParsedActivity[] = []

  const flightNoRegex = /([A-Z]{2}\d{2,4})/g
  const flightNumbers = [...flights.matchAll(flightNoRegex)].map((m) => m[1])

  let match: RegExpExecArray | null
  const regex = new RegExp(FLIGHT_TIME_REGEX.source, 'gi')
  let idx = 0
  while ((match = regex.exec(flights)) !== null) {
    const depToken = match[1].replace('.', ':')
    const arrToken = match[2].replace('.', ':')
    const dep = parseTimeToken(depToken)
    const arr = parseTimeToken(arrToken)
    if (!dep || !arr) continue

    const start = makeDateTime(baseDate, dep.hour, dep.minute)
    let end = makeDateTime(baseDate, arr.hour, arr.minute)
    if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000)

    const flightNo = flightNumbers[idx] ?? ''
    idx++

    activities.push({
      start,
      end,
      summary: flightNo ? `Flight ${flightNo}` : 'Flight',
      description: flights,
      timeLabel: `${depToken} - ${arrToken}`,
      dayLocation: location,
      locationPin: formatLocationPin(null, location),
      venue: null,
      timezone: meta.timezone,
    })
  }

  if (activities.length === 0 && flights.trim()) {
    activities.push({
      start: makeDateTime(baseDate, 9, 0),
      end: makeDateTime(baseDate, 12, 0),
      summary: 'Flight / transit',
      description: flights,
      timeLabel: '',
      dayLocation: location,
      locationPin: formatLocationPin(null, location),
      venue: null,
      timezone: meta.timezone,
    })
  }

  return activities
}

export function parseAllActivities(
  days: Array<{ date: string; location: string; flights: string; itinerary: string }>,
): ParsedActivity[] {
  const all: ParsedActivity[] = []
  for (const day of days) {
    all.push(...parseDayItinerary(day.date, day.location, day.itinerary))
    if (!day.itinerary?.trim() && day.flights?.trim()) {
      all.push(...parseFlightEvents(day.date, day.location, day.flights))
    }
  }
  return all.sort((a, b) => a.start.getTime() - b.start.getTime())
}
