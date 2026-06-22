import type { jsPDF } from 'jspdf'
import type { BaggageAllowance, TripDay } from '../../types'
import { splitItineraryLine } from '../parseItinerary'
import { prepareItineraryLines } from './itineraryLines'
import { normalizePdfText } from './normalizePdfText'
import { PDF_BRAND, getPdfTheme, type PdfThemeColors } from './pdfTheme'

export const PDF = {
  PAGE_WIDTH: 210,
  PAGE_HEIGHT: 297,
  MARGIN: 15,
  FOOTER_Y: 285,
  CONTENT_BOTTOM: 273,
  SIDEBAR_WIDTH: 62,
  GUTTER: 6,
  TITLE: 'Asia Family Holiday 2026',
} as const

export const FONT = {
  BODY: 10,
  LABEL: 8,
  HEADER: 13,
  COVER_TITLE: 26,
  COVER_SUB: 12,
} as const

export interface PdfContext {
  doc: jsPDF
  y: number
}

function lineHeight(fontSize: number): number {
  return fontSize * 0.42
}

function setRgb(doc: jsPDF, rgb: [number, number, number]): void {
  doc.setTextColor(rgb[0], rgb[1], rgb[2])
}

function setFillRgb(doc: jsPDF, rgb: [number, number, number]): void {
  doc.setFillColor(rgb[0], rgb[1], rgb[2])
}

function setDrawRgb(doc: jsPDF, rgb: [number, number, number]): void {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2])
}

export function ensureSpace(ctx: PdfContext, needed: number): void {
  if (ctx.y + needed > PDF.CONTENT_BOTTOM) {
    ctx.doc.addPage()
    ctx.y = PDF.MARGIN
  }
}

function wrapText(doc: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  doc.setFontSize(fontSize)
  return doc.splitTextToSize(normalizePdfText(text), maxWidth) as string[]
}

function pdfText(text: string): string {
  return normalizePdfText(text)
}

function measureWrappedHeight(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number,
): number {
  const lines = wrapText(doc, text, maxWidth, fontSize)
  return lines.length * lineHeight(fontSize)
}

function drawWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  options?: { bold?: boolean; color?: [number, number, number] },
): number {
  doc.setFontSize(fontSize)
  doc.setFont('helvetica', options?.bold ? 'bold' : 'normal')
  if (options?.color) setRgb(doc, options.color)

  const lines = wrapText(doc, text, maxWidth, fontSize)
  const height = lineHeight(fontSize)
  let cursor = y

  for (const line of lines) {
    doc.text(line, x, cursor)
    cursor += height
  }

  return cursor
}

function drawImageInRect(
  doc: jsPDF,
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number,
): void {
  doc.addImage(dataUrl, 'JPEG', x, y, width, height, undefined, 'FAST')
}

export function drawAllFooters(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages()

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    setRgb(doc, PDF_BRAND.muted)
    doc.text(pdfText(PDF.TITLE), PDF.MARGIN, PDF.FOOTER_Y)
    doc.text(`${page} / ${pageCount}`, PDF.PAGE_WIDTH - PDF.MARGIN, PDF.FOOTER_Y, {
      align: 'right',
    })
    setDrawRgb(doc, PDF_BRAND.panelBorder)
    doc.setLineWidth(0.2)
    doc.line(PDF.MARGIN, PDF.FOOTER_Y - 4, PDF.PAGE_WIDTH - PDF.MARGIN, PDF.FOOTER_Y - 4)
  }
}

