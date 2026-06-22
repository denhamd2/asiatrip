import { extractVenue, getLocationMeta } from './locations'

interface CacheEntry {
  url: string | null
  expiresAt?: number
}

const imageCache = new Map<string, CacheEntry>()
const inflightRequests = new Map<string, Promise<string | null>>()

const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000
const QUEUE_CONCURRENCY = 2
const QUEUE_GAP_MS = 250
/** Bump when cache URL format changes (e.g. thumbnail vs originalimage preference). */
const CACHE_KEY_VERSION = 'v4'

const AIRPORT_NAMES: Record<string, string> = {
  DUB: 'Dublin Airport',
  DOH: 'Hamad International Airport',
  SIN: 'Changi Airport',
  USM: 'Samui Airport',
  BKK: 'Suvarnabhumi Airport',
  DAD: 'Da Nang International Airport',
  HAN: 'Noi Bai International Airport',
}

const VENUE_REDIRECTS: Record<string, string> = {
  'oryx airport hotel': 'Hamad International Airport',
  'little hoi an': 'Hoi An Ancient Town',
  'little hoi an. a boutique hotel & spa': 'Hoi An Ancient Town',
  'nora buri - 2x pool villas with hilltop view. breakfast included.': 'Nora Buri',
}

/** Venues with no (or misleading) Wikipedia opensearch results — use a known article title. */
const VENUE_WIKIPEDIA_TITLES: Record<string, string> = {
  'azura cruise halong bay': 'Ha Long Bay',
  'bubble forest cafe': 'CentralWorld',
  'cam thanh basket boat': 'Hoi An Ancient Town',
  "coco tam's": 'Ko Samui',
  'furama city centre': 'Chinatown, Singapore',
  'han market': 'Da Nang',
  'harry potter: visions of magic': 'Resorts World Sentosa',
  'lady buddha': 'Son Tra Mountain',
  'linh ung pagoda': 'Son Tra Mountain',
  'little hoi an': 'Hoi An Ancient Town',
  'my khe beach': 'Da Nang',
  'nora buri': 'Ko Samui',
  'overlap stone': 'Ko Samui',
  'palawan beach': 'Sentosa',
  'peninsula hotel da nang': 'Da Nang',
  'peridot grand luxury boutique hotel': 'Hanoi old quarter',
  'pig island tour': 'Ko Samui',
  'proverb hotel': 'Hanoi old quarter',
  'raffles long bar': 'Raffles Hotel Singapore',
  'samui elephant home': 'Ko Samui',
  'satay by the bay': 'Gardens by the Bay',
  'solar castle': 'Da Nang',
  'thang long water puppet theatre': 'Water puppetry',
  'the berkeley hotel pratunam': 'Pratunam',
  'train street': 'Hanoi Train Street',
}

/** Curated Wikipedia articles for hero banner crossfade (one iconic image per region). */
export const HERO_WIKIPEDIA_TITLES = [
  'Gardens by the Bay',
  'Ko Samui',
  'Grand Palace, Bangkok',
  'Golden Bridge (Vietnam)',
  'Hoi An Ancient Town',
  'Old Quarter, Hanoi',
  'Ha Long Bay',
] as const

const HERO_IMAGE_CACHE_VERSION = 'hero:v1'
const HERO_THUMB_WIDTH_PX = 1920

interface WikipediaSummary {
  thumbnail?: {
    source: string
  }
  originalimage?: {
    source: string
  }
}

interface PageImagesResponse {
  query?: {
    pages?: Record<
      string,
      {
        thumbnail?: { source: string }
      }
    >
  }
}

class RequestQueue {
  private active = 0
  private waiters: Array<() => void> = []
  private lastStart = 0

  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }

  private async acquire(): Promise<void> {
    if (this.active >= QUEUE_CONCURRENCY) {
      await new Promise<void>((resolve) => {
        this.waiters.push(resolve)
      })
    }

    const elapsed = Date.now() - this.lastStart
    if (elapsed < QUEUE_GAP_MS) {
      await wait(QUEUE_GAP_MS - elapsed)
    }

    this.active++
    this.lastStart = Date.now()
  }

  private release(): void {
    this.active--
    const next = this.waiters.shift()
    if (next) next()
  }
}

const requestQueue = new RequestQueue()

export function buildPlaceSearchQuery(venue: string, location: string): string {
  const meta = getLocationMeta(location)
  if (meta.city && meta.city !== 'In transit') {
    return `${venue} ${meta.city}`
  }
  return venue
}

function buildPlaceSearchQueries(venue: string, location: string): string[] {
  const meta = getLocationMeta(location)
  const queries = new Set<string>()

  queries.add(venue)
  if (meta.city && meta.city !== 'In transit') {
    queries.add(`${venue} ${meta.city}`)
  }
  if (meta.country) {
    queries.add(`${venue} ${meta.country}`)
  }

  return [...queries]
}

