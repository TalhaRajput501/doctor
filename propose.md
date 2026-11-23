# Functional Requirements Document (FRD)
**Project Name:** ClinicFlow AI — WhatsApp Booking & Clinic Automation System  
**Target Market:** Private Gynecology & IVF Clinics (Multan, Pakistan)  
**Version:** 1.0 (Unified Next.js + Node.js/Express + MongoDB Stack)  
**Date:** November 2026  

---

## 1. Executive Summary & Scope
**ClinicFlow AI** is a multi-tenant SaaS application designed to automate front-desk patient inquiries, appointment scheduling, queue delay broadcasts, and Google review generation via WhatsApp, paired with a mobile-first web dashboard for clinic receptionists and doctors.

Built entirely on a unified **TypeScript / JavaScript stack (Next.js, Node.js/Express, MongoDB)**, the system eliminates repetitive patient calls and WhatsApp messages regarding clinic timings, fees, and locations while preventing double-bookings and waiting room congestion.

---

## 2. System Architecture & Tech Stack
* **Frontend & Admin Dashboard:** Next.js (App Router, TypeScript, Tailwind CSS, Shadcn/UI)
* **Backend & Webhook Engine:** Node.js with Express.js (or Next.js API Route Handlers) in TypeScript
* **Database & ODM:** MongoDB Atlas with Mongoose ODM
* **LLM Integration:** OpenAI Chat Completions API (`gpt-4o-mini` with Structured Outputs & Tool/Function Calling)
* **Messaging Channel:** Official Meta WhatsApp Cloud API (Webhooks + Interactive Buttons/Lists + Approved Utility Templates)
* **Background Jobs & Scheduling:** `node-cron` or BullMQ (Redis/Upstash) for 24-hour/2-hour reminders, slot lock expiration, and post-visit review triggers
* **Authentication:** NextAuth.js (Auth.js) or JWT-based role authentication for clinic staff

### Architecture Decision: Context Injection vs. RAG
* **MVP (v1.0) — Structured Context Injection + Function Calling:** Do **not** build a vector RAG pipeline for the MVP. Each clinic's structured data (fees, OPD hours, services, doctor bio, Google Maps coordinates) fits cleanly inside ~1,000 tokens in the system prompt. Combining direct context injection with OpenAI Tool Calling (`checkAvailableSlots`, `createBooking`, `cancelBooking`) guarantees **<2.5s response latency** and **zero hallucination** on critical facts like consultation fees.
* **Future (v2.0) — MongoDB Atlas Vector Search:** Introduce RAG only when onboarding large multi-specialty hospitals with 50+ doctors, detailed IVF procedure brochures, or extensive FAQ documents.

---

## 3. User Roles & Permissions
| Role | Interface | Capabilities |
| :--- | :--- | :--- |
| **Patient** | WhatsApp Mobile App | Ask clinic FAQs (English/Roman Urdu), check real-time slot availability, book/reschedule/cancel appointments, receive delay alerts, submit post-visit feedback. |
| **Receptionist** | Next.js Web Dashboard (Mobile/Tablet) | View today's live schedule, add walk-in patients, update patient status (`Arrived`, `Completed`, `No-Show`), trigger one-click delay broadcasts, take over flagged human-handoff chats. |
| **Clinic Admin (Doctor)** | Next.js Web Dashboard | Configure clinic profile, consultation fees, OPD schedule, slot capacities, leave days, view booking analytics, and receive private alerts for low patient ratings. |

---

## 4. Functional Requirements

