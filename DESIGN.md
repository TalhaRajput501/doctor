# DESIGN.md

Single source of truth for look and feel. Edit tokens here and in globals.css, never in components.

## Goal
Portfolio site for a female gynecologist in Multan, Pakistan. It must make a first-time patient trust her within 5 seconds and book in one tap. Audience: women (and families) in Multan, mostly on mobile, often on slow data. Mood: calm, warm, professional, modest. Not a hospital brochure, not a fertility-startup landing page.

## Palette (semantic tokens only)
| Token | Hex | Use |
|---|---|---|
| background | #F7FAF9 | page and default surfaces |
| foreground | #12302F | text; no pure black |
| primary | #14595A | header, buttons, dark sections |
| primary-foreground | #FFFFFF | text on primary |
| secondary and muted | #E6F0EE | soft section backgrounds and neutral surfaces |
| muted-foreground | #4F6866 | secondary text; AA contrast on light surfaces |
| accent | #F3DDD3 | warm blush highlights |
| accent-foreground | #5A2E1F | text on accent |
| border | #D5E3E0 | dividers and card borders |
| whatsapp | #1A9E4F | WhatsApp actions only |
| whatsapp-foreground | #FFFFFF | text on WhatsApp actions |

Rule: max 1 dark teal section per 2 light ones. Alternate background / secondary / primary to create rhythm.

## Type
- Headings: Fraunces through `--font-heading` and `font-heading`; use it for h1/h2/h3 only.
- Body/UI: Geist Sans preset through `--font-geist-sans`; minimum body size is 16px.
- Urdu: Noto Nastaliq Urdu through `--font-urdu`, `font-urdu`, and `leading-loose` with `dir="rtl"`.
- Scale: h1 36px/60px, h2 30px/36px, h3 20px; headings use font-semibold, leading-tight, and tracking-tight. Lead text is 18px/1.7. Secondary text is 15px/1.7. Eyebrow text is 12–13px.
- Shared layout: `Container` sets `mx-auto w-full max-w-6xl px-5 sm:px-8`; `Section` adds `py-16 md:py-24` and owns section tone.

## Shape and feel
- Radius: cards 1rem, images 1.25rem, buttons fully pill. Set once as `--radius: 0.45rem`.
  Scale: --radius-sm: calc(var(--radius) * 0.6); --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius); --radius-xl: calc(var(--radius) * 1.4); etc.
- Shadows: very soft only. Lots of whitespace. Thin 1px borders over heavy shadows.
- Motion: subtle fade/slide on scroll, nothing looping, respect reduced motion.
- Icons: lucide-react, one stroke weight.

## Imagery
- One good portrait of the doctor in the hero (face visible, warm smile, professional dress). Real clinic photos if available.
- Modest and non-clinical: no explicit body or pregnancy-belly stock shots, no scans/medical equipment close-ups. Use soft teal/blush shapes as decoration.
- Compress everything (WebP, next/image, lazy load). Target under 1.5 MB first load.

## Sections (each its own file in components/features/home/, one default page composing them)
1. **Header**: logo/name, 4 anchor links, sticky "Book on WhatsApp" button. Mobile: bottom-fixed Call + WhatsApp bar.
2. **Hero**: name, specialty line, one-sentence promise, 2 CTAs (Book Appointment, WhatsApp), portrait.
3. **TrustStrip**: PMDC/PMC verified, qualifications (e.g. MBBS, FCPS), years of experience, languages (Urdu, Punjabi, English). Facts only.
4. **About**: short bio, approach to care, female-only staff/privacy line if true.
5. **Services**: max 6 cards, only what she really offers (antenatal care and delivery, PCOS and menstrual problems, infertility consultation, family planning, gynae surgery, menopause). Each links to WhatsApp with a prefilled message.
6. **ClinicInfo** (important for Multan): hospital/clinic name, address, map link, days and timings, fee in Rs., video consultation if offered.
7. **Testimonials**: 3 short real reviews with first name and area, plus rating. No fake reviews.
8. **FAQ**: 5 questions (first visit, fee, privacy, what to bring, online consultation). Accordion.
9. **BookingCTA**: dark teal section, short form (name, phone, concern) that opens WhatsApp with the message filled, plus phone number.
10. **Footer**: address, timings, phone, WhatsApp, copyright.

## Do not include
Pricing plans, team grid (solo doctor), blog, case studies, pregnancy-rate charts, stats counters with invented numbers, sliders/carousels, before/after, any success-rate or guarantee claims.

## Rules for the agent
- Functional components, one per file, typed props, named exports, page stays thin.
- Mobile-first; design at 375px, then scale up.
- Placeholder content is clearly marked `[Doctor Name]`, `[Clinic Address]` and never invented credentials.
- Urdu support: build with text in a single `content.ts` so an Urdu version can be added later without touching components.
- The skill's "bold/distinctive" push is limited here: stay within this palette, type and tone. Distinctiveness comes from layout and photography, not from loud colors or fonts.