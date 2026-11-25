# Architecture

## Build order
- [x] 1. Header + Hero (done)
- [x] 2. TrustStrip + About + Services (done)
- [x] 3. ClinicInfo + Testimonials (done)
- [x] 4. FAQ + BookingCTA + Footer (done)

## Stack
- Next.js App Router, TypeScript, Tailwind, shadcn/ui
- `components.json` preset is final — palette, fonts, and radius are fixed

## Folder Structure
- `components/features/dashboard/` — receptionist login and queue interface
- `models/` — Mongoose models, including queue transition locks


## Home Sections (each its own file in `components/features/home/`)
1. Header: logo/name, anchor links, sticky "Book on WhatsApp" button. Mobile: bottom-fixed Call + WhatsApp bar.
2. Hero: name, specialty line, one-sentence promise, 2 CTAs (Book Appointment, WhatsApp), portrait.
3. TrustStrip: PMDC/PMC verified, qualifications (MBBS, FCPS), years of experience, languages (Urdu, Punjabi, English). Facts only.
4. About: short bio, approach to care, female-only staff/privacy line if true.
5. Services: max 6 cards, only real offerings. Each links to WhatsApp with prefilled message.
6. ClinicInfo: hospital/clinic name, address, map link, days and timings, fee in Rs., video consultation if offered.
7. Testimonials: 3 short real reviews with first name and area, plus rating. No fake reviews.
8. FAQ: 5 questions (first visit, fee, privacy, what to bring, online consultation). Accordion.
9. BookingCTA: dark teal section, short form (name, phone, concern) that opens WhatsApp with the message filled, plus phone number.
- `/dashboard` checks an encrypted `iron-session` cookie before rendering queue controls.
- `/api/receptionist/*` is the browser-facing, session-protected API; it reads clinic configuration and the session secret only on the server.
- `PATCH /api/dashboard/clinic-settings` uses the same receptionist session to update clinic-wide `isOpen` and validated PKT `cutoffHour`; no n8n API key is sent to the browser.
- Queue GET returns persisted booking state plus current PKT hour so the receptionist can see when WhatsApp cutoff has passed.
- `POST /api/receptionist/token-action` applies skip, priority, cancel, and re-queue transitions under the queue lock; re-queue preserves the existing token number.
- The protected queue response contains receptionist contact details and today's skipped/completed history. `/api/v1/token-status` returns completed/skipped/cancelled state and computes wait position from waiting tokens only.
- Queue actions and both n8n `call-next` routes use the same expiring MongoDB queue lock.
- The dashboard is scoped by `RECEPTIONIST_CLINIC_ID` and `RECEPTIONIST_SHIFT` environment variables.
- Never expose `N8N_API_KEY`. Patient phone numbers are returned only by the session-protected receptionist queue for staff contact.
10. Footer: address, timings, phone, WhatsApp, copyright.

## Key Directories
- `lib/content.ts` — holds all text and doctor details with clearly marked placeholders like `[Doctor Name]`
- `types/` — doctor-related types, section props

## Design Constraints (from DESIGN.md and AGENTS.md)
- Semantic tokens only from globals.css — no hardcoded colors, fonts, or radii in components
- lucide-react icons only
- Mobile-first; design at 375px, then scale up
- No hardcoded colors, fonts, or radii in components. Use semantic tokens from globals.css.
- Placeholder content clearly marked `[Doctor Name]`, `[Clinic Address]` and never invented credentials.
- Urdu support: build with text in a single `content.ts` so an Urdu version can be added later without touching components.
- The shadcn preset in components.json is final. Never change the palette, fonts, or radius unless explicitly asked.
- Add components via `npx shadcn@latest add <name>` so they inherit the preset.

## Doctor Data (from AGENTS.md)
- Name: Dr. Shafqat Batool
- Specialty: Consultant Gynecologist, Obstetrician, and Infertility Specialist
- Experience: 12+ years
- Qualifications: MBBS, FCPS (Gynecology & Obstetrics)
- Languages: Urdu, English, Saraiki, Punjabi
- Clinic: Medical & Surgical Complex, Dera Ghazi Khan
- Serving areas: Pul Daat, Model Town, Jampur Road, Shadan Lound
- Hours: Mon-Sat, 5:00 PM – 9:00 PM
- Services: Obstetrics & Maternity, Fertility & Hormonal Care, Gynecology & Diagnostics