import {
  CURATED_VENUE_ATTRIBUTIONS,
  CURATED_VENUE_IMAGES,
  CURATED_VENUE_SOURCES,
} from '../data/curatedImages'
import type { PlaceImageResult, PlaceImageSource } from '../types/placeImage'
import { extractVenue, formatLocationPin, getLocationMeta } from './locations'
import { fetchPexelsImageUrl } from './pexelsImages'
import { fetchTripAdvisorImageUrl } from './tripadvisorImages'

export type { PlaceImageResult, PlaceImageSource } from '../types/placeImage'

interface CacheEntry {
  url: string | null
  source?: PlaceImageSource
  attribution?: string | null
  expiresAt?: number
}

const imageCache = new Map<string, CacheEntry>()
const inflightRequests = new Map<string, Promise<string | null>>()
const hotelInflightRequests = new Map<string, Promise<PlaceImageResult | null>>()

const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000
const QUEUE_CONCURRENCY = 2
const QUEUE_GAP_MS = 250
/** Bump when cache URL format changes (e.g. thumbnail vs originalimage preference). */
const CACHE_KEY_VERSION = 'v6'
const HOTEL_IMAGE_WIDTH_PX = 330

const AIRPORT_NAMES: Record<string, string> = {
  DUB: 'Dublin Airport',
  DOH: 'Hamad International Airport',
  SIN: 'Changi Airport',
  USM: 'Samui Airport',
  BKK: 'Suvarnabhumi Airport',
  DAD: 'Da Nang International Airport',
  HAN: 'Noi Bai International Airport',
}

const VENUE_REDIRECTS: Record<string, string> = {}

/** Shorten long accommodation strings to searchable hotel names. */
const HOTEL_NAME_ALIASES: Record<string, string> = {
  'nora buri - 2x pool villas with hilltop view. breakfast included.': 'Nora Buri',
}

/** Last-resort Wikipedia articles when hotel-specific lookups find nothing. */
const HOTEL_LANDMARK_FALLBACKS: Record<string, string> = {
  'azura cruise halong bay': 'Ha Long Bay',
  'furama city centre': 'Chinatown, Singapore',
  'little hoi an': 'Hoi An Ancient Town',
  'little hoi an. a boutique hotel & spa': 'Hoi An Ancient Town',
  'nora buri': 'Ko Samui',
  'oryx airport hotel': 'Hamad International Airport',
  'peninsula hotel da nang': 'Da Nang',
  'peridot grand luxury boutique hotel': 'Hanoi old quarter',
  'proverb hotel': 'Hanoi old quarter',
  'the berkeley hotel pratunam': 'Pratunam',
}

/** Sub-city hints for venues whose name alone matches the wrong place worldwide. */
const VENUE_LOCATION_HINTS: Record<string, string> = {
  'bubble forest cafe': 'Pathum Wan, Bangkok',
  "coco tam's": 'Bophut, Koh Samui',
  "fisherman's village": 'Bophut, Koh Samui',
  'han market': 'Hai Chau, Da Nang',
  'overlap stone': 'Lamai, Koh Samui',
  'the jungle club': 'Chaweng, Koh Samui',
  'train street': 'Hoan Kiem, Hanoi',
}

/** Venue names unique enough to search without location qualifiers. */
const UNIQUE_VENUE_NAMES = new Set([
  'artscience museum',
  'gardens by the bay',
  'golden bridge',
  'grand palace',
  'harry potter: visions of magic',
  'iconsiam',
  'jewel changi airport',
  'marina bay sands',
  'resorts world sentosa',
  'teamLab future world',
  'universal studios singapore',
  'wat pho',
  'wat phra kaew',
])

const GENERIC_VENUE_PATTERNS = [
  /\bvillage\b/i,
  /\bmarket\b/i,
  /\btemple\b/i,
  /\bbeach\b/i,
  /\bquarter\b/i,
  /\btrain street\b/i,
  /\bfood centre\b/i,
  /\bfood center\b/i,
  /\bpagoda\b/i,
  /\bharbour\b/i,
  /\bharbor\b/i,
  /\bclub\b/i,
  /\bstone\b/i,
  /\bcafe\b/i,
  /\bcafé\b/i,
  /\btour\b/i,
  /\bhome\b/i,
]

