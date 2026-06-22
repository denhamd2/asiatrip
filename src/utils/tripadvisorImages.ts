const TRIPADVISOR_BASE =
  import.meta.env.DEV && import.meta.env.VITE_TRIPADVISOR_API_KEY
    ? '/api/tripadvisor'
    : 'https://api.content.tripadvisor.com/api/v1'

const TRIPADVISOR_KEY = import.meta.env.VITE_TRIPADVISOR_API_KEY ?? ''

interface TripAdvisorSearchResponse {
  data?: Array<{ location_id?: number; name?: string }>
}

interface TripAdvisorPhotosResponse {
  data?: Array<{
    images?: {
      large?: { url?: string }
      original?: { url?: string }
      medium?: { url?: string }
      small?: { url?: string }
    }
  }>
}

export function isTripAdvisorConfigured(): boolean {
  return Boolean(TRIPADVISOR_KEY)
}

export async function fetchTripAdvisorImageUrl(
  query: string,
  signal?: AbortSignal,
  category?: 'hotels' | 'attractions' | 'restaurants',
): Promise<{ url: string; attribution: string } | null> {
  if (!TRIPADVISOR_KEY) return null

  const searchParams = new URLSearchParams({
    searchQuery: query,
    language: 'en',
  })
  if (category) searchParams.set('category', category)
  if (!import.meta.env.DEV) searchParams.set('key', TRIPADVISOR_KEY)

  const searchUrl = `${TRIPADVISOR_BASE}/location/search?${searchParams}`
  const searchRes = await fetch(searchUrl, { signal, headers: { accept: 'application/json' } })
  if (!searchRes.ok) return null

  const searchData = (await searchRes.json()) as TripAdvisorSearchResponse
  const locationId = searchData.data?.[0]?.location_id
  if (!locationId) return null

  const photoParams = new URLSearchParams({ language: 'en' })
  if (!import.meta.env.DEV) photoParams.set('key', TRIPADVISOR_KEY)

  const photoRes = await fetch(
    `${TRIPADVISOR_BASE}/location/${locationId}/photos?${photoParams}`,
    { signal, headers: { accept: 'application/json' } },
  )
  if (!photoRes.ok) return null

  const photoData = (await photoRes.json()) as TripAdvisorPhotosResponse
  const images = photoData.data?.[0]?.images
  const url =
    images?.large?.url ??
    images?.original?.url ??
    images?.medium?.url ??
    images?.small?.url ??
    null
  if (!url) return null

  return { url, attribution: 'Photo via Tripadvisor' }
}
