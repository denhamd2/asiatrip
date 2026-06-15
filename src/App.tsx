import {
  Calendar,
  CalendarPlus,
  ChevronRight,
  Globe2,
  MapPin,
  Plane,
  UploadCloud,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { DayCard } from './components/DayCard'
import {
  defaultTripData,
  getTripStats,
  getUniqueDestinations,
} from './data/tripData'
import type { TripDay } from './types'
import { downloadICS } from './utils/calendar'
import { parseCSV } from './utils/parseCSV'

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${accent}`}>{icon}</div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [tripData, setTripData] = useState<TripDay[]>(defaultTripData)
  const [isFullFileLoaded, setIsFullFileLoaded] = useState(false)
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => new Set([0]))
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const stats = useMemo(() => getTripStats(tripData), [tripData])
  const destinations = useMemo(() => getUniqueDestinations(tripData), [tripData])

  const filteredData = useMemo(() => {
    if (!activeFilter) return tripData.map((day, index) => ({ day, index }))
    return tripData
      .map((day, index) => ({ day, index }))
      .filter(({ day }) => day.location.includes(activeFilter))
  }, [tripData, activeFilter])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text !== 'string') return

      const rows = parseCSV(text)
      const parsedData: TripDay[] = []

      for (let i = 1; i < rows.length; i++) {
        const r = rows[i]
        if (r.length < 2 || !r[0]) continue

        parsedData.push({
          date: r[0] || '',
          location: r[1] || '',
          flights: r[2] || '',
          accommodation: r[3] || '',
          cost: r[5] || '',
          notes: r[6] || '',
          itinerary: r[7] || (r[4] ? `Activity: ${r[4]}` : ''),
        })
      }

      if (parsedData.length > 0) {
        setTripData(parsedData)
        setIsFullFileLoaded(true)
        setExpandedDays(new Set([0]))
        setActiveFilter(null)
      }
    }
    reader.readAsText(file)
  }

  const toggleDay = (index: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const expandAll = () => setExpandedDays(new Set(tripData.map((_, i) => i)))
  const collapseAll = () => setExpandedDays(new Set())

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-emerald-50/30 text-slate-800">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.1),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-emerald-100 uppercase backdrop-blur-sm">
                <Globe2 size={14} />
                Family Adventure
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
                Asia Family Holiday 2026
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-emerald-100/90">
                <Calendar size={16} />
                <span className="font-medium">
                  {tripData[0]?.date} — {tripData[tripData.length - 1]?.date}
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {destinations.map((dest) => {
                  const isActive = activeFilter === dest
                  return (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setActiveFilter(isActive ? null : dest)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'border-white bg-white text-slate-800 shadow-md'
                          : 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <MapPin size={12} />
                      {dest}
                    </button>
                  )
                })}
                {activeFilter && (
                  <button
                    type="button"
                    onClick={() => setActiveFilter(null)}
                    className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10"
                  >
                    Show all
                  </button>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => downloadICS(tripData)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-white/25"
              >
                <CalendarPlus size={18} />
                <span>Add to Google Calendar (.ics)</span>
              </button>
              <label
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold shadow-lg transition-all ${
                  isFullFileLoaded
                    ? 'border-white/30 bg-white/15 text-white hover:bg-white/25'
                    : 'border-transparent bg-white text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <UploadCloud size={18} />
                <span>{isFullFileLoaded ? 'Upload different CSV' : 'Load updated CSV'}</span>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Calendar size={20} className="text-blue-600" />}
              label="Total Days"
              value={stats.totalDays}
              accent="bg-blue-100"
            />
            <StatCard
              icon={<MapPin size={20} className="text-emerald-600" />}
              label="Destinations"
              value={stats.destinations}
              accent="bg-emerald-100"
            />
            <StatCard
              icon={<Plane size={20} className="text-violet-600" />}
              label="Flight Days"
              value={stats.flightDays}
              accent="bg-violet-100"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
              Day-by-day itinerary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeFilter
                ? `Showing ${filteredData.length} days in ${activeFilter}`
                : 'Tap any day to expand transport, stay, and activity details. Use the .ics export to import pinned events into a new Google Calendar.'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Collapse all
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredData.map(({ day, index }) => (
            <DayCard
              key={`${day.date}-${index}`}
              data={day}
              index={index}
              isExpanded={expandedDays.has(index)}
              onToggle={() => toggleDay(index)}
            />
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-500">No days match this destination filter.</p>
          </div>
        )}

        <footer className="mt-16 flex flex-col items-center gap-2 pb-10 text-center text-sm text-slate-400">
          <ChevronRight size={16} className="rotate-90 text-emerald-400" />
          <p>Have a wonderful trip — safe travels!</p>
        </footer>
      </main>
    </div>
  )
}
