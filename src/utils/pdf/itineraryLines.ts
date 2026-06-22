const ORPHAN_TIME_RE = /^\d{1,2}:\d{2}$/
const CONTINUATION_RE = /^[\u2013\u2014-]\s*/
const WORD_TIME_ONLY_RE = /^(?:Morning|Afternoon|Evening|Night|Day)$/i

function hasTimePrefix(line: string): boolean {
  const timeRegex =
    /^(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?(?:\+)?\s*(?:-\s*(?:\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm|h|H)?|Noon|Midnight))?[:\s-]*)/i
  const wordTimeRegex = /^((?:Morning|Afternoon|Evening|Night|Day)[:\s-]*)/i
  const bare24hRegex = /^\d{1,2}:\d{2}(?::|\s|$)/

  return Boolean(line.match(timeRegex) || line.match(wordTimeRegex) || line.match(bare24hRegex))
}

/** Merge broken itinerary lines before timeline parsing. */
export function prepareItineraryLines(itinerary: string): string[] {
  const raw = itinerary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (raw.length === 0) return []

  const merged: string[] = []
  let index = 0

  while (index < raw.length) {
    let line = raw[index]

    if (ORPHAN_TIME_RE.test(line) && index + 1 < raw.length) {
      const next = raw[index + 1]
      const joiner = next.startsWith('-') || next.startsWith('–') ? '' : ' '
      line = `${line}${joiner}${next}`
      index += 2
      merged.push(line)
      continue
    }

    if (
      WORD_TIME_ONLY_RE.test(line) &&
      index + 1 < raw.length &&
      !hasTimePrefix(raw[index + 1])
    ) {
      merged.push(`${line}: ${raw[index + 1]}`)
      index += 2
      continue
    }

    if (merged.length > 0 && CONTINUATION_RE.test(line)) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${line.replace(CONTINUATION_RE, '')}`.trim()
      index++
      continue
    }

    merged.push(line)
    index++
  }

  return merged
}