export function drawCoverPage(
  ctx: PdfContext,
  options: {
    dateRange: { start: string; end: string } | null
    statsLine: string
    filterLabel?: string | null
    heroImage: string | null
  },
): void {
  const { doc } = ctx
  const heroHeight = 90
  const heroWidth = PDF.PAGE_WIDTH - PDF.MARGIN * 2

  if (options.heroImage) {
    drawImageInRect(doc, options.heroImage, PDF.MARGIN, PDF.MARGIN, heroWidth, heroHeight)
  } else {
    setFillRgb(doc, PDF_BRAND.ink)
    doc.rect(PDF.MARGIN, PDF.MARGIN, heroWidth, heroHeight, 'F')
  }

  const overlayHeight = 52
  const overlayY = PDF.MARGIN + heroHeight - overlayHeight
  setFillRgb(doc, [15, 23, 42])
  doc.setGState(doc.GState({ opacity: 0.72 }))
  doc.rect(PDF.MARGIN, overlayY, heroWidth, overlayHeight, 'F')
  doc.setGState(doc.GState({ opacity: 1 }))

  setFillRgb(doc, PDF_BRAND.emerald)
  doc.rect(PDF.MARGIN, overlayY, heroWidth, 1.2, 'F')

  let textY = overlayY + 14
  doc.setFontSize(FONT.COVER_TITLE)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.white)
  doc.text(pdfText(PDF.TITLE), PDF.MARGIN + 6, textY)

  textY += 10
  doc.setFontSize(FONT.COVER_SUB)
  doc.setFont('helvetica', 'normal')
  if (options.dateRange) {
    doc.text(
      pdfText(`${options.dateRange.start} — ${options.dateRange.end}`),
      PDF.MARGIN + 6,
      textY,
    )
    textY += 7
  }

  doc.setFontSize(10)
  doc.text(pdfText(options.statsLine), PDF.MARGIN + 6, textY)

  if (options.filterLabel) {
    textY += 6
    doc.setFontSize(9)
    doc.text(pdfText(`Showing: ${options.filterLabel}`), PDF.MARGIN + 6, textY)
  }

  ctx.y = PDF.MARGIN + heroHeight + 12
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.ink)
  doc.text('Itinerary Overview', PDF.MARGIN, ctx.y)
  ctx.y += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  setRgb(doc, PDF_BRAND.slate)
  const intro =
    'Your day-by-day travel plan with transport, accommodation, activities, and baggage details.'
  ctx.y = drawWrappedText(doc, intro, PDF.MARGIN, ctx.y, PDF.PAGE_WIDTH - PDF.MARGIN * 2, 10, {
    color: PDF_BRAND.slate,
  })
  ctx.y += 6
}

const PANEL_PADDING = 4
const LABEL_VALUE_GAP = 1.5

function panelLabelBaseline(panelTop: number): number {
  return panelTop + PANEL_PADDING + lineHeight(FONT.LABEL)
}

function panelValueBaseline(labelBaseline: number): number {
  return labelBaseline + lineHeight(FONT.LABEL) + LABEL_VALUE_GAP
}

function measurePanelHeight(doc: jsPDF, _label: string, value: string, width: number): number {
  const valueHeight = measureWrappedHeight(doc, value, width - PANEL_PADDING * 2, FONT.BODY)
  return (
    PANEL_PADDING +
    lineHeight(FONT.LABEL) +
    lineHeight(FONT.LABEL) +
    LABEL_VALUE_GAP +
    valueHeight +
    PANEL_PADDING
  )
}

function drawPanel(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
): number {
  const height = measurePanelHeight(doc, label, value, width)
  const labelBaseline = panelLabelBaseline(y)
  const valueBaseline = panelValueBaseline(labelBaseline)

  setFillRgb(doc, PDF_BRAND.panelBg)
  setDrawRgb(doc, PDF_BRAND.panelBorder)
  doc.setLineWidth(0.2)
  doc.roundedRect(x, y, width, height, 1.5, 1.5, 'FD')

  doc.setFontSize(FONT.LABEL)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.muted)
  doc.text(pdfText(label.toUpperCase()), x + PANEL_PADDING, labelBaseline)

  drawWrappedText(
    doc,
    value,
    x + PANEL_PADDING,
    valueBaseline,
    width - PANEL_PADDING * 2,
    FONT.BODY,
    { color: PDF_BRAND.slate },
  )

  return height
}

function parseTimelineLine(line: string): { timeLabel: string; text: string } {
  let { timeLabel, text } = splitItineraryLine(line)
  if (text.startsWith('-') || text.startsWith('•')) {
    text = text.substring(1).trim()
  }
  return { timeLabel, text }
}

