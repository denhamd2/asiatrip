import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { usePlaceImage } from '../hooks/usePlaceImage'
import { ImageLightbox } from './ImageLightbox'

interface PlaceThumbnailProps {
  venue: string | null
  location: string
  enabled?: boolean
}

export function PlaceThumbnail({ venue, location, enabled = true }: PlaceThumbnailProps) {
  const { imageUrl, loading, failed } = usePlaceImage({ venue, location, enabled })
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!venue || !enabled) return null

  if (loading) {
    return (
      <div
        className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-slate-200"
        aria-hidden="true"
      />
    )
  }

  if (failed) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400"
        aria-hidden="true"
        title={`No photo found for ${venue}`}
      >
        <MapPin size={18} />
      </div>
    )
  }

  if (!imageUrl) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group/thumb h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-slate-200 transition-all hover:ring-2 hover:ring-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label={`View photo of ${venue}`}
      >
        <img
          src={imageUrl}
          alt={venue}
          loading="lazy"
          className="h-full w-full object-cover transition-transform group-hover/thumb:scale-105"
        />
      </button>

      {lightboxOpen && (
        <ImageLightbox
          imageUrl={imageUrl}
          caption={venue}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
