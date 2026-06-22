#!/usr/bin/env node
/**
 * Print every booking link label the app generates — use these as keys in
 * src/data/bookingEmails.ts when pasting Gmail thread URLs.
 *
 * Run: npx tsx scripts/list-booking-labels.mjs
 */
import { defaultTripData } from '../src/data/tripData.ts'
import { getBookingLinksForDay } from '../src/utils/bookings.ts'

const labels = new Map()

for (const day of defaultTripData) {
  for (const link of getBookingLinksForDay(day)) {
    const existing = labels.get(link.label)
    if (existing) {
      if (!existing.dates.includes(day.date)) existing.dates.push(day.date)
    } else {
      labels.set(link.label, { category: link.category, dates: [day.date] })
    }
  }
}

console.log('Add these labels to src/data/bookingEmails.ts:\n')
for (const [label, { category, dates }] of [...labels.entries()].sort()) {
  console.log(`  '${label.replace(/'/g, "\\'")}': '', // ${category}, ${dates.join(', ')}`)
}