### Module A: WhatsApp Webhook & Bilingual AI Assistant
* **FR-A1 (Meta Webhook Security & Ingestion):** Expose `GET /api/webhook/whatsapp` (hub challenge verification) and `POST /api/webhook/whatsapp` (HMAC-SHA256 `X-Hub-Signature-256` payload verification). Acknowledge events with `200 OK` immediately and process asynchronously.
* **FR-A2 (Bilingual Understanding):** Detect and respond naturally in **English** or **Roman Urdu** (e.g., *"Doctor Sahiba aaj kis time baithengi?"*, *"Ultrasound ki fees kya hai?"*) matching the user's language and polite tone.
* **FR-A3 (Automated FAQ & Location Pin):** Answer routine queries from the clinic's MongoDB profile (fees, follow-up validity days, timings, services). Whenever location/address is requested, automatically dispatch a native **WhatsApp Location Message** (`latitude`, `longitude`, clinic name, address).
* **FR-A4 (Clinical Safety Guardrails):** Strictly prohibit the AI from diagnosing symptoms, recommending medicines, or interpreting ultrasound/lab reports. If red-flag emergency symptoms are mentioned (e.g., heavy bleeding, severe abdominal pain, labor pains), immediately advise visiting the nearest hospital emergency department or calling the clinic's emergency line.
* **FR-A5 (Human Handoff):** If a user requests a human receptionist or asks complex billing/surgery package questions, set `session.mode = "HUMAN_HANDOFF"`, pause AI auto-replies, and highlight the conversation on the receptionist dashboard.

### Module B: Interactive Appointment Booking Engine
* **FR-B1 (Interactive UI Elements):** Use **WhatsApp Interactive Reply Buttons** (up to 3 options) and **WhatsApp List Messages** (up to 10 rows) for selecting dates, time windows/tokens, and visit types—minimizing free-text typing errors.
* **FR-B2 (Real-Time Slot Generation):** Dynamically calculate open slots for the next 7 days based on the clinic's `schedule` configuration minus existing `Booked`/`Confirmed` appointments and blocked holiday dates.
* **FR-B3 (Atomic Slot Locking):** When a patient selects a slot, create a temporary `PENDING` hold with a **3-minute TTL** (`expiresAt` index in MongoDB) to prevent race conditions and double-booking during confirmation.
* **FR-B4 (Patient Data Capture & Token Generation):** Collect Patient Name and Visit Type (*New Consultation* vs. *Follow-Up*). Auto-capture phone number from WhatsApp `wa_id`. Upon confirmation, generate a sequential daily **Token Number** (e.g., `T-14`) and send a formatted confirmation summary.
* **FR-B5 (Self-Service Reschedule & Cancel):** Allow patients to tap *"Manage Appointment"* to view upcoming bookings and cancel or reschedule at least 2 hours prior to the slot time, immediately releasing the slot back to inventory.

### Module C: Automated Notifications & Queue Management
* **FR-C1 (Scheduled Reminders):** Background cron worker checks upcoming appointments every 15 minutes and dispatches approved Meta Utility Templates:
  * **24 Hours Prior:** Reminder with interactive *"Confirm Visit"* and *"Cancel"* buttons.
  * **2 Hours Prior:** Final reminder including Token Number and clinic Google Maps pin.
* **FR-C2 (One-Click Delay Broadcast):** Receptionist can select `+30 mins`, `+45 mins`, or `+60 mins` delay on the dashboard when the doctor is held up in surgery/delivery, triggering a bulk WhatsApp notification to all remaining `Booked`/`Confirmed` patients for that date.
* **FR-C3 (Post-Visit Google Review Funnel):** 3 hours after an appointment is marked `COMPLETED`, send an interactive feedback prompt (*1 to 5 Stars*):
  * **4 or 5 Stars:** Reply thanking the patient and sharing the direct **Google Business Profile Review URL**.
  * **1 to 3 Stars:** Apologize empathetically, do **not** send the public Google link, and trigger an internal alert to the Doctor/Admin dashboard for service recovery.

### Module D: Receptionist & Admin Web Dashboard (Next.js)
* **FR-D1 (Live Daily Queue Board):** Real-time dashboard displaying today's appointments sorted by Token Number with one-tap status transitions (`Booked` -> `Arrived` -> `Completed` / `No-Show`).
* **FR-D2 (Walk-In Registration):** Quick-add modal allowing receptionists to register walk-in patients so online WhatsApp slot counts stay synchronized in real time.
* **FR-D3 (Clinic Settings Management):** Form interface for doctors/admins to edit consultation fees, follow-up window (e.g., free within 7 days), daily OPD shifts (Morning/Evening), max patients per hour, and off-days.

---

## 5. MongoDB Data Models (Mongoose Schemas)

