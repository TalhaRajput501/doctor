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
import { pktDate } from "@/lib/pkt";
import { callNextLegacy } from "@/lib/call-next-transition";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.N8N_API_KEY) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ ok: false, code: "BAD_JSON" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_JSON" }, { status: 400 });
  }
  const clinicId = typeof body.clinicId === "string" ? body.clinicId : "";
  const shift = typeof body.shift === "string" ? body.shift : "evening";
  if (!Types.ObjectId.isValid(clinicId)) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9_-]{1,32}$/.test(shift)) {
    return NextResponse.json({ ok: false, code: "BAD_SHIFT" }, { status: 400 });
  }

  await connectDB();
  const result = await callNextLegacy(clinicId, pktDate(0), shift);
  if (!result.acquired) {
    return NextResponse.json({ ok: false, code: "QUEUE_BUSY" }, { status: 409 });
  }
  if (result.value?.code === "TOO_FAST") {
    return NextResponse.json({ ok: false, code: "TOO_FAST" }, { status: 409 });
  }
  if (result.value?.code === "QUEUE_INCONSISTENT") {
    return NextResponse.json({ ok: false, code: "QUEUE_INCONSISTENT" }, { status: 409 });
  }

  if (!result.value || result.value.queueEmpty) {
    return NextResponse.json({
      ok: true,
      queueEmpty: true,
      servedJustNow: result.value?.servedJustNow ?? 0,
      waitingLeft: 0,
    });
  }

  return NextResponse.json({
    ok: true,
    queueEmpty: false,
    now: {
      token: result.value.next?.token,
      patientName: result.value.next?.patientName,
      relation: result.value.next?.relation,
      source: result.value.next?.source,
      phone: result.value.next?.phone,
    },
    servedJustNow: result.value.servedJustNow,
    waitingLeft: result.value.waitingLeft,
  });
}