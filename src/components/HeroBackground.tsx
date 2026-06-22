import { useEffect, useState } from 'react'
import { useHeroBackgroundImages } from '../hooks/useHeroBackgroundImages'

const SLIDE_INTERVAL_MS = 6000

export function HeroBackground() {
  const { urls } = useHeroBackgroundImages()
  const [index, setIndex] = useState(0)
  const [showB, setShowB] = useState(false)

  useEffect(() => {
    setIndex(0)
    setShowB(false)
  }, [urls])

  useEffect(() => {
    if (urls.length <= 1) return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % urls.length)
      setShowB((prev) => !prev)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [urls.length])

  const prevIndex = urls.length > 0 ? (index - 1 + urls.length) % urls.length : 0
  const urlA = urls.length > 0 ? urls[showB ? prevIndex : index] : null
  const urlB = urls.length > 1 ? urls[showB ? index : prevIndex] : null

  return (
    <div className="hero-background absolute inset-0 bg-black" aria-hidden="true">
      {urlA && (
        <img
          src={urlA}
          alt=""
          fetchPriority="high"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            showB ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      {urlB && (
        <img
          src={urlB}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            showB ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  )
}
