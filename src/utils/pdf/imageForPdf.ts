import type { TripDay } from '../../types'
import type { PlaceImageResult } from '../../types/placeImage'
import {
  extractAirportFromFlights,
  fetchHeroBackgroundImages,
  fetchHeroImageForTitle,
  fetchHotelImageUrl,
  fetchPlaceImageForVenue,
  getVenueFromAccommodation,
  HERO_WIKIPEDIA_TITLES,
} from '../placeImages'

const MAX_IMAGE_WIDTH_PX = 800
const JPEG_QUALITY = 0.85

const urlToDataUrlCache = new Map<string, string | null>()

export function clearPdfImageCache(): void {
  urlToDataUrlCache.clear()
}

export async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  const cached = urlToDataUrlCache.get(url)
  if (cached !== undefined) return cached

  try {
    const response = await fetch(url)
    if (!response.ok) {
      urlToDataUrlCache.set(url, null)
      return null
    }

    const blob = await response.blob()
    const bitmap = await createImageBitmap(blob)
    const scale = Math.min(1, MAX_IMAGE_WIDTH_PX / bitmap.width)
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      urlToDataUrlCache.set(url, null)
      return null
    }

    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    urlToDataUrlCache.set(url, dataUrl)
    return dataUrl
  } catch {
    urlToDataUrlCache.set(url, null)
    return null
  }
}

export async function resolveDayImage(day: TripDay): Promise<PlaceImageResult | null> {
  const stayVenue = getVenueFromAccommodation(day.accommodation)
  if (stayVenue) {
    const result = await fetchHotelImageUrl(stayVenue, day.location)
    if (result) return result
  }

  if (day.flights) {
    const airport = extractAirportFromFlights(day.flights)
    if (airport) {
      const result = await fetchPlaceImageForVenue(airport, day.location)
      if (result) return result
    }
  }

  const primary = day.location.split('→')[0].trim()
  return fetchPlaceImageForVenue(primary, day.location)
}

export async function resolveCoverHeroUrl(): Promise<string | null> {
  const urls = await fetchHeroBackgroundImages()
  if (urls.length > 0) return urls[0]
  return fetchHeroImageForTitle(HERO_WIKIPEDIA_TITLES[0])
}

export async function prefetchImagesForPdf(
  days: TripDay[],
  onProgress?: (current: number, total: number) => void,
): Promise<{
  cover: string | null
  dayImages: Map<number, string | null>
  dayAttributions: Map<number, string | null>
}> {
  clearPdfImageCache()

  const coverUrl = await resolveCoverHeroUrl()

  const dayImageTasks = await Promise.all(
    days.map(async (day, index) => {
      const result = await resolveDayImage(day)
      return { index, result }
    }),
  )

  const allUrlTasks = [
    { kind: 'cover' as const, url: coverUrl, attribution: null as string | null },
    ...dayImageTasks.map(({ index, result }) => ({
      kind: 'day' as const,
      index,
      url: result?.url ?? null,
      attribution: result?.attribution ?? null,
    })),
  ]

  const uniqueUrls = new Set<string>()
  for (const task of allUrlTasks) {
    if (task.url) uniqueUrls.add(task.url)
  }

  const dataUrlBySource = new Map<string, string | null>()
  const urlList = [...uniqueUrls]
  let loaded = 0

  for (const url of urlList) {
    dataUrlBySource.set(url, await fetchImageAsDataUrl(url))
    loaded++
    onProgress?.(loaded, urlList.length)
  }

  const resolveDataUrl = (url: string | null): string | null => {
    if (!url) return null
    return dataUrlBySource.get(url) ?? null
  }

  const dayImages = new Map<number, string | null>()
  const dayAttributions = new Map<number, string | null>()
  for (const task of allUrlTasks) {
    if (task.kind === 'day') {
      dayImages.set(task.index, resolveDataUrl(task.url))
      if (task.attribution) {
        dayAttributions.set(task.index, task.attribution)
      }
    }
  }

  return {
    cover: resolveDataUrl(coverUrl),
    dayImages,
    dayAttributions,
  }
}
