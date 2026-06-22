import {
  Bed,
  Briefcase,
  CalendarPlus,
  ChevronDown,
  ExternalLink,
  Info,
  Luggage,
  Mail,
  Plane,
  Sparkles,
} from 'lucide-react'
import { useMemo } from 'react'
import { getLocationTheme } from '../data/tripData'
import type { TripDay } from '../types'
import { getBookingLinksForDay } from '../utils/bookings'
import { buildGoogleCalendarUrl, getActivitiesForDay } from '../utils/calendar'
import { extractVenue } from '../utils/locations'
import {
  extractAirportFromFlights,
  getVenueFromAccommodation,
} from '../utils/placeImages'
import type { ParsedActivity } from '../utils/parseItinerary'
import { cleanTimeLabel, splitItineraryLine } from '../utils/parseItinerary'
import { PlaceThumbnail } from './PlaceThumbnail'

interface DayCardProps {
  data: TripDay
  index: number
  isExpanded: boolean
  onToggle: () => void
}

interface ItineraryTimelineProps {
  text: string
  location: string
  dotClass: string
  ringClass: string
  activities: ParsedActivity[]
  enabled: boolean
}

function ItineraryTimeline({
  text,
  location,
  dotClass,
  ringClass,
  activities,
  enabled,
}: ItineraryTimelineProps) {
  if (!text) {
    return (
      <p className="py-3 pl-8 text-sm italic text-slate-400">
        No detailed activities planned — travel or rest day.
      </p>
    )
  }

  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  let activityIdx = 0

  return lines.map((line, idx) => {
    let { timeLabel, text: remainingText } = splitItineraryLine(line)

    if (remainingText.startsWith('-') || remainingText.startsWith('•')) {
      remainingText = remainingText.substring(1).trim()
    }

    const hasTime = Boolean(timeLabel)
    const activity = hasTime ? activities[activityIdx++] : undefined
    const venue = extractVenue(remainingText)

    return (
      <div key={idx} className="group relative py-3 pl-8 sm:pl-10">
        <div
          className={`absolute top-[18px] left-[-5px] z-10 h-2.5 w-2.5 rounded-full ring-4 ring-white transition-all group-hover:scale-125 ${dotClass} ${ringClass}`}
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {timeLabel && (
              <div className="mb-1.5 inline-block">
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold tracking-wide text-slate-700 uppercase">
                  {cleanTimeLabel(timeLabel)}
                </span>
              </div>
            )}
            <p className="text-[15px] leading-relaxed text-slate-700">{remainingText}</p>
            {activity && (
              <a
                href={buildGoogleCalendarUrl(activity)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900"
              >
                <CalendarPlus size={12} />
                Add to Calendar
                <ExternalLink size={10} className="opacity-60" />
              </a>
            )}
          </div>
          {venue && (
            <PlaceThumbnail venue={venue} location={location} enabled={enabled} />
          )}
        </div>
      </div>
    )
  })
}

export function DayCard({ data, index, isExpanded, onToggle }: DayCardProps) {
  if (!data.date) return null

  const theme = getLocationTheme(data.location)
  const hasItinerary = Boolean(data.itinerary?.trim())
  const activityCount = data.itinerary
    ? data.itinerary.split('\n').filter((l) => l.trim()).length
    : 0

  const bookingLinks = useMemo(() => getBookingLinksForDay(data), [data])
  const parsedActivities = useMemo(() => getActivitiesForDay(data), [data])
  const stayVenue = useMemo(() => getVenueFromAccommodation(data.accommodation), [data.accommodation])
  const airportVenue = useMemo(
    () => (data.flights ? extractAirportFromFlights(data.flights) : null),
    [data.flights],
  )

  return (
    <article
      id={`day-${index}`}
      className="day-card overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full flex-col gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 sm:flex-row sm:items-center sm:justify-between"
        aria-expanded={isExpanded}
      >
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-sm ${theme.accent}`}
          >
            {index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
                {data.date}
              </h3>
              {data.location && (
                <span
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-base font-bold tracking-tight sm:text-lg ${theme.badge}`}
                >
                  {data.location}
                </span>
              )}
            </div>
            {!isExpanded && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {data.accommodation && data.accommodation !== 'Flight' && (
                  <span className="inline-flex max-w-full items-center gap-1 truncate">
                    <Bed size={14} className="shrink-0 text-amber-500" />
                    <span className="truncate">{data.accommodation.split(',')[0]}</span>
                  </span>
                )}
                {data.flights && (
                  <span className="inline-flex items-center gap-1 text-blue-600">
                    <Plane size={14} />
                    Flight day
                  </span>
                )}
                {hasItinerary && (
                  <span className="inline-flex items-center gap-1">
                    <Sparkles size={14} className="text-emerald-500" />
                    {activityCount} activities
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div
            className={`rounded-full p-1.5 transition-colors ${isExpanded ? 'bg-slate-100' : 'bg-transparent'}`}
          >
            <ChevronDown
              size={20}
              className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      <div
        className={`day-card-body grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-[6000px] border-t border-slate-100 opacity-100'
            : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <aside className="space-y-5 border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8 lg:col-span-4 lg:border-r lg:border-b-0">
            {data.flights && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-blue-700">
                  <Plane size={16} />
                  <h4 className="text-xs font-bold tracking-wider uppercase">Transport</h4>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-700">
                    {data.flights}
                  </p>
                  {airportVenue && (
                    <PlaceThumbnail
                      venue={airportVenue}
                      location={data.location}
                      enabled={isExpanded}
                    />
                  )}
                </div>
              </div>
            )}

            {data.baggage && data.baggage.length > 0 && (
              <div className="rounded-xl border border-blue-200/70 bg-blue-50/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-blue-800">
                  <Luggage size={16} />
                  <h4 className="text-xs font-bold tracking-wider uppercase">Baggage Allowance</h4>
                </div>
                <div className="space-y-3">
                  {data.baggage.map((bag, i) => (
                    <div key={i} className="text-[13.5px]">
                      <p className="font-bold text-slate-800">{bag.airline}</p>
                      <div className="mt-1.5 space-y-1.5">
                        <p className="flex items-start gap-2 text-slate-600">
                          <Luggage size={14} className="mt-0.5 shrink-0 text-blue-500" />
                          <span>
                            <span className="font-semibold text-slate-700">Checked:</span>{' '}
                            {bag.checked}
                          </span>
                        </p>
                        <p className="flex items-start gap-2 text-slate-600">
                          <Briefcase size={14} className="mt-0.5 shrink-0 text-blue-500" />
                          <span>
                            <span className="font-semibold text-slate-700">Carry-on:</span>{' '}
                            {bag.carryOn}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bookingLinks.length > 0 && (
              <div className="rounded-xl border border-violet-200/70 bg-violet-50/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-violet-800">
                  <Mail size={16} />
                  <h4 className="text-xs font-bold tracking-wider uppercase">Bookings (Gmail)</h4>
                </div>
                <ul className="space-y-2">
                  {bookingLinks.map((link) => (
                    <li key={`${link.category}-${link.label}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm font-medium text-violet-900 transition-colors hover:bg-violet-50"
                      >
                        <Mail size={14} className="shrink-0 text-violet-500" />
                        <span className="min-w-0 flex-1 truncate">{link.label}</span>
                        {!link.isDirect && (
                          <span className="shrink-0 rounded bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-violet-600 uppercase">
                            Search
                          </span>
                        )}
                        <ExternalLink size={12} className="shrink-0 opacity-50" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.accommodation && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-amber-700">
                  <Bed size={16} />
                  <h4 className="text-xs font-bold tracking-wider uppercase">Stay</h4>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-slate-700">
                    {data.accommodation}
                  </p>
                  {stayVenue && (
                    <PlaceThumbnail
                      venue={stayVenue}
                      location={data.location}
                      enabled={isExpanded}
                      fetchAs="hotel"
                    />
                  )}
                </div>
              </div>
            )}

            {data.notes && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-slate-600">
                  <Info size={16} />
                  <h4 className="text-xs font-bold tracking-wider uppercase">Notes</h4>
                </div>
                <p className="rounded-xl border border-slate-200/70 bg-white p-3 text-[15px] leading-relaxed text-slate-600 shadow-sm">
                  {data.notes}
                </p>
              </div>
            )}
          </aside>

          <section className="bg-white p-6 sm:p-8 lg:col-span-8">
            <h4 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
              <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
              Daily Plan
            </h4>
            <div className="relative ml-2 space-y-1 border-l-2 border-slate-200/80">
              <ItineraryTimeline
                text={data.itinerary}
                location={data.location}
                dotClass={theme.dot}
                ringClass={theme.ring}
                activities={parsedActivities}
                enabled={isExpanded}
              />
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
