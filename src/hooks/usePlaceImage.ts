import { useEffect, useState } from 'react'
import {
  fetchPlaceImageForVenue,
  getCachedPlaceImageUrl,
} from '../utils/placeImages'

interface UsePlaceImageOptions {
  venue: string | null
  location: string
  enabled?: boolean
}

interface UsePlaceImageResult {
  imageUrl: string | null
  loading: boolean
  failed: boolean
  label: string | null
}

function initialState(
  venue: string | null,
  enabled: boolean,
): { imageUrl: string | null; loading: boolean; failed: boolean } {
  if (!enabled || !venue) {
    return { imageUrl: null, loading: false, failed: false }
  }

  const cached = getCachedPlaceImageUrl(venue.trim().toLowerCase())
  if (cached !== undefined) {
    return { imageUrl: cached, loading: false, failed: cached === null }
  }

  return { imageUrl: null, loading: true, failed: false }
}

export function usePlaceImage({
  venue,
  location,
  enabled = true,
}: UsePlaceImageOptions): UsePlaceImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(
    () => initialState(venue, enabled).imageUrl,
  )
  const [loading, setLoading] = useState(() => initialState(venue, enabled).loading)
  const [failed, setFailed] = useState(() => initialState(venue, enabled).failed)

  useEffect(() => {
    if (!enabled || !venue) {
      setImageUrl(null)
      setLoading(false)
      setFailed(false)
      return
    }

    const cacheKey = venue.trim().toLowerCase()
    const cached = getCachedPlaceImageUrl(cacheKey)

    if (cached !== undefined) {
      setImageUrl(cached)
      setLoading(false)
      setFailed(cached === null)
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setFailed(false)
    setImageUrl(null)

    fetchPlaceImageForVenue(venue, location, controller.signal)
      .then((url) => {
        if (cancelled) return
        setImageUrl(url)
        setFailed(url === null)
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setImageUrl(null)
        setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [enabled, venue, location])

  return {
    imageUrl,
    loading,
    failed,
    label: venue,
  }
}
