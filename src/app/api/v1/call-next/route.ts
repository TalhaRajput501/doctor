/**
 * ROUTE:      POST /api/call-next
 * FILE:       app/api/call-next/route.ts
 * CALLED BY:  the receptionist's "Call Next" button (server-side), or curl/Postman while testing.
 *
 * WHAT IT DOES (one tap):
 *   1. Marks the patient currently being seen as "completed" (= served).
 *   2. Takes the next waiting patient (carried-over first, then lowest token) and marks them "serving".
 *   3. Returns that patient's name and token so the receptionist can call them in by name.
 *
 * SENDS NO WHATSAPP MESSAGES. No alerts, no "3 ahead" trigger. The receptionist just calls the name.
 *
 * LAST PATIENT: when the final patient is done, tap Call Next once more. It marks them served
 * and returns { queueEmpty: true }.
 *
 * BODY (JSON): { "clinicId": "<clinic _id>", "shift": "evening" }   (shift is optional)
 * HEADER:      x-api-key: <N8N_API_KEY>
 */
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Token } from "@/models/Token";
import { pktDate } from "@/lib/pkt";

// A second tap right after the first would skip a patient who was only just called in.
const DOUBLE_TAP_MS = 3000;

export async function POST(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.N8N_API_KEY) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const clinicId = String(body.clinicId ?? "");
  const shift = String(body.shift ?? "evening");
  if (!Types.ObjectId.isValid(clinicId)) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 400 });
  }

  await connectDB();
  const base = { clinicId, visitDate: pktDate(0), shift };

  const current = await Token.findOne({ ...base, status: "serving" });
  if (current?.calledAt && Date.now() - current.calledAt.getTime() < DOUBLE_TAP_MS) {
    return NextResponse.json({ ok: false, code: "TOO_FAST" });
  }

  // 1. Whoever was being seen is now served.
  const done = await Token.updateMany(
    { ...base, status: "serving" },
    { $set: { status: "completed", completedAt: new Date() } }
  );

  // 2. Atomically take the next waiting patient (two taps can never pick the same person).
  const next = await Token.findOneAndUpdate(
    { ...base, status: "waiting" },
    { $set: { status: "serving", calledAt: new Date() } },
    { sort: { priority: -1, token: 1 }, new: true }
  );

  const waitingLeft = await Token.countDocuments({ ...base, status: "waiting" });

  if (!next) {
    return NextResponse.json({
      ok: true, queueEmpty: true, servedJustNow: done.modifiedCount, waitingLeft: 0,
    });
  }

  return NextResponse.json({
    ok: true,
    queueEmpty: false,
    now: {
      token: next.token,
      patientName: next.patientName,
      relation: next.relation,
      source: next.source,
      phone: next.phone,
    },
    servedJustNow: done.modifiedCount,
    waitingLeft,
  });
}