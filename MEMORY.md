# Memory
## Current status
Homepage build-order batches are complete. A receptionist dashboard MVP is implemented at `/dashboard`: session-protected sign-in, today's live queue, walk-in registration, separate call-next and finish actions, and 15-second refresh.
## Decisions
- TrustStrip uses a primary-tone 2x2 mobile band and 4-column/5-column desktop band, with thin lg-only dividers and conditional PMC registration.
- About uses two desktop columns, three icon-based approach points, and an accent callout.
- Services uses separate background cards in 1/2/3-column grids, distinct requested icons, and prefilled WhatsApp links.
- Header and Hero remain mobile-first with the SB mark, Sheet menu, Urdu line, call action, portrait fallback, and conditional PMC badge.
- ClinicInfo uses 5/12 details and 7/12 embedded Google Maps, with Call, WhatsApp, and Directions actions.
- Clinic fee renders only when `doctorContent.clinic.fee` exists; Sunday is explicitly shown as closed.
- Testimonials returns null when `doctorContent.testimonials.reviews` is empty, so placeholders and Reviews navigation are absent.
- Real reviews render up to three cards; star ratings appear only when rating data exists.
- FAQ uses shared content and explicitly marks uncertain privacy and online-consultation details for doctor confirmation.
- BookingCTA opens a prefilled WhatsApp message from the name, phone, and concern form; it has no backend.
- Footer uses the foreground/background dark treatment and includes the required medical disclaimer.
- Mobile action bar is fixed below md and the main page has matching bottom padding.
- Build order batches 1–4 are complete.
- Build order batches 1–4 are complete.
- Dashboard uses `iron-session`; `N8N_API_KEY` stays server-only. Configure `RECEPTIONIST_PASSWORD`, a 32+ character `RECEPTIONIST_SESSION_PASSWORD`, `RECEPTIONIST_CLINIC_ID`, and optional `RECEPTIONIST_SHIFT`.
- Dashboard data omits phone numbers. Queue transitions across dashboard and both n8n call-next routes share an expiring MongoDB lock. The old n8n route behavior remains finish-and-call-next; the dashboard uses separate actions.
- `/api/v1/token-status` again requires its documented `x-api-key` because it returns patient data.
- Dashboard exceptions use a protected `/api/receptionist/token-action` endpoint for skip, priority toggle, cancel, and re-queue, all under the clinic/shift queue lock. Re-queue changes only status, preserving token number. The protected queue response exposes phone to staff and includes skipped/completed history.
- WhatsApp token status includes waiting, serving, completed, skipped, and cancelled records; ahead/wait estimates count waiting records only.
- Dashboard booking controls use session-protected `PATCH /api/dashboard/clinic-settings`; valid `cutoffHour` values are integer PKT hours 0–23. The queue GET returns `isOpen`, `cutoffHour` (defaults to 21 for legacy clinic records), and current server PKT hour. “Close today’s WhatsApp now” sends the current hour; `book-token` already treats `pktHour() >= cutoffHour` as closed.
## Next steps
Run the new skip/priority/cancel/re-queue flows and booking pause/cutoff controls against a non-production clinic database. No authenticated clinic settings were changed during verification. No integration test runner is configured yet. Dashboard-focused ESLint, editor diagnostics, and `yarn build` pass; full-repo lint still reports existing errors in book-token, homepage About, and shared DB files.