function measureTimelineHeight(
  doc: jsPDF,
  itinerary: string,
  width: number,
  theme: PdfThemeColors,
): number {
  const lines = prepareItineraryLines(itinerary)

  if (lines.length === 0) return lineHeight(FONT.BODY) + 4

  let total = lineHeight(FONT.HEADER) + 4

  for (const line of lines) {
    const { timeLabel, text } = parseTimelineLine(line)

    if (timeLabel && text) total += lineHeight(7) + 2
    total += measureWrappedHeight(doc, text || line, width - 10, FONT.BODY) + 4
    void theme
  }

  return total
}

function drawTimeline(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  itinerary: string,
  theme: PdfThemeColors,
): number {
  const lines = prepareItineraryLines(itinerary)

  let cursor = y

  doc.setFontSize(FONT.HEADER)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.ink)
  doc.text('Itinerary', x, cursor)
  cursor += lineHeight(FONT.HEADER) + 3

  if (lines.length === 0) {
    doc.setFontSize(FONT.BODY)
    doc.setFont('helvetica', 'italic')
    setRgb(doc, PDF_BRAND.muted)
    doc.text('No detailed activities planned.', x, cursor)
    return cursor + lineHeight(FONT.BODY)
  }

  for (const line of lines) {
    const { timeLabel, text } = parseTimelineLine(line)
    const bodyText = text || line

    if (timeLabel && text) {
      const pillText = pdfText(timeLabel).toUpperCase()
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      const pillWidth = doc.getTextWidth(pillText) + 4
      setFillRgb(doc, PDF_BRAND.panelBg)
      setDrawRgb(doc, PDF_BRAND.panelBorder)
      doc.roundedRect(x, cursor - 3, pillWidth, 5, 1, 1, 'FD')
      setRgb(doc, PDF_BRAND.slate)
      doc.text(pillText, x + 2, cursor)
      cursor += 6
    }

    setFillRgb(doc, theme.dot)
    doc.circle(x + 2, cursor + 1.5, 1.2, 'F')

    cursor = drawWrappedText(doc, bodyText, x + 8, cursor + 1, width - 10, FONT.BODY, {
      color: PDF_BRAND.slate,
    })
    cursor += 3
  }

  return cursor
}

function measureBaggageHeight(doc: jsPDF, baggage: BaggageAllowance[], width: number): number {
  let total = lineHeight(FONT.HEADER) + 4
  for (const entry of baggage) {
    const text = [
      entry.airline,
      entry.checked ? `Checked: ${entry.checked}` : '',
      entry.carryOn ? `Carry-on: ${entry.carryOn}` : '',
    ]
      .filter(Boolean)
      .join(' · ')
    total += measureWrappedHeight(doc, text, width - 4, FONT.BODY) + 2
  }
  return total
}

function drawBaggage(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  baggage: BaggageAllowance[],
): number {
  let cursor = y
  doc.setFontSize(FONT.HEADER)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.ink)
  doc.text('Baggage', x, cursor)
  cursor += lineHeight(FONT.HEADER) + 3

  for (const entry of baggage) {
    const text = [
      entry.airline,
      entry.checked ? `Checked: ${entry.checked}` : '',
      entry.carryOn ? `Carry-on: ${entry.carryOn}` : '',
    ]
      .filter(Boolean)
      .join(' · ')
    cursor = drawWrappedText(doc, `• ${text}`, x + 2, cursor, width - 4, FONT.BODY, {
      color: PDF_BRAND.slate,
    })
    cursor += 2
  }

  return cursor
}

