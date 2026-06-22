export interface PdfThemeColors {
  accent: [number, number, number]
  badgeBg: [number, number, number]
  badgeText: [number, number, number]
  dot: [number, number, number]
}

const THEMES: Record<string, PdfThemeColors> = {
  Singapore: {
    accent: [14, 165, 233],
    badgeBg: [224, 242, 254],
    badgeText: [7, 89, 133],
    dot: [14, 165, 233],
  },
  'Koh Samui': {
    accent: [20, 184, 166],
    badgeBg: [204, 251, 241],
    badgeText: [17, 94, 89],
    dot: [20, 184, 166],
  },
  Bangkok: {
    accent: [245, 158, 11],
    badgeBg: [254, 243, 199],
    badgeText: [120, 53, 15],
    dot: [245, 158, 11],
  },
  'Bangkok → Da Nang': {
    accent: [139, 92, 246],
    badgeBg: [237, 233, 254],
    badgeText: [91, 33, 182],
    dot: [139, 92, 246],
  },
  'Da Nang': {
    accent: [99, 102, 241],
    badgeBg: [224, 231, 255],
    badgeText: [55, 48, 163],
    dot: [99, 102, 241],
  },
  'Hoi An': {
    accent: [234, 179, 8],
    badgeBg: [254, 249, 195],
    badgeText: [113, 63, 18],
    dot: [234, 179, 8],
  },
  Hanoi: {
    accent: [244, 63, 94],
    badgeBg: [255, 228, 230],
    badgeText: [159, 18, 57],
    dot: [244, 63, 94],
  },
  'Halong Bay': {
    accent: [6, 182, 212],
    badgeBg: [207, 250, 254],
    badgeText: [21, 94, 117],
    dot: [6, 182, 212],
  },
  'Ha Long Bay': {
    accent: [6, 182, 212],
    badgeBg: [207, 250, 254],
    badgeText: [21, 94, 117],
    dot: [6, 182, 212],
  },
  Transit: {
    accent: [100, 116, 139],
    badgeBg: [241, 245, 249],
    badgeText: [51, 65, 85],
    dot: [148, 163, 184],
  },
  'Hamad International Airport, Doha': {
    accent: [126, 34, 206],
    badgeBg: [243, 232, 255],
    badgeText: [88, 28, 135],
    dot: [126, 34, 206],
  },
  Doha: {
    accent: [126, 34, 206],
    badgeBg: [243, 232, 255],
    badgeText: [88, 28, 135],
    dot: [126, 34, 206],
  },
  Departure: {
    accent: [100, 116, 139],
    badgeBg: [241, 245, 249],
    badgeText: [51, 65, 85],
    dot: [148, 163, 184],
  },
  Dublin: {
    accent: [16, 185, 129],
    badgeBg: [209, 250, 229],
    badgeText: [6, 95, 70],
    dot: [16, 185, 129],
  },
}

const DEFAULT_THEME: PdfThemeColors = {
  accent: [100, 116, 139],
  badgeBg: [241, 245, 249],
  badgeText: [51, 65, 85],
  dot: [148, 163, 184],
}

export const PDF_BRAND = {
  emerald: [5, 150, 105] as [number, number, number],
  ink: [15, 23, 42] as [number, number, number],
  slate: [51, 65, 85] as [number, number, number],
  muted: [100, 116, 139] as [number, number, number],
  panelBg: [248, 250, 252] as [number, number, number],
  panelBorder: [226, 232, 240] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
}

export function getPdfTheme(location: string): PdfThemeColors {
  const normalized = location.split('→')[0].trim()
  return THEMES[location] ?? THEMES[normalized] ?? DEFAULT_THEME
}
