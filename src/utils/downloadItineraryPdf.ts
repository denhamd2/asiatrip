import { getTripDateRange, getTripStats } from '../data/tripData'
import type { TripDay } from '../types'
import { prefetchImagesForPdf } from './pdf/imageForPdf'
import {
  PDF,
  collectPhotoCredits,
  drawAllFooters,
  drawCoverPage,
  drawDayBlock,
  type PdfContext,
} from './pdf/pdfLayout'

function formatCost(total: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'EUR' }).format(total)
}

function buildStatsLine(days: TripDay[]): string {
  const stats = getTripStats(days)
  const parts = [
    `${stats.totalDays} days`,
    `${stats.destinations} destinations`,
    `${stats.flightDays} flight days`,
    stats.totalCost > 0 ? `${formatCost(stats.totalCost)} total` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

export async function downloadItineraryPdf(
  days: TripDay[],
  options?: { filterLabel?: string | null; onProgress?: (msg: string) => void },
): Promise<void> {
  if (days.length === 0) return

  options?.onProgress?.('Preparing images…')

  const { cover, dayImages, dayAttributions } = await prefetchImagesForPdf(days, (current, total) => {
    options?.onProgress?.(`Loading images (${current}/${total})…`)
  })

  options?.onProgress?.('Building document…')

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const ctx: PdfContext = { doc, y: PDF.MARGIN }

  const dateRange = getTripDateRange(days)
  const statsLine = buildStatsLine(days)

  drawCoverPage(ctx, {
    dateRange,
    statsLine,
    filterLabel: options?.filterLabel,
    heroImage: cover,
  })

  ctx.doc.addPage()
  ctx.y = PDF.MARGIN

  days.forEach((day, index) => {
    drawDayBlock(ctx, day, index, dayImages.get(index) ?? null, dayAttributions.get(index) ?? null)
  })

  drawAllFooters(doc, collectPhotoCredits(dayAttributions))

  const filename = options?.filterLabel
    ? `Asia Family Holiday 2026 — ${options.filterLabel}.pdf`
    : 'Asia Family Holiday 2026.pdf'

  doc.save(filename)
  options?.onProgress?.('Done')
}
