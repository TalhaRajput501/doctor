# Memory
## Current status
All four build-order batches are complete. The homepage includes Header, Hero, TrustStrip, About, Services, ClinicInfo, conditional Testimonials, FAQ, BookingCTA, Footer, and the mobile action bar.
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
## Next steps
Review final page, add real portrait and confirmed clinic data, and replace placeholder contact details if needed.