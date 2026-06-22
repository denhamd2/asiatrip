import type { TripDay } from '../../types'
import {
  extractAirportFromFlights,
  fetchHeroBackgroundImages,
  fetchHeroImageForTitle,
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

export async function resolveDayImageUrl(day: TripDay): Promise<string | null> {
  const stayVenue = getVenueFromAccommodation(day.accommodation)
  if (stayVenue) {
    const url = await fetchPlaceImageForVenue(stayVenue, day.location)
    if (url) return url
  }

  if (day.flights) {
    const airport = extractAirportFromFlights(day.flights)
    if (airport) {
      const url = await fetchPlaceImageForVenue(airport, day.location)
      if (url) return url
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
}> {
  clearPdfImageCache()

  const coverUrl = await resolveCoverHeroUrl()

  const dayUrlTasks = await Promise.all(
    days.map(async (day, index) => {
      const url = await resolveDayImageUrl(day)
      return { index, url }
    }),
  )

  const allUrlTasks = [
    { kind: 'cover' as const, url: coverUrl },
    ...dayUrlTasks.map(({ index, url }) => ({
      kind: 'day' as const,
      index,
      url,
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
  for (const task of allUrlTasks) {
    if (task.kind === 'day') {
      dayImages.set(task.index, resolveDataUrl(task.url))
    }
  }

  return {
    cover: resolveDataUrl(coverUrl),
    dayImages,
  }
}
