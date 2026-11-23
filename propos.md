# Functional Requirements Document (FRD)
**Project Name:** ClinicFlow AI — SEO Clinic Website, WhatsApp Receptionist & Live Token System  
**Target Market:** Private Gynecology & Specialty Clinics (Multan, DG Khan & South Punjab, Pakistan)  
**Version:** 1.2 (Unified Next.js + MongoDB + Official WhatsApp Cloud API)  
**Date:** November 21, 2026  

---

## 1. Executive Summary & Scope
**ClinicFlow AI** is an all-in-one digital clinic platform built specifically for private specialists in South Punjab. It combines three high-ROI components into a single system:
1. **A Fast, Local-SEO Public Website** (`drname.com`) that ranks on Google for local specialty searches and displays live clinic availability.
2. **A Bilingual + Voice-Note WhatsApp Receptionist** (English & Roman Urdu) that answers routine FAQs, issues sequential OPD tokens for physical visits, alerts waiting patients as the queue moves, and immediately hands off medical symptoms or lab reports to human staff.
3. **A 1-Tap Live Token Board** for clinic receptionists/compounders that replaces paper registers and eliminates waiting-room crowd chaos.

---

## 2. User Roles & Permissions

| Role | Interface | Capabilities |
| :--- | :--- | :--- |
| **Patient / Attendant** | Public Website + WhatsApp (Text & Voice Notes) | View live clinic status and services on the web, tap WhatsApp CTAs, ask FAQs in English/Roman Urdu, book/cancel OPD tokens for self or family members, receive live queue alerts, and send lab reports to staff. |
| **Receptionist / Compounder** | Next.js Mobile/Tablet Board | Tap **"Call Next Token"** as patients enter, register walk-in patients, broadcast doctor delay alerts (`+30m`/`+60m`), reply to escalated `HUMAN_HANDOFF` chats, and resume AI automation. |
| **Doctor (Clinic Admin)** | Next.js Web Dashboard | Edit website bio and services, set OPD shift hours, max daily tokens, consultation/follow-up fees, off-days, and view daily OPD counts. |

---

## 3. Functional Requirements

### Module A: Public SEO Clinic Website & WhatsApp Funnel (Next.js SSR)
* **FR-A1 (Custom Domain & Slug Routing):** Serve each clinic's public website from the same deployment using host-header routing (`drname.com` or fallback slug `/dr-name`), pulling live profile, fees, and shift hours directly from the database.
* **FR-A2 (Local SEO & Google Search Optimization):**
  * Server-side rendered (SSR) dedicated service pages (e.g., `/services/antenatal-care`, `/services/infertility`, `/services/ultrasound`) with dynamic meta tags targeting city + specialty keywords (e.g., *"Best Gynecologist in Dera Ghazi Khan"*).
  * Inject `Physician` and `MedicalClinic` **JSON-LD Schema markup** plus an embedded Google Maps view to rank in Google Local Pack results.
* **FR-A3 (Live Queue Status Banner):** Display a real-time badge on the homepage reading *"Clinic Open Today (4:00 PM – 9:00 PM) • Currently Serving Token #12"*, giving patients confidence before traveling.
* **FR-A4 (WhatsApp-First CTA Deep Links — Zero Web Chat Bloat):**
  * Replace fragile web chat bubbles with high-converting **WhatsApp Deep-Link Buttons** (`https://wa.me<clinicNumber>?text=...`) pre-filled with patient intent:
    * Hero CTA: *"Book Physical OPD Token on WhatsApp"* -> pre-fills `"Assalam-o-Alaikum, mujhe aaj ka OPD token book karna hai"`
    * Sticky Mobile Bottom Bar: One-tap **[WhatsApp Token]** + **[Call Reception]** + **[Google Maps Pin]** buttons.
* **FR-A5 (Instant CMS Sync):** Any edits made by the doctor or staff in **Module E (`FR-E4`)**—such as holiday closures, updated fees, or shift timings—immediately reflect on the public website without code redeployment.

---

### Module B: Multimodal WhatsApp Assistant (Text + Voice + Media)
* **FR-B1 (Meta Webhook Ingestion & Security):** Expose webhook endpoints for hub verification and incoming message events with HMAC-SHA256 payload signature verification, acknowledging events with `200 OK` immediately.
* **FR-B2 (Voice Note & Bilingual Engine):**
  * Automatically download incoming WhatsApp voice notes (`audio/ogg`) via the Meta Graph API and transcribe them via OpenAI Whisper before passing the text to the AI assistant.
  * Detect and respond naturally in **Roman Urdu** or **English** matching the sender's language, strictly adhering to clean mobile WhatsApp formatting (`*single asterisks*` for bold, raw URLs, concise 3–4 line replies).