function resolveVenue(venue: string): string {
  const key = venue.trim().toLowerCase()
  return VENUE_REDIRECTS[key] ?? venue
}

function normalizeCacheKey(key: string): string {
  return `${CACHE_KEY_VERSION}:${key.trim().toLowerCase()}`
}

function getCacheEntry(cacheKey: string): CacheEntry | undefined {
  const entry = imageCache.get(normalizeCacheKey(cacheKey))
  if (!entry) return undefined
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    imageCache.delete(normalizeCacheKey(cacheKey))
    return undefined
  }
  return entry
}

function setCacheEntry(cacheKey: string, url: string | null, ttlMs?: number): void {
  imageCache.set(normalizeCacheKey(cacheKey), {
    url,
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  })
}

export function extractAirportFromFlights(flights: string): string | null {
  const routeMatch = flights.match(/\b([A-Z]{3})\s*→\s*([A-Z]{3})\b/)
  if (routeMatch) {
    const destination = routeMatch[2]
    if (AIRPORT_NAMES[destination]) return AIRPORT_NAMES[destination]
  }

  for (const [code, name] of Object.entries(AIRPORT_NAMES)) {
    const codePattern = new RegExp(`\\b${code}\\b`)
    if (codePattern.test(flights)) return name
  }

  return null
}

export function getVenueFromText(text: string): string | null {
  return extractVenue(text)
}

export function getVenueFromAccommodation(accommodation: string): string | null {
  if (
    !accommodation ||
    accommodation === 'Flight' ||
    accommodation === 'Home' ||
    accommodation === 'flight'
  ) {
    return null
  }
  const name = accommodation.split(',')[0].trim()
  return name ? resolveVenue(name) : null
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const WIKIPEDIA_HEADERS = {
  'User-Agent': 'AsiaFamilyHoliday/1.0 (https://github.com/familytrip/asia-itinerary)',
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

function searchWords(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s&]+/)
    .filter((word) => word.length > 2)
}

function isRelevantSearchResult(query: string, title: string): boolean {
  const words = searchWords(query)
  if (words.length === 0) return true

  const titleLower = title.toLowerCase()
  const matched = words.filter((word) => titleLower.includes(word)).length
  const required = words.length <= 2 ? words.length : Math.ceil(words.length * 0.6)
  return matched >= required
}

async function fetchWithRetry(url: string, signal?: AbortSignal): Promise<Response> {
  let attempt = 0
  while (true) {
    const response = await fetch(url, { signal, headers: WIKIPEDIA_HEADERS })
    if (response.status === 429 && attempt < 3) {
      await wait(1000 * 2 ** attempt)
      attempt++
      continue
    }
    return response
  }
}

async function wikipediaSearchTitle(query: string, signal?: AbortSignal): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'opensearch',
    search: query,
    limit: '5',
    namespace: '0',
    format: 'json',
    origin: '*',
  })

  const response = await requestQueue.run(() =>
    fetchWithRetry(`https://en.wikipedia.org/w/api.php?${params}`, signal),
  )

  if (!response.ok) {
    if (response.status >= 500 || response.status === 429) {
      throw new Error(`Wikipedia search failed: ${response.status}`)
    }
    return null
  }

  const data = (await response.json()) as [string, string[]]
  const titles = data[1] ?? []
  return titles.find((title) => isRelevantSearchResult(query, title)) ?? null
}

async function wikipediaSummaryData(
  title: string,
  signal?: AbortSignal,
): Promise<WikipediaSummary | null> {
  const encodedTitle = encodeURIComponent(title.replace(/ /g, '_'))
  const response = await requestQueue.run(() =>
    fetchWithRetry(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`,
      signal,
    ),
  )

  if (!response.ok) {
    if (response.status >= 500 || response.status === 429) {
      throw new Error(`Wikipedia summary failed: ${response.status}`)
    }
    return null
  }

  return (await response.json()) as WikipediaSummary
}

async function wikipediaSummary(title: string, signal?: AbortSignal): Promise<string | null> {
  const data = await wikipediaSummaryData(title, signal)
  if (!data) return null
  // Prefer the API thumbnail — originalimage URLs are often 3840px and get rate-limited in browsers.
  const source = data.thumbnail?.source ?? data.originalimage?.source
  return source ?? null
}

/** Upscale Wikimedia thumb URLs for banner use; pass through originals unchanged. */
export function toHeroImageUrl(url: string): string {
  if (url.includes('/thumb/') && /\/\d+px-/.test(url)) {
    return url.replace(/\/(\d+)px-/, `/${HERO_THUMB_WIDTH_PX}px-`)
  }
  return url
}

function normalizeHeroCacheKey(title: string): string {
  return `${HERO_IMAGE_CACHE_VERSION}:${title.trim().toLowerCase()}`
}

function getHeroCacheEntry(title: string): CacheEntry | undefined {
  const key = normalizeHeroCacheKey(title)
  const entry = imageCache.get(key)
  if (!entry) return undefined
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    imageCache.delete(key)
    return undefined
  }
  return entry
}

function setHeroCacheEntry(title: string, url: string | null, ttlMs?: number): void {
  imageCache.set(normalizeHeroCacheKey(title), {
    url,
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  })
}

async function wikipediaHeroImage(title: string, signal?: AbortSignal): Promise<string | null> {
  const data = await wikipediaSummaryData(title, signal)
  if (!data) return null

  if (data.originalimage?.source) return data.originalimage.source
  if (data.thumbnail?.source) return toHeroImageUrl(data.thumbnail.source)
  return null
}

export async function fetchHeroImageForTitle(
  title: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const cached = getHeroCacheEntry(title)
  if (cached) return cached.url

  try {
    let imageUrl = await wikipediaHeroImage(title, signal)
    if (!imageUrl) {
      const fallback = await wikipediaPageImage(title, signal)
      imageUrl = fallback ? toHeroImageUrl(fallback) : null
    }
    setHeroCacheEntry(title, imageUrl, imageUrl ? undefined : NEGATIVE_CACHE_TTL_MS)
    return imageUrl
  } catch (error) {
    if (isAbortError(error)) throw error
    return null
  }
}

export async function fetchHeroBackgroundImages(signal?: AbortSignal): Promise<string[]> {
  const urls: string[] = []

  for (const title of HERO_WIKIPEDIA_TITLES) {
    const url = await fetchHeroImageForTitle(title, signal)
    if (url) urls.push(url)
  }

  return urls
}

async function wikipediaPageImage(title: string, signal?: AbortSignal): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'pageimages',
    pithumbsize: '330',
    format: 'json',
    origin: '*',
  })

  const response = await requestQueue.run(() =>
    fetchWithRetry(`https://en.wikipedia.org/w/api.php?${params}`, signal),
  )

  if (!response.ok) {
    if (response.status >= 500 || response.status === 429) {
      throw new Error(`Wikipedia pageimages failed: ${response.status}`)
    }
    return null
  }

  const data = (await response.json()) as PageImagesResponse
  const pages = data.query?.pages
  if (!pages) return null

  const page = Object.values(pages)[0]
  return page?.thumbnail?.source ?? null
}

async function resolveImageForTitle(title: string, signal?: AbortSignal): Promise<string | null> {
  const summaryImage = await wikipediaSummary(title, signal)
  if (summaryImage) return summaryImage
  return wikipediaPageImage(title, signal)
}

export async function fetchPlaceImageUrl(
  query: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const cacheKey = query.trim().toLowerCase()
  const cached = getCacheEntry(cacheKey)
  if (cached) return cached.url

  const inflight = inflightRequests.get(cacheKey)
  if (inflight) return inflight

  const request = (async () => {
    try {
      const title = await wikipediaSearchTitle(query, signal)
      if (!title) {
        setCacheEntry(cacheKey, null, NEGATIVE_CACHE_TTL_MS)
        return null
      }

      const imageUrl = await resolveImageForTitle(title, signal)
      setCacheEntry(cacheKey, imageUrl, imageUrl ? undefined : NEGATIVE_CACHE_TTL_MS)
      return imageUrl
    } catch (error) {
      if (isAbortError(error)) throw error
      return null
    } finally {
      inflightRequests.delete(cacheKey)
    }
  })()

  inflightRequests.set(cacheKey, request)
  return request
}

export async function fetchPlaceImageForVenue(
  venue: string,
  location: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const resolvedVenue = resolveVenue(venue)
  const venueKey = resolvedVenue.trim().toLowerCase()

  const directTitle = VENUE_WIKIPEDIA_TITLES[venueKey]
  if (directTitle) {
    const url = await resolveImageForTitle(directTitle, signal)
    setCacheEntry(venueKey, url, url ? undefined : NEGATIVE_CACHE_TTL_MS)
    return url
  }

  const cachedVenue = getCacheEntry(venueKey)
  if (cachedVenue) return cachedVenue.url

  for (const query of buildPlaceSearchQueries(resolvedVenue, location)) {
    const cacheKey = query.trim().toLowerCase()
    const cachedQuery = getCacheEntry(cacheKey)
    if (cachedQuery) {
      if (cachedQuery.url) {
        setCacheEntry(venueKey, cachedQuery.url)
        return cachedQuery.url
      }
      continue
    }

    const url = await fetchPlaceImageUrl(query, signal)
    if (url) {
      setCacheEntry(venueKey, url)
      return url
    }
  }

  setCacheEntry(venueKey, null, NEGATIVE_CACHE_TTL_MS)
  return null
}

export function getCachedPlaceImageUrl(query: string): string | null | undefined {
  const cacheKey = query.trim().toLowerCase()
  const entry = getCacheEntry(cacheKey)
  if (!entry) return undefined
  return entry.url
}
