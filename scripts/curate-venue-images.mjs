#!/usr/bin/env node
/**
 * One-time venue photo curation for src/data/curatedImages.ts
 *
 * Uses TripAdvisor Content API (best), then Pexels, then Wikimedia Commons.
 * Re-run after adding TRIPADVISOR_API_KEY or PEXELS_API_KEY to .env.local:
 *
 *   node scripts/curate-venue-images.mjs
 *
 * TripAdvisor MCP (Cursor): see docs/PHOTO-CURATION.md — same API, agent-driven.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const TRIPADVISOR_KEY = process.env.TRIPADVISOR_API_KEY ?? ''
const PEXELS_KEY = process.env.PEXELS_API_KEY ?? ''
const UA = 'AsiaFamilyHoliday/1.0 (https://github.com/denhamd2/asiatrip)'

/** [cacheKey, searchQuery, locationHint] */
const TARGETS = [
  ['oryx airport hotel', 'Oryx Airport Hotel', 'Doha'],
  ['furama city centre', 'Furama City Centre', 'Singapore'],
  ['marina bay sands', 'Marina Bay Sands', 'Singapore'],
  ['nora buri', 'Nora Buri Resort & Spa', 'Koh Samui'],
  ['the berkeley hotel pratunam', 'The Berkeley Hotel Pratunam', 'Bangkok'],
  ['peninsula hotel da nang', 'Peninsula Hotel Da Nang', 'Da Nang'],
  ['little hoi an. a boutique hotel & spa', 'Little Hoi An Boutique Hotel', 'Hoi An'],
  ['peridot grand luxury boutique hotel', 'Peridot Grand Luxury Boutique Hotel', 'Hanoi'],
  ['azura cruise halong bay', 'Azura Cruise Halong Bay', 'Ha Long Bay'],
  ['proverb hotel', 'Proverb Hotel', 'Hanoi'],
  ['bubble forest cafe', 'Bubble Forest Cafe', 'Bangkok'],
  ['samui elephant home', 'Samui Elephant Home', 'Koh Samui'],
  ['cam thanh basket boat', 'Cam Thanh basket boat Hoi An', 'Hoi An'],
  ["coco tam's", "Coco Tam's beach bar", 'Koh Samui'],
  ['solar castle', 'Solar Castle Da Nang', 'Da Nang'],
  ['pig island tour', 'Pig Island Koh Samui', 'Koh Samui'],
  ['overlap stone', 'Overlap Stone Koh Samui', 'Koh Samui'],
  ['han market', 'Han Market Da Nang', 'Da Nang'],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function tripadvisorPhoto(query, category) {
  if (!TRIPADVISOR_KEY) return null
  const searchParams = new URLSearchParams({
    searchQuery: query,
    language: 'en',
    key: TRIPADVISOR_KEY,
  })
  if (category) searchParams.set('category', category)

  const searchRes = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/search?${searchParams}`,
    { headers: { accept: 'application/json' } },
  )
  if (!searchRes.ok) return null
  const searchData = await searchRes.json()
  const locationId = searchData?.data?.[0]?.location_id
  if (!locationId) return null

  await sleep(300)

  const photoParams = new URLSearchParams({ language: 'en', key: TRIPADVISOR_KEY })
  const photoRes = await fetch(
    `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?${photoParams}`,
    { headers: { accept: 'application/json' } },
  )
  if (!photoRes.ok) return null
  const photoData = await photoRes.json()
  const image = photoData?.data?.[0]?.images
  const url =
    image?.large?.url ?? image?.original?.url ?? image?.medium?.url ?? image?.small?.url ?? null
  if (!url) return null
  return { url, source: 'tripadvisor', attribution: 'Photo via Tripadvisor' }
}

async function pexelsPhoto(query) {
  if (!PEXELS_KEY) return null
  const params = new URLSearchParams({ query, per_page: '5', orientation: 'landscape' })
  const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: PEXELS_KEY },
  })
  if (!res.ok) return null
  const data = await res.json()
  const photo = data?.photos?.[0]
  if (!photo?.src?.large) return null
  const photographer = photo.photographer ?? 'Pexels contributor'
  return {
    url: photo.src.large,
    source: 'pexels',
    attribution: `Photo by ${photographer} on Pexels`,
  }
}

async function commonsPhoto(query) {
  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: '6',
    srlimit: '5',
    format: 'json',
    origin: '*',
  })
  const searchRes = await fetch(`https://commons.wikimedia.org/w/api.php?${searchParams}`, {
    headers: { 'User-Agent': UA },
  })
  if (!searchRes.ok) return null
  const searchData = await searchRes.json()
  const title = searchData?.query?.search?.find((r) => {
    const lower = r.title.toLowerCase()
    return !/\.(svg|pdf|djvu)\b/.test(lower) && !/\b(logo|icon|map)\b/.test(lower)
  })?.title
  if (!title) return null

  await sleep(250)

  const imageParams = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '800',
    format: 'json',
    origin: '*',
  })
  const imageRes = await fetch(`https://commons.wikimedia.org/w/api.php?${imageParams}`, {
    headers: { 'User-Agent': UA },
  })
  if (!imageRes.ok) return null
  const imageData = await imageRes.json()
  const pages = imageData?.query?.pages
  if (!pages) return null
  const page = Object.values(pages)[0]
  const url = page?.imageinfo?.[0]?.thumburl ?? page?.imageinfo?.[0]?.url
  if (!url) return null
  return { url, source: 'curated', attribution: null }
}

