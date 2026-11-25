import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { Clinic } from "@/models/Clininc";

export async function PATCH(req: NextRequest) {
  const session = await getReceptionistSession();
  if (!session.authenticated) {
    return NextResponse.json({ ok: false, code: "UNAUTHORIZED" }, { status: 401 });
  }

  const config = getReceptionistConfig();
  if (!config) {
    return NextResponse.json(
      { ok: false, code: "RECEPTIONIST_CLINIC_NOT_CONFIGURED" },
      { status: 503 }
    );
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

  const hasIsOpen = Object.prototype.hasOwnProperty.call(body, "isOpen");
  const hasCutoffHour = Object.prototype.hasOwnProperty.call(body, "cutoffHour");
  if (!hasIsOpen && !hasCutoffHour) {
    return NextResponse.json({ ok: false, code: "EMPTY_UPDATE" }, { status: 400 });
  }
  if (hasIsOpen && typeof body.isOpen !== "boolean") {
    return NextResponse.json({ ok: false, code: "BAD_IS_OPEN" }, { status: 400 });
  }
  if (
    hasCutoffHour &&
    (typeof body.cutoffHour !== "number" ||
      !Number.isInteger(body.cutoffHour) ||
      body.cutoffHour < 0 ||
      body.cutoffHour > 23)
  ) {
    return NextResponse.json({ ok: false, code: "BAD_CUTOFF_HOUR" }, { status: 400 });
  }

  const update: { isOpen?: boolean; cutoffHour?: number } = {};
  if (hasIsOpen) update.isOpen = body.isOpen as boolean;
  if (hasCutoffHour) update.cutoffHour = body.cutoffHour as number;

  await connectDB();
  const clinic = await Clinic.findByIdAndUpdate(
    config.clinicId,
    { $set: update },
    { returnDocument: "after" }
  )
    .select("isOpen cutoffHour")
    .lean<{ isOpen: boolean; cutoffHour?: number } | null>();

  if (!clinic) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 404 });
  }

  return NextResponse.json(
    {
      ok: true,
      isOpen: clinic.isOpen,
      cutoffHour: clinic.cutoffHour ?? 21,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}