interface ImageSearchContext {
  venue: string
  venueKey: string
  location: string
  locationTokens: string[]
  genericVenue: boolean
}

/** Venues with no (or misleading) Wikipedia opensearch results — use a known article title. */
const VENUE_WIKIPEDIA_TITLES: Record<string, string> = {
  'cam thanh basket boat': 'Hoi An Ancient Town',
  'harry potter: visions of magic': 'Resorts World Sentosa',
  'lady buddha': 'Son Tra Mountain',
  'linh ung pagoda': 'Son Tra Mountain',
  'palawan beach': 'Sentosa',
  'raffles long bar': 'Raffles Hotel Singapore',
  'satay by the bay': 'Gardens by the Bay',
  'solar castle': 'Da Nang',
  'thang long water puppet theatre': 'Water puppetry',
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

interface WikidataSearchEntity {
  id: string
  label: string
  description?: string
}

interface WikidataSearchResponse {
  search?: WikidataSearchEntity[]
}

interface WikidataClaimsResponse {
  entities?: Record<
    string,
    {
      claims?: {
        P18?: Array<{
          mainsnak: {
            datavalue?: {
              value: string
            }
          }
        }>
      }
    }
  >
}

interface CommonsSearchResponse {
  query?: {
    search?: Array<{ title: string }>
  }
}

interface CommonsImageInfoResponse {
  query?: {
    pages?: Record<
      string,
      {
        imageinfo?: Array<{ thumburl?: string; url?: string }>
      }
    >
  }
}

const HOTEL_DESCRIPTION_HINTS =
  /\b(hotel|resort|hostel|inn|lodge|motel|suites?|boutique|cruise|airport hotel)\b/i

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
  return buildPlaceSearchQueries(venue, location)[0] ?? formatLocationPin(venue, location)
}

export function buildPlaceSearchQueries(venue: string, location: string): string[] {
  const venueKey = venue.trim().toLowerCase()
  const meta = getLocationMeta(location)
  const hint = VENUE_LOCATION_HINTS[venueKey]
  const ordered: string[] = []

  const push = (query: string) => {
    const trimmed = query.trim()
    if (trimmed) ordered.push(trimmed)
  }

  if (hint && meta.country) {
    push(`${venue}, ${hint}, ${meta.country}`)
  }
  if (hint) {
    push(`${venue}, ${hint}`)
    push(`${venue} ${hint}`)
  }

  push(formatLocationPin(venue, location))

  if (meta.city && meta.city !== 'In transit') {
    push(`${venue} ${meta.city}`)
  }
  if (meta.country) {
    push(`${venue} ${meta.country}`)
  }

  if (!isGenericVenueName(venue)) {
    push(venue)
  }

  return [...new Set(ordered)]
}

function isGenericVenueName(venue: string): boolean {
  const key = venue.trim().toLowerCase()
  if (UNIQUE_VENUE_NAMES.has(key)) return false
  return GENERIC_VENUE_PATTERNS.some((pattern) => pattern.test(venue))
}

function getLocationTokens(location: string, venueKey: string): string[] {
  const meta = getLocationMeta(location)
  const hint = VENUE_LOCATION_HINTS[venueKey] ?? ''
  const combined = [hint, meta.city, meta.country].filter(Boolean).join(' ')
  const tokens = new Set(searchWords(combined))

  const lower = combined.toLowerCase()
  if (lower.includes('samui')) tokens.add('samui')
  if (lower.includes('bophut') || lower.includes('bo phut')) {
    tokens.add('bophut')
    tokens.add('phut')
  }
  if (lower.includes('lamai')) tokens.add('lamai')
  if (lower.includes('chaweng')) tokens.add('chaweng')
  if (lower.includes('singapore')) tokens.add('singapore')
  if (lower.includes('vietnam')) tokens.add('vietnam')
  if (lower.includes('thailand')) tokens.add('thailand')
  if (lower.includes('hanoi')) tokens.add('hanoi')
  if (lower.includes('bangkok')) tokens.add('bangkok')
  if (lower.includes('danang') || lower.includes('da nang')) {
    tokens.add('danang')
    tokens.add('nang')
  }

  return [...tokens]
}

