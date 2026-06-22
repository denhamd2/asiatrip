import { useEffect, useState } from 'react'
import {
  fetchHotelImageUrl,
  fetchPlaceImageForVenue,
  getCachedHotelImageMeta,
  getCachedPlaceImageMeta,
} from '../utils/placeImages'
import type { PlaceImageResult, PlaceImageSource } from '../types/placeImage'

export type { PlaceImageSource } from '../types/placeImage'

interface UsePlaceImageOptions {
  venue: string | null
  location: string
  enabled?: boolean
  fetchAs?: 'venue' | 'hotel'
}

interface UsePlaceImageResult {
  imageUrl: string | null
  attribution: string | null
  imageSource: PlaceImageSource | null
  loading: boolean
  failed: boolean
  label: string | null
}

function fromMeta(meta: PlaceImageResult | null | undefined): {
  imageUrl: string | null
  attribution: string | null
  imageSource: PlaceImageSource | null
  loading: boolean
  failed: boolean
} {
  if (meta === undefined) {
    return {
      imageUrl: null,
      attribution: null,
      imageSource: null,
      loading: true,
      failed: false,
    }
  }
  if (meta === null) {
    return {
      imageUrl: null,
      attribution: null,
      imageSource: null,
      loading: false,
      failed: true,
    }
  }
  return {
    imageUrl: meta.url,
    attribution: meta.attribution,
    imageSource: meta.source,
    loading: false,
    failed: false,
  }
}

function initialState(
  venue: string | null,
  enabled: boolean,
  fetchAs: 'venue' | 'hotel',
) {
  if (!enabled || !venue) {
    return {
      imageUrl: null as string | null,
      attribution: null as string | null,
      imageSource: null as PlaceImageSource | null,
      loading: false,
      failed: false,
    }
  }

  const meta =
    fetchAs === 'hotel' ? getCachedHotelImageMeta(venue) : getCachedPlaceImageMeta(venue)
  return fromMeta(meta)
}

export function usePlaceImage({
  venue,
  location,
  enabled = true,
  fetchAs = 'venue',
}: UsePlaceImageOptions): UsePlaceImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(
    () => initialState(venue, enabled, fetchAs).imageUrl,
  )
  const [attribution, setAttribution] = useState<string | null>(
    () => initialState(venue, enabled, fetchAs).attribution,
  )
  const [imageSource, setImageSource] = useState<PlaceImageSource | null>(
    () => initialState(venue, enabled, fetchAs).imageSource,
  )
  const [loading, setLoading] = useState(() => initialState(venue, enabled, fetchAs).loading)
  const [failed, setFailed] = useState(() => initialState(venue, enabled, fetchAs).failed)

  useEffect(() => {
    if (!enabled || !venue) {
      setImageUrl(null)
      setAttribution(null)
      setImageSource(null)
      setLoading(false)
      setFailed(false)
      return
    }

    const meta =
      fetchAs === 'hotel' ? getCachedHotelImageMeta(venue) : getCachedPlaceImageMeta(venue)

    if (meta !== undefined) {
      const state = fromMeta(meta)
      setImageUrl(state.imageUrl)
      setAttribution(state.attribution)
      setImageSource(state.imageSource)
      setLoading(state.loading)
      setFailed(state.failed)
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setFailed(false)
    setImageUrl(null)
    setAttribution(null)
    setImageSource(null)

    const fetchImage =
      fetchAs === 'hotel'
        ? fetchHotelImageUrl(venue, location, controller.signal)
        : fetchPlaceImageForVenue(venue, location, controller.signal)

    fetchImage
      .then((result) => {
        if (cancelled) return
        if (!result) {
          setImageUrl(null)
          setAttribution(null)
          setImageSource(null)
          setFailed(true)
          return
        }
        setImageUrl(result.url)
        setAttribution(result.attribution)
        setImageSource(result.source)
        setFailed(false)
      })
      .catch((error) => {
        if (cancelled) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setImageUrl(null)
        setAttribution(null)
        setImageSource(null)
        setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [enabled, venue, location, fetchAs])

  return {
    imageUrl,
    attribution,
    imageSource,
    loading,
    failed,
    label: venue,
  }
}
