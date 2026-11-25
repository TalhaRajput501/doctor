## 2026-11-23
## 2026-11-25
- Implemented receptionist login with encrypted `iron-session` cookies and server-only configuration.
- Built a responsive today's queue dashboard with queue counts, current patient, wait estimates, periodic refresh, walk-in registration, and explicit call-next/finish actions.
- Added session-protected queue APIs and serialized queue transitions shared with existing n8n call-next routes.
- Restored API-key protection on token-status and documented dashboard environment variables and architecture.
- Focused ESLint on dashboard, queue, and token-status files passes. Production build passes; Next reports `/dashboard` as partial prerender with dynamically streamed receptionist content. Full lint remains blocked by unrelated errors in `book-token`, homepage `About`, and shared DB files.
- Fresh verification on 2026-11-25: focused ESLint passed and `yarn build` passed. No live queue actions were run because the configured clinic database has not been confirmed as non-production.

## 2026-11-23
- Built the Trust Strip section below the hero.
- Added four factual columns for qualifications, experience, languages, and clinic location.
- Added shared trust content to `src/lib/content.ts` and composed `TrustStrip` in the home page.
- Verified no TypeScript/editor diagnostics in the changed files.
- Built the About and Services sections for build-order batch 2.
- Added concise doctor information and six service groups to shared content.
- Composed About and Services into the home page and verified no editor diagnostics in the changed files.
- Built ClinicInfo and Testimonials for build-order batch 3.
- Added factual clinic details, a Google Maps link, and placeholder-only testimonial slots without invented patient claims.
- Composed both sections into the homepage and verified no editor diagnostics in the changed files.
- Added shared `Container` and `Section` components and refactored existing homepage sections to use them.
- Updated the approved light-mode palette, Fraunces heading font, Noto Nastaliq Urdu font, and responsive typography scales.
- Rebuilt Header with the SB logo mark, patient navigation, mobile Sheet menu, and WhatsApp CTA.
- Rebuilt Hero with the requested Urdu line, WhatsApp and call actions, 4:5 portrait fallback, and conditional PMC badge.
- Added WhatsApp number, phone fields, portrait path, PMC field, reviews array, and `waLink(message)` to shared content.
- Rebuilt TrustStrip as a primary-tone credentials band with 2x2 mobile and 4/5-column lg layouts.
- Added conditional PMC registration to TrustStrip and lg-only vertical dividers.
- Rebuilt About with a two-column desktop layout, three approach points, and an accent callout.
- Rebuilt Services as six linked cards with the requested distinct icons and prefilled WhatsApp messages.
- Rebuilt ClinicInfo with 5/12 details and 7/12 embedded Google Maps, plus Call, WhatsApp, and Directions actions.
- Added conditional clinic fee and explicit Sunday closure information.
- Fixed Testimonials to return null when reviews are empty and removed all placeholder content.
- Real review cards are limited to three and show ratings only when supplied.
- Built FAQ with five shared-content accordion items and explicit doctor-confirmation markers for unknown details.
- Built BookingCTA with name, phone, and concern fields that open a prefilled WhatsApp message.
- Built the three-column Footer with required medical-information disclaimer.
- Added the fixed mobile Call and WhatsApp action bar below md and matching main bottom padding.
- Composed all batch 4 sections into the homepage and marked build-order batch 4 complete.
