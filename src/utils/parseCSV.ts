export function parseCSV(text: string): string[][] {
  const result: string[][] = []
  let row: string[] = []
  let inQuotes = false
  let cell = ''

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        row.push(cell.trim())
        cell = ''
      } else if (char === '\n' || char === '\r') {
        row.push(cell.trim())
        if (row.some((c) => c)) result.push(row)
        row = []
        cell = ''
        if (char === '\r' && i + 1 < text.length && text[i + 1] === '\n') {
          i++
        }
      } else {
        cell += char
      }
    }
  }
  if (cell || row.length) {
    row.push(cell.trim())
    if (row.some((c) => c)) result.push(row)
  }
  return result
}