### 5.1 `Clinic` Collection
```typescript
{
  _id: ObjectId,
  name: String,                  // e.g., "Multan Women's & IVF Clinic"
  doctorName: String,            // e.g., "Dr. Ayesha Khan"
  whatsappPhoneNumberId: String, // Meta Cloud API Phone Number ID (indexed, unique)
  whatsappAccessToken: String,   // Encrypted token
  address: String,
  location: { lat: Number, lng: Number },
  googleReviewUrl: String,
  consultationFee: Number,       // e.g., 2500 (PKR)
  followUpFee: Number,           // e.g., 1000 (PKR)
  followUpValidDays: Number,     // e.g., 7
  services: [String],
  weeklySchedule: [{
    dayOfWeek: Number,           // 0 (Sun) - 6 (Sat)
    isOpen: Boolean,
    shifts: [{
      startTime: String,         // "17:00"
      endTime: String,           // "21:00"
      slotDurationMins: Number,  // 15
      maxPatientsPerSlot: Number // 1
    }]
  }],
  blockedDates: [Date],
  createdAt: Date
}
```

### 5.2 `Appointment` Collection
```typescript
{
  _id: ObjectId,
  clinicId: ObjectId,            // Ref: Clinic (compound index with date)
  patientPhone: String,          // e.g., "923001234567"
  patientName: String,
  visitType: { type: String, enum: ["NEW", "FOLLOW_UP"] },
  source: { type: String, enum: ["WHATSAPP_AI", "WALK_IN"] },
  appointmentDate: String,       // "YYYY-MM-DD"
  timeSlot: String,              // "18:30"
  tokenNumber: Number,           // Sequential daily token
  status: { 
    type: String, 
    enum: ["PENDING_LOCK", "BOOKED", "CONFIRMED", "ARRIVED", "COMPLETED", "CANCELLED", "NO_SHOW"] 
  },
  lockExpiresAt: Date,           // MongoDB TTL index for unconfirmed holds
  reminder24hSent: Boolean,
  reminder2hSent: Boolean,
  reviewRequestSent: Boolean,
  feedbackRating: Number,        // 1-5
  createdAt: Date
}
```

### 5.3 `ChatSession` Collection
```typescript
{
  _id: ObjectId,
  clinicId: ObjectId,
  patientPhone: String,
  mode: { type: String, enum: ["AI_ACTIVE", "HUMAN_HANDOFF"] },
  languagePreference: { type: String, enum: ["EN", "ROMAN_URDU"] },
  messages: [{
    role: { type: String, enum: ["user", "assistant", "system"] },
    content: String,
    timestamp: Date
  }],
  lastInteractionAt: Date
}
```

---

## 6. Core API Endpoints (Next.js / Express)
* `GET /api/webhook/whatsapp` — Meta webhook verification handshake.
* `POST /api/webhook/whatsapp` — Incoming WhatsApp messages, button clicks, and list selections.
* `GET /api/clinics/:id/appointments?date=YYYY-MM-DD` — Fetch daily schedule for receptionist dashboard.
* `POST /api/clinics/:id/appointments/walk-in` — Create walk-in appointment and assign next token.
* `PATCH /api/appointments/:id/status` — Update status (`ARRIVED`, `COMPLETED`, `CANCELLED`).
* `POST /api/clinics/:id/broadcast-delay` — Send delay notification to remaining scheduled patients.
* `PUT /api/clinics/:id/settings` — Update clinic timings, fees, and blocked dates.

---

## 7. Non-Functional Requirements
* **Latency:** Webhook-to-WhatsApp reply latency must remain under **3 seconds** (p95).
* **Multi-Tenancy:** Every database query must strictly filter by `clinicId` derived from the incoming `whatsappPhoneNumberId`, enabling a single deployment to serve dozens of Multan clinics.
* **Mobile-First Responsive UI:** Dashboard must be fully usable on 6-inch Android smartphones and 10-inch tablets with large touch targets (`>= 44px`) for busy front-desk staff.
* **Compliance & Security:** Use official Meta WhatsApp Cloud API only; encrypt stored patient identifiers and API credentials at rest.

---

## 8. Out of Scope (MVP v1.0)
* Online payment gateways (JazzCash/Easypaisa) — *clinics collect cash at the reception counter.*
* Electronic Medical Records (EMR) or digital prescription generation.
* WhatsApp voice-note transcription (planned for v2.0 using OpenAI Whisper API).