function buildImageSearchContext(venue: string, location: string): ImageSearchContext {
  const venueKey = venue.trim().toLowerCase()
  return {
    venue,
    venueKey,
    location,
    locationTokens: getLocationTokens(location, venueKey),
    genericVenue: isGenericVenueName(venue),
  }
}

function textMatchesLocationTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) return true
  const lower = text.toLowerCase()
  return tokens.some((token) => lower.includes(token))
}

function resolveVenue(venue: string): string {
  const key = venue.trim().toLowerCase()
  return VENUE_REDIRECTS[key] ?? venue
}

function resolveHotelName(venue: string): string {
  const key = venue.trim().toLowerCase()
  return HOTEL_NAME_ALIASES[key] ?? venue.trim()
}

function hotelCacheKey(venueKey: string): string {
  return `hotel:${venueKey.trim().toLowerCase()}`
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

function setCacheEntry(cacheKey: string, result: PlaceImageResult | null, ttlMs?: number): void {
  imageCache.set(normalizeCacheKey(cacheKey), {
    url: result?.url ?? null,
    source: result?.source,
    attribution: result?.attribution ?? null,
    expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
  })
}

function setCacheUrl(cacheKey: string, url: string | null, ttlMs?: number): void {
  setCacheEntry(cacheKey, url ? wikimediaResult(url) : null, ttlMs)
}

function wikimediaResult(url: string): PlaceImageResult {
  return { url, source: 'wikimedia', attribution: null }
}

function cacheEntryToResult(entry: CacheEntry): PlaceImageResult | null {
  if (!entry.url) return null
  return {
    url: entry.url,
    source: entry.source ?? 'wikimedia',
    attribution: entry.attribution ?? null,
  }
}

function getCachedResult(cacheKey: string): PlaceImageResult | null | undefined {
  const entry = getCacheEntry(cacheKey)
  if (!entry) return undefined
  return cacheEntryToResult(entry)
}

function getCuratedImage(venueKey: string): PlaceImageResult | null {
  const key = venueKey.trim().toLowerCase()
  const url = CURATED_VENUE_IMAGES[key]
  if (!url) return null
  return {
    url,
    source: CURATED_VENUE_SOURCES[key] ?? 'curated',
    attribution: CURATED_VENUE_ATTRIBUTIONS[key] ?? null,
  }
}

async function fetchExternalImageFallbacks(
  queries: string[],
  signal: AbortSignal | undefined,
  category: 'hotels' | 'attractions',
): Promise<PlaceImageResult | null> {
  for (const query of queries) {
    const tripadvisor = await fetchTripAdvisorImageUrl(query, signal, category)
    if (tripadvisor) {
      return {
        url: tripadvisor.url,
        source: 'tripadvisor',
        attribution: tripadvisor.attribution,
      }
    }

    const pexels = await fetchPexelsImageUrl(query, signal)
    if (pexels) {
      return {
        url: pexels.url,
        source: 'pexels',
        attribution: pexels.attribution,
      }
    }
  }

  return null
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
  return name ? resolveHotelName(name) : null
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const WIKIPEDIA_HEADERS = {
  'User-Agent': 'AsiaFamilyHoliday/1.0 (https://github.com/denhamd2/asiatrip)',
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

function isRelevantSearchResult(
  query: string,
  title: string,
  context?: ImageSearchContext,
): boolean {
  const words = searchWords(query)
  if (words.length === 0) return true

  const titleLower = title.toLowerCase()
  const matched = words.filter((word) => titleLower.includes(word)).length
  const required = words.length <= 2 ? words.length : Math.ceil(words.length * 0.6)
  if (matched < required) return false

  if (context?.genericVenue && !textMatchesLocationTokens(title, context.locationTokens)) {
    return false
  }

  return true
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

async function wikipediaSearchTitle(
  query: string,
  signal?: AbortSignal,
  context?: ImageSearchContext,
): Promise<string | null> {
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
  return titles.find((title) => isRelevantSearchResult(query, title, context)) ?? null
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

function commonsThumbUrl(filename: string, widthPx = HOTEL_IMAGE_WIDTH_PX): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${widthPx}`
}

function scoreWikidataHotelEntity(
  entity: WikidataSearchEntity,
  query: string,
  context?: ImageSearchContext,
): number {
  let score = 0
  const labelLower = entity.label.toLowerCase()
  const queryLower = query.toLowerCase()
  const descriptionLower = entity.description?.toLowerCase() ?? ''
  const combined = `${labelLower} ${descriptionLower}`

  if (labelLower === queryLower) score += 100
  else if (labelLower.includes(queryLower) || queryLower.includes(labelLower)) score += 50

  if (entity.description && HOTEL_DESCRIPTION_HINTS.test(entity.description)) score += 40

  const words = searchWords(query)
  const matched = words.filter((word) => labelLower.includes(word)).length
  score += matched * 10

  if (context) {
    const locationMatches = context.locationTokens.filter((token) => combined.includes(token)).length
    score += locationMatches * 15
    if (context.genericVenue && locationMatches === 0) return 0
  }

  return score
}

async function wikidataImageForQuery(
  query: string,
  signal?: AbortSignal,
  context?: ImageSearchContext,
): Promise<string | null> {
  const searchParams = new URLSearchParams({
    action: 'wbsearchentities',
    search: query,
    language: 'en',
    limit: '5',
    format: 'json',
    origin: '*',
  })

  const searchResponse = await requestQueue.run(() =>
    fetchWithRetry(`https://www.wikidata.org/w/api.php?${searchParams}`, signal),
  )

  if (!searchResponse.ok) {
    if (searchResponse.status >= 500 || searchResponse.status === 429) {
      throw new Error(`Wikidata search failed: ${searchResponse.status}`)
    }
    return null
  }

  const searchData = (await searchResponse.json()) as WikidataSearchResponse
  const entities = searchData.search ?? []
  if (entities.length === 0) return null

  const ranked = entities
    .map((entity) => ({
      entity,
      score: scoreWikidataHotelEntity(entity, query, context),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  if (!ranked[0]) return null

  const claimsParams = new URLSearchParams({
    action: 'wbgetentities',
    ids: ranked
      .slice(0, 3)
      .map(({ entity }) => entity.id)
      .join('|'),
    props: 'claims',
    format: 'json',
    origin: '*',
  })

  const claimsResponse = await requestQueue.run(() =>
    fetchWithRetry(`https://www.wikidata.org/w/api.php?${claimsParams}`, signal),
  )

  if (!claimsResponse.ok) {
    if (claimsResponse.status >= 500 || claimsResponse.status === 429) {
      throw new Error(`Wikidata claims failed: ${claimsResponse.status}`)
    }
    return null
  }

  const claimsData = (await claimsResponse.json()) as WikidataClaimsResponse

  for (const { entity } of ranked) {
    const filename = claimsData.entities?.[entity.id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value
    if (filename) return commonsThumbUrl(filename)
  }

  return null
}

function isUndesirableCommonsFile(title: string): boolean {
  const lower = title.toLowerCase()
  return (
    /\.(svg|pdf|djvu|ogv|webm|ogm|mp3|wav|mid)\b/.test(lower) ||
    /\b(logo|icon|map|flag|coat of arms|emblem|seal|diagram|chart)\b/.test(lower)
  )
}

function scoreCommonsFileTitle(
  query: string,
  title: string,
  context?: ImageSearchContext,
): number {
  const fileTitle = title.replace(/^File:/, '').toLowerCase()
  const words = searchWords(query)
  if (words.length === 0) return 0

  if (words.includes('hotel') && !fileTitle.includes('hotel')) return 0

  let score = 0
  for (const word of words) {
    if (fileTitle.includes(word)) score += 10
  }

  if (HOTEL_DESCRIPTION_HINTS.test(fileTitle)) score += 5

  if (context) {
    const locationMatches = context.locationTokens.filter((token) => fileTitle.includes(token)).length
    score += locationMatches * 15
    if (context.genericVenue && locationMatches === 0) return 0
  }

  const required = words.length <= 2 ? words.length : Math.ceil(words.length * 0.5)
  const matched = words.filter((word) => fileTitle.includes(word)).length
  if (matched < required) return 0

  return score
}

async function commonsFileSearch(
  query: string,
  signal?: AbortSignal,
  context?: ImageSearchContext,
): Promise<string | null> {
  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: '6',
    srlimit: '8',
    format: 'json',
    origin: '*',
  })

  const searchResponse = await requestQueue.run(() =>
    fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${searchParams}`, signal),
  )

  if (!searchResponse.ok) {
    if (searchResponse.status >= 500 || searchResponse.status === 429) {
      throw new Error(`Commons search failed: ${searchResponse.status}`)
    }
    return null
  }

  const searchData = (await searchResponse.json()) as CommonsSearchResponse
  const candidates = (searchData.query?.search ?? []).filter(
    (result) => !isUndesirableCommonsFile(result.title),
  )
  if (candidates.length === 0) return null

  const ranked = candidates
    .map((result) => ({
      result,
      score: scoreCommonsFileTitle(query, result.title, context),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  const title = ranked[0]?.result.title ?? null
  if (!title) return null

  const imageParams = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: String(HOTEL_IMAGE_WIDTH_PX),
    format: 'json',
    origin: '*',
  })

  const imageResponse = await requestQueue.run(() =>
    fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${imageParams}`, signal),
  )

  if (!imageResponse.ok) {
    if (imageResponse.status >= 500 || imageResponse.status === 429) {
      throw new Error(`Commons imageinfo failed: ${imageResponse.status}`)
    }
    return null
  }

  const imageData = (await imageResponse.json()) as CommonsImageInfoResponse
  const pages = imageData.query?.pages
  if (!pages) return null

  const page = Object.values(pages)[0]
  return page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url ?? null
}

async function fetchHotelImageUrlForQuery(
  query: string,
  signal?: AbortSignal,
  context?: ImageSearchContext,
): Promise<string | null> {
  const wikidataUrl = await wikidataImageForQuery(query, signal, context)
  if (wikidataUrl) return wikidataUrl

  const commonsUrl = await commonsFileSearch(query, signal, context)
  if (commonsUrl) return commonsUrl

  const title = await wikipediaSearchTitle(query, signal, context)
  if (!title) return null

  return resolveImageForTitle(title, signal)
}

export async function fetchPlaceImageUrl(
  query: string,
  signal?: AbortSignal,
  context?: ImageSearchContext,
): Promise<string | null> {
  const cacheKey = query.trim().toLowerCase()
  const cached = getCacheEntry(cacheKey)
  if (cached) return cached.url

  const inflight = inflightRequests.get(cacheKey)
  if (inflight) return inflight

  const request = (async () => {
    try {
      const title = await wikipediaSearchTitle(query, signal, context)
      if (!title) {
        setCacheUrl(cacheKey, null, NEGATIVE_CACHE_TTL_MS)
        return null
      }

      const imageUrl = await resolveImageForTitle(title, signal)
      setCacheUrl(cacheKey, imageUrl, imageUrl ? undefined : NEGATIVE_CACHE_TTL_MS)
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
): Promise<PlaceImageResult | null> {
  const resolvedVenue = resolveVenue(venue)
  const venueKey = resolvedVenue.trim().toLowerCase()

  const curated = getCuratedImage(venueKey)
  if (curated) {
    setCacheEntry(venueKey, curated)
    return curated
  }

  const directTitle = VENUE_WIKIPEDIA_TITLES[venueKey]
  if (directTitle) {
    const url = await resolveImageForTitle(directTitle, signal)
    const result = url ? wikimediaResult(url) : null
    setCacheEntry(venueKey, result, result ? undefined : NEGATIVE_CACHE_TTL_MS)
    return result
  }

  const cachedVenue = getCachedResult(venueKey)
  if (cachedVenue !== undefined) return cachedVenue

  const searchContext = buildImageSearchContext(resolvedVenue, location)

  for (const query of buildPlaceSearchQueries(resolvedVenue, location)) {
    const cacheKey = query.trim().toLowerCase()
    const cachedQuery = getCachedResult(cacheKey)
    if (cachedQuery !== undefined) {
      if (cachedQuery) {
        setCacheEntry(venueKey, cachedQuery)
        return cachedQuery
      }
      continue
    }

    const url = await fetchPlaceImageUrl(query, signal, searchContext)
    const result = url ? wikimediaResult(url) : null
    setCacheUrl(cacheKey, url, url ? undefined : NEGATIVE_CACHE_TTL_MS)
    if (result) {
      setCacheEntry(venueKey, result)
      return result
    }
  }

  const external = await fetchExternalImageFallbacks(
    buildPlaceSearchQueries(resolvedVenue, location),
    signal,
    'attractions',
  )
  if (external) {
    setCacheEntry(venueKey, external)
    return external
  }

  setCacheEntry(venueKey, null, NEGATIVE_CACHE_TTL_MS)
  return null
}

export function getCachedPlaceImageMeta(venue: string): PlaceImageResult | null | undefined {
  return getCachedResult(venue.trim().toLowerCase())
}

export function getCachedHotelImageMeta(venue: string): PlaceImageResult | null | undefined {
  const venueKey = resolveHotelName(venue).trim().toLowerCase()
  return getCachedResult(hotelCacheKey(venueKey))
}

export function getCachedHotelImageUrl(venue: string): string | null | undefined {
  const meta = getCachedHotelImageMeta(venue)
  if (meta === undefined) return undefined
  return meta?.url ?? null
}

export async function fetchHotelImageUrl(
  venue: string,
  location: string,
  signal?: AbortSignal,
): Promise<PlaceImageResult | null> {
  const hotelName = resolveHotelName(venue)
  const venueKey = hotelName.trim().toLowerCase()
  const cacheKey = hotelCacheKey(venueKey)

  const curated = getCuratedImage(venueKey)
  if (curated) {
    setCacheEntry(cacheKey, curated)
    return curated
  }

  const cached = getCachedResult(cacheKey)
  if (cached !== undefined) return cached

  const inflight = hotelInflightRequests.get(cacheKey)
  if (inflight) return inflight

  const request = (async (): Promise<PlaceImageResult | null> => {
    try {
      const queries = buildPlaceSearchQueries(hotelName, location)
      const searchContext = buildImageSearchContext(hotelName, location)

      for (const query of queries) {
        const queryKey = `hotel-query:${query.trim().toLowerCase()}`
        const cachedQuery = getCachedResult(queryKey)
        if (cachedQuery !== undefined) {
          if (cachedQuery) {
            setCacheEntry(cacheKey, cachedQuery)
            return cachedQuery
          }
          continue
        }

        const url = await fetchHotelImageUrlForQuery(query, signal, searchContext)
        const result = url ? wikimediaResult(url) : null
        setCacheUrl(queryKey, url, url ? undefined : NEGATIVE_CACHE_TTL_MS)
        if (result) {
          setCacheEntry(cacheKey, result)
          return result
        }
      }

      const external = await fetchExternalImageFallbacks(queries, signal, 'hotels')
      if (external) {
        setCacheEntry(cacheKey, external)
        return external
      }

      const fallbackTitle = HOTEL_LANDMARK_FALLBACKS[venueKey]
      if (fallbackTitle) {
        const url = await resolveImageForTitle(fallbackTitle, signal)
        const result = url ? wikimediaResult(url) : null
        setCacheEntry(cacheKey, result, result ? undefined : NEGATIVE_CACHE_TTL_MS)
        return result
      }

      setCacheEntry(cacheKey, null, NEGATIVE_CACHE_TTL_MS)
      return null
    } catch (error) {
      if (isAbortError(error)) throw error
      return null
    } finally {
      hotelInflightRequests.delete(cacheKey)
    }
  })()

  hotelInflightRequests.set(cacheKey, request)
  return request
}

export function getCachedPlaceImageUrl(query: string): string | null | undefined {
  const meta = getCachedPlaceImageMeta(query)
  if (meta === undefined) return undefined
  return meta?.url ?? null
}
