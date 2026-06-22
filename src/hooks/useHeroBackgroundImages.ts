import { useEffect, useState } from 'react'
import { fetchHeroBackgroundImages } from '../utils/placeImages'

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload ${url}`))
    img.src = url
  })
}

async function preloadImages(urls: string[]): Promise<string[]> {
  const loaded: string[] = []
  for (const url of urls) {
    try {
      await preloadImage(url)
      loaded.push(url)
    } catch {
      // Skip broken hero slides
    }
  }
  return loaded
}

interface UseHeroBackgroundImagesResult {
  urls: string[]
  ready: boolean
}

export function useHeroBackgroundImages(): UseHeroBackgroundImagesResult {
  const [urls, setUrls] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        const fetched = await fetchHeroBackgroundImages(controller.signal)
        const preloaded = await preloadImages(fetched)
        if (!controller.signal.aborted) {
          setUrls(preloaded)
        }
      } catch {
        if (!controller.signal.aborted) {
          setUrls([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setReady(true)
        }
      }
    })()

    return () => controller.abort()
  }, [])

  return { urls, ready }
}
