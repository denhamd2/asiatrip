const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY ?? ''

interface PexelsPhoto {
  photographer?: string
  src?: { large?: string; medium?: string; landscape?: string }
}

interface PexelsSearchResponse {
  photos?: PexelsPhoto[]
}

export function isPexelsConfigured(): boolean {
  return Boolean(PEXELS_KEY)
}

export async function fetchPexelsImageUrl(
  query: string,
  signal?: AbortSignal,
): Promise<{ url: string; attribution: string } | null> {
  if (!PEXELS_KEY) return null

  const params = new URLSearchParams({
    query,
    per_page: '8',
    orientation: 'landscape',
  })

  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    signal,
    headers: { Authorization: PEXELS_KEY },
  })

  if (!response.ok) return null

  const data = (await response.json()) as PexelsSearchResponse
  const photo = data.photos?.[0]
  if (!photo) return null
  const url = photo.src?.large ?? photo.src?.landscape ?? photo.src?.medium
  if (!url) return null

  const photographer = photo.photographer ?? 'Pexels contributor'
  return {
    url,
    attribution: `Photo by ${photographer} on Pexels`,
  }
}
