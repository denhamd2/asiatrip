/**
 * Direct Gmail links for booking confirmation emails.
 *
 * How to add a link:
 * 1. Open the confirmation email in Gmail (web)
 * 2. Copy the URL from the address bar — it contains `#all/FMfcgz…` or `#inbox/FMfcgz…`
 * 3. Add an entry keyed by the label shown in the app (see scripts/list-booking-labels.mjs)
 *
 * You can paste the full URL or just the thread ID (FMfcgz… or API hex ID).
 * Unmapped bookings fall back to a targeted Gmail search.
 *
 * Tip: you can also paste a URL on a single itinerary row via the optional
 * "Gmail link" CSV column, or prefix notes with `Gmail: https://…`
 */
export const bookingEmailUrls: Record<string, string> = {
  // Add entries here, e.g.:
  // 'Marina Bay Sands': 'https://mail.google.com/mail/u/0/#all/FMfcgz…',
  // 'Flight QR948': 'https://mail.google.com/mail/u/0/#all/FMfcgz…',
  // 'Nora Buri': 'https://mail.google.com/mail/u/0/#all/FMfcgz…',
}
