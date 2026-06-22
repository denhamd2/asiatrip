export type PlaceImageSource = 'curated' | 'wikimedia' | 'tripadvisor' | 'pexels'

export interface PlaceImageResult {
  url: string
  source: PlaceImageSource
  /** Plain-text credit line for lightbox / PDF (null for Wikimedia / curated Wikimedia). */
  attribution: string | null
}