async function resolveTarget([key, query, location]) {
  const fullQuery = `${query} ${location}`
  const isHotel = key.includes('hotel') || key.includes('nora buri') || key.includes('cruise')
  const category = isHotel ? 'hotels' : 'attractions'

  return (
    (await tripadvisorPhoto(fullQuery, category)) ??
    (await pexelsPhoto(fullQuery)) ??
    (await commonsPhoto(fullQuery))
  )
}

const results = {}
const attributions = {}

console.log('Curating venue images…')
if (!TRIPADVISOR_KEY) console.log('  (no TRIPADVISOR_API_KEY — skip TripAdvisor)')
if (!PEXELS_KEY) console.log('  (no PEXELS_API_KEY — skip Pexels)')

for (const target of TARGETS) {
  const [key] = target
  process.stdout.write(`  ${key}… `)
  try {
    const hit = await resolveTarget(target)
    if (hit) {
      results[key] = hit.url
      if (hit.attribution) attributions[key] = hit.attribution
      console.log(hit.source)
    } else {
      console.log('miss')
    }
  } catch (error) {
    console.log(`error (${error.message})`)
  }
  await sleep(400)
}

const imageLines = Object.entries(results)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `  '${k.replace(/'/g, "\\'")}': '${v.replace(/'/g, "\\'")}',`)
  .join('\n')

const attrLines = Object.entries(attributions)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `  '${k.replace(/'/g, "\\'")}': '${v.replace(/'/g, "\\'")}',`)
  .join('\n')

const output = `/** Auto-generated by scripts/curate-venue-images.mjs — do not edit by hand unless adding overrides. */
import type { PlaceImageSource } from '../types/placeImage'

export const CURATED_VENUE_IMAGES: Record<string, string> = {
${imageLines}
}

export const CURATED_VENUE_ATTRIBUTIONS: Record<string, string> = {
${attrLines}
}

export const CURATED_VENUE_SOURCES: Record<string, PlaceImageSource> = {
${Object.keys(results)
  .sort()
  .map((k) => {
    const src = attributions[k]
      ? attributions[k].includes('Pexels')
        ? 'pexels'
        : 'tripadvisor'
      : 'curated'
    return `  '${k.replace(/'/g, "\\'")}': '${src}',`
  })
  .join('\n')}
}
`

writeFileSync(join(ROOT, 'src/data/curatedImages.ts'), output)
console.log(`\nWrote ${Object.keys(results).length}/${TARGETS.length} entries to src/data/curatedImages.ts`)