* **FR-B3 (Automated FAQ & Native Location Pin):** Answer routine queries (consultation fees, follow-up validity days, shift timings, services) from the clinic's profile. Whenever address or location is requested, automatically dispatch a native **WhatsApp Location Message** (`latitude`, `longitude`, clinic name, and address).
* **FR-B4 (Clinical Safety Guardrail & Mandatory HITL):**
  * Strictly prohibit the AI from diagnosing symptoms, recommending medicines, or interpreting lab/ultrasound images.
  * **Trigger `HUMAN_HANDOFF` immediately** whenever a user mentions *any* symptoms (pain, bleeding, high BP, fever), asks about medications, requests a human, or uploads an image/PDF (e.g., lab report).
  * Pause AI auto-replies for that session, alert the receptionist dashboard with an audio/visual badge, and provide the clinic's emergency phone number if urgent symptoms are detected.

---

### Module C: Family-Aware OPD Token Booking Engine
* **FR-C1 (Multi-Patient per WhatsApp Number):** Because husbands and attendants frequently book from their own phones in Pakistan, allow a single WhatsApp number to save multiple family member profiles (e.g., Self, Wife, Sister, Mother) and always confirm *who* the token is being booked for.
* **FR-C2 (Shift-Based Sequential Tokens):** Instead of rigid 15-minute slots that break down during emergency C-sections or deliveries, issue **Sequential Daily Tokens (`T-01`, `T-02`...)** per OPD shift (e.g., *Evening OPD: 4:00 PM – 9:00 PM*) up to the shift's daily token cap, showing an estimated arrival window based on average consultation duration.
* **FR-C3 (Atomic Token Generation):** Generate unique, sequential daily Token Numbers per clinic and date atomically so simultaneous WhatsApp bookings and walk-in registrations never produce duplicate tokens.
* **FR-C4 (Interactive Buttons & Self-Service Cancel):** Use WhatsApp Interactive Reply Buttons (`Book OPD Token`, `Live Token Status`, `Clinic Location`) and allow one-tap cancellation, immediately freeing shift capacity.

---

### Module D: Live Queue Intelligence & Delay Broadcasts
* **FR-D1 (Rolling "3-Tokens-Ahead" Alert):** When the receptionist taps **"Call Next Token"** on the dashboard (e.g., moving to `T-10`), automatically send a WhatsApp alert to `T-13`: *"Clinic Update: Abhi Token #10 chal raha hai. Aapka Token #13 hai—bara-e-meherbani 20 minute mein clinic tashreef le aayein."*
* **FR-D2 (One-Click Doctor Delay Broadcast):** When the doctor is delayed in surgery or delivery, allow the receptionist to tap `+30 mins` or `+60 mins` to notify all remaining `BOOKED` tokens for that day via an approved Meta Utility Template.
* **FR-D3 (2-Hour Pre-Turn Reminder):** Run a scheduled background check every 30 minutes to remind confirmed patients ~2 hours before their estimated turn, including their Token Number and native Google Maps location pin.

---

### Module E: Receptionist "1-Tap" Board & Doctor Admin Dashboard
* **FR-E1 (1-Tap Live Token Board):** Mobile/tablet-first screen built for a busy compounder or receptionist:
  * Large header displaying **Currently Serving (`T-10`)** alongside a prominent **[Call Next Token]** button.
  * Scrollable list of today's tokens with one-tap status transitions (`Booked` -> `Arrived` -> `Completed` / `Skipped`).
* **FR-E2 (10-Second Walk-In Entry):** Quick-add modal (Patient Name + optional Phone) to issue a walk-in token from the same sequential counter so WhatsApp and walk-in queues stay unified.
* **FR-E3 (Handoff Inbox & Bot Resume):** Dedicated tab showing conversations paused in `HUMAN_HANDOFF` mode (displaying voice transcripts and uploaded lab report images) with a **[Resume AI Bot]** button once staff resolves the inquiry.
* **FR-E4 (Clinic & Website Settings CMS):** Form interface for doctors/admins to update website bio, specialty services, consultation fees, follow-up validity days, daily OPD shifts, max tokens per shift, and off-dates.
