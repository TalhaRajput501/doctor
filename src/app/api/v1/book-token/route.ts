import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Token } from "@/models/Token";
import { Clinic } from "@/models/Clininc";
import { Counter } from "@/models/Counter";

const RELATIONS = ["self", "wife", "mother", "sister", "daughter", "other"];
const MAX_ACTIVE_PER_PHONE = 5; // per visit date + shift

// ---- Pakistan time helpers (no DST in PKT) ----
function pktDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" }); // YYYY-MM-DD
}
function pktHour() {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Asia/Karachi",
    }).format(new Date())
  );
}

// Business outcomes (full, closed, limit) return HTTP 200 with ok:false so n8n can branch on `code`.
// Real errors (bad auth, bad input, server) return 4xx/5xx.
const fail = (code: string, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, code, ...extra });
const bad = (code: string, status = 400) =>
  NextResponse.json({ ok: false, code }, { status });

async function nextSeq(clinicId: string, visitDate: string, shift: string) {
  const c = await Counter.findOneAndUpdate(
    { _id: `${clinicId}:${visitDate}:${shift}` },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return c.seq as number;
}

async function success(doc: any, avgConsultMin: number, extra: Record<string, unknown> = {}) {
  const base = { clinicId: doc.clinicId, visitDate: doc.visitDate, shift: doc.shift };
  // Queue order = priority desc, then token asc. Never compute "ahead" from token arithmetic.
  const ahead = await Token.countDocuments({
    ...base,
    status: "waiting",
    $or: [
      { priority: { $gt: doc.priority } },
      { priority: doc.priority, token: { $lt: doc.token } },
    ],
  });
  const serving = await Token.findOne({ ...base, status: "serving" }).select("token").lean<{ token: number }>();
  const isToday = doc.visitDate === pktDate(0);
  return NextResponse.json({
    ok: true,
    token: doc.token,
    visitDate: doc.visitDate,
    shift: doc.shift,
    patientName: doc.patientName,
    relation: doc.relation,
    aheadOfYou: ahead,
    nowServing: serving?.token ?? null,
    estimatedMinutes: isToday ? (ahead + (serving ? 1 : 0)) * avgConsultMin : null,
    ...extra,
  });
}

export async function POST(req: NextRequest) {
  // 1. Auth: only your n8n workflow (or your own board backend) may call this.
  if (req.headers.get("x-api-key") !== process.env.N8N_API_KEY) return bad("UNAUTHORIZED", 401);

  let body: any;
  try { body = await req.json(); } catch { return bad("BAD_JSON"); }

  // 2. Normalise + validate input.
  const clinicId = String(body.clinicId ?? "");
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const patientName = String(body.patientName ?? "").trim().slice(0, 60);
  const relation = RELATIONS.includes(body.relation) ? body.relation : "self";
  const source = body.source === "walkIn" ? "walkIn" : "whatsapp";
  const shift = String(body.shift ?? "evening");
  const idemKey = body.idemKey ? String(body.idemKey).slice(0, 100) : undefined;
  const today = pktDate(0);
  const tomorrow = pktDate(1);
  const visitDate = String(body.visitDate ?? today);

  if (!Types.ObjectId.isValid(clinicId)) return bad("BAD_CLINIC");
  if (!patientName) return bad("BAD_NAME");
  if (source === "whatsapp" && (phone.length < 10 || phone.length > 15)) return bad("BAD_PHONE");
  if (![today, tomorrow].includes(visitDate)) return bad("BAD_DATE");

  await connectDB();

  // 3. Idempotency: same confirm tap twice (Meta retry, double tap) returns the same token.
  if (idemKey) {
    const existing = await Token.findOne({ idemKey });
    if (existing) {
      const c = await Clinic.findById(existing.clinicId).select("avgConsultMin").lean<any>();
      return success(existing, c?.avgConsultMin ?? 6, { duplicate: true });
    }
  }

  // 4. Clinic rules.
  const clinic = await Clinic.findById(clinicId).lean<any>();
  if (!clinic) return bad("BAD_CLINIC", 404);
  if (!clinic.isOpen) return fail("BOOKING_DISABLED");
  if (clinic.offDates?.includes(visitDate)) {
    return fail("CLINIC_OFF", { visitDate, suggestDate: visitDate === today ? tomorrow : null });
  }

  // Receptionist walk-ins bypass the cutoff and the cap; WhatsApp bookings obey them.
  if (source === "whatsapp") {
    if (visitDate === today && pktHour() >= clinic.cutoffHour) {
      return fail("SHIFT_CLOSED", { suggestDate: tomorrow });
    }

    // Same person already booked for this day? Return the existing token, don't issue another.
    const dup = await Token.findOne({
      clinicId, visitDate, shift, phone, patientName, status: { $in: ["waiting", "serving"] },
    });
    if (dup) return success(dup, clinic.avgConsultMin, { alreadyBooked: true });

    const mine = await Token.countDocuments({
      clinicId, visitDate, shift, phone, status: { $in: ["waiting", "serving"] },
    });
    if (mine >= MAX_ACTIVE_PER_PHONE) return fail("LIMIT");

    // Cancelled tokens free capacity. (Small race: two simultaneous bookings at cap-1 can overshoot by one.)
    const used = await Token.countDocuments({ clinicId, visitDate, shift, status: { $ne: "cancelled" } });
    if (used >= clinic.maxTokens) {
      return fail("SHIFT_FULL", { suggestDate: visitDate === today ? tomorrow : null });
    }
  }

  // 5. Issue the token. The atomic counter makes clashes essentially impossible;
  //    the unique index is the safety net, so retry a couple of times on a clash.
  for (let attempt = 0; attempt < 3; attempt++) {
    const seq = await nextSeq(clinicId, visitDate, shift);
    try {
      const doc = await Token.create({
        clinicId, visitDate, shift, token: seq,
        patientName, phone, relation, source, idemKey,
      });
      return success(doc, clinic.avgConsultMin);
    } catch (e: any) {
      if (e?.code === 11000) {
        if (e.keyPattern?.idemKey) {
          // Lost a race with an identical request: return the winner.
          const winner = await Token.findOne({ idemKey });
          if (winner) return success(winner, clinic.avgConsultMin, { duplicate: true });
        }
        continue; // token-number clash: take the next number
      }
      throw e;
    }
  }
  return bad("TOKEN_CONFLICT", 500);
}