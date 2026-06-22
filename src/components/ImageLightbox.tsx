import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ImageLightboxProps {
  imageUrl: string
  caption: string
  onClose: () => void
}

export function ImageLightbox({ imageUrl, caption, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={caption}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close image"
      >
        <X size={24} />
      </button>

      <div
        className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={caption}
          className="max-h-[80vh] w-full object-contain"
        />
        <div className="border-t border-slate-100 px-5 py-3">
          <p className="text-sm font-semibold text-slate-800">{caption}</p>
        </div>
      </div>
    </div>
  )
}
