/** Replace Unicode characters unsupported by jsPDF Helvetica before rendering. */
export function normalizePdfText(text: string): string {
  return text
    .replace(/\u2192/g, ' -> ')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u00b7/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00b0/g, ' deg')
    .replace(/\u2026/g, '...')
}