export function drawDayBlock(
  ctx: PdfContext,
  day: TripDay,
  dayIndex: number,
  featuredImage: string | null,
): void {
  const theme = getPdfTheme(day.location)
  const { doc } = ctx
  const contentWidth = PDF.PAGE_WIDTH - PDF.MARGIN * 2
  const timelineWidth = contentWidth - PDF.SIDEBAR_WIDTH - PDF.GUTTER
  const photoWidth = 45
  const photoHeight = 30
  const headerHeight = 34

  const sidebarPanels: Array<{ label: string; value: string }> = []
  if (day.flights?.trim()) sidebarPanels.push({ label: 'Transport', value: day.flights })
  if (day.accommodation?.trim()) sidebarPanels.push({ label: 'Stay', value: day.accommodation })
  if (day.cost?.trim()) sidebarPanels.push({ label: 'Cost', value: day.cost })
  if (day.notes?.trim()) sidebarPanels.push({ label: 'Notes', value: day.notes })

  let sidebarHeight = 0
  for (const panel of sidebarPanels) {
    sidebarHeight += measurePanelHeight(doc, panel.label, panel.value, PDF.SIDEBAR_WIDTH) + 3
  }

  const timelineHeight = day.itinerary?.trim()
    ? measureTimelineHeight(doc, day.itinerary, timelineWidth, theme)
    : lineHeight(FONT.BODY) + 8

  const baggageHeight =
    day.baggage && day.baggage.length > 0
      ? measureBaggageHeight(doc, day.baggage, contentWidth)
      : 0

  const bodyHeight = Math.max(sidebarHeight, timelineHeight) + baggageHeight + 6
  ensureSpace(ctx, headerHeight + bodyHeight)

  const blockStartY = ctx.y

  setFillRgb(doc, theme.accent)
  doc.circle(PDF.MARGIN + 6, blockStartY + 8, 6, 'F')
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.white)
  doc.text(String(dayIndex + 1), PDF.MARGIN + 6, blockStartY + 9.5, { align: 'center' })

  doc.setFontSize(FONT.HEADER)
  doc.setFont('helvetica', 'bold')
  setRgb(doc, PDF_BRAND.ink)
  doc.text(pdfText(day.date), PDF.MARGIN + 16, blockStartY + 7)

  const locationY = blockStartY + 14
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  const locationText = pdfText(day.location)
  const locationWidth = Math.min(doc.getTextWidth(locationText) + 8, contentWidth - photoWidth - 20)
  setFillRgb(doc, theme.badgeBg)
  setDrawRgb(doc, theme.badgeBg)
  doc.roundedRect(PDF.MARGIN + 16, locationY - 4, locationWidth, 7, 2, 2, 'F')
  setRgb(doc, theme.badgeText)
  doc.text(locationText, PDF.MARGIN + 20, locationY)

  if (featuredImage) {
    drawImageInRect(
      doc,
      featuredImage,
      PDF.PAGE_WIDTH - PDF.MARGIN - photoWidth,
      blockStartY,
      photoWidth,
      photoHeight,
    )
    setDrawRgb(doc, PDF_BRAND.panelBorder)
    doc.setLineWidth(0.3)
    doc.roundedRect(
      PDF.PAGE_WIDTH - PDF.MARGIN - photoWidth,
      blockStartY,
      photoWidth,
      photoHeight,
      2,
      2,
      'S',
    )
  }

  let sidebarY = blockStartY + headerHeight
  for (const panel of sidebarPanels) {
    const panelHeight = drawPanel(
      doc,
      PDF.MARGIN,
      sidebarY,
      PDF.SIDEBAR_WIDTH,
      panel.label,
      panel.value,
    )
    sidebarY += panelHeight + 3
  }

  const timelineX = PDF.MARGIN + PDF.SIDEBAR_WIDTH + PDF.GUTTER
  let timelineEndY = drawTimeline(
    doc,
    timelineX,
    blockStartY + headerHeight,
    timelineWidth,
    day.itinerary ?? '',
    theme,
  )

  let blockEndY = Math.max(sidebarY, timelineEndY)

  if (day.baggage && day.baggage.length > 0) {
    blockEndY = drawBaggage(doc, PDF.MARGIN, blockEndY + 4, contentWidth, day.baggage)
  }

  setDrawRgb(doc, PDF_BRAND.panelBorder)
  doc.setLineWidth(0.2)
  doc.line(PDF.MARGIN, blockEndY + 4, PDF.PAGE_WIDTH - PDF.MARGIN, blockEndY + 4)

  ctx.y = blockEndY + 10
}
