/**
 * ROUTE:      GET /api/token-status?clinicId=<id>&phone=<wa_id>
 * FILE:       app/api/token-status/route.ts
 * CALLED BY:  n8n, when the patient taps "Mera token status" on WhatsApp.
 *
 * WHAT IT DOES:
 *   Finds every token this phone number holds for today and tomorrow (family members
 *   booked from one phone each get their own entry) and returns, for each one:
 *   its status, how many patients are ahead, who is being seen now, and a rough wait.
 *
 * READ ONLY. Sends nothing, changes nothing. n8n builds the WhatsApp reply from the fields.
 *
 * `phone` must come from the WhatsApp trigger (contacts[0].wa_id), never from the AI agent.
 * HEADER: x-api-key: <N8N_API_KEY>
 *
 * RESPONSE:
 *   { ok: true, hasToken: false }
 *   { ok: true, hasToken: true, tokens: [{ token, patientName, relation, visitDate, isToday,
 *       status: "waiting"|"serving"|"completed"|"skipped",
 *       aheadOfYou: number|null,   // only while waiting
 *       nowServing: number|null,
 *       estimatedMinutes: number|null }] }
 */
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
 import { Token } from "@/models/Token";
import { Clinic } from "@/models/Clininc";
import { pktDate } from "@/lib/pkt";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-api-key") !== process.env.N8N_API_KEY) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const clinicId = String(sp.get("clinicId") ?? "");
  const phone = String(sp.get("phone") ?? "").replace(/\D/g, "");
  if (!Types.ObjectId.isValid(clinicId)) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 400 });
  }
  if (phone.length < 10 || phone.length > 15) {
    return NextResponse.json({ ok: false, code: "BAD_PHONE" }, { status: 400 });
  }

  await connectDB();
  const today = pktDate(0);
  const tomorrow = pktDate(1);

  const clinic = await Clinic.findById(clinicId).select("avgConsultMin").lean<any>();
  if (!clinic) return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 404 });

  const mine = await Token.find({
    clinicId,
    phone,
    visitDate: { $in: [today, tomorrow] },
    status: { $in: ["waiting", "serving", "completed", "skipped"] },
  })
    .sort({ visitDate: 1, token: 1 })
    .lean<any[]>();

  if (mine.length === 0) return NextResponse.json({ ok: true, hasToken: false });

  const tokens = await Promise.all(
    mine.map(async (t) => {
      const base = { clinicId, visitDate: t.visitDate, shift: t.shift };
      const serving = await Token.findOne({ ...base, status: "serving" })
        .select("token")
        .lean<{ token: number }>();

      let aheadOfYou: number | null = null;
      if (t.status === "waiting") {
        // Queue order = carried-over first, then lowest token.
        aheadOfYou = await Token.countDocuments({
          ...base,
          status: "waiting",
          $or: [
            { priority: { $gt: t.priority } },
            { priority: t.priority, token: { $lt: t.token } },
          ],
        });
      }

      const isToday = t.visitDate === today;
      return {
        token: t.token,
        patientName: t.patientName,
        relation: t.relation,
        visitDate: t.visitDate,
        isToday,
        status: t.status,
        aheadOfYou,
        nowServing: serving?.token ?? null,
        estimatedMinutes:
          isToday && aheadOfYou !== null
            ? (aheadOfYou + (serving ? 1 : 0)) * clinic.avgConsultMin
            : null,
      };
    })
  );

  return NextResponse.json({ ok: true, hasToken: true, tokens });
}