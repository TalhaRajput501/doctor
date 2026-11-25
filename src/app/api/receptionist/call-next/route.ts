import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { withQueueLock } from "@/lib/queue-lock";
import { Token } from "@/models/Token";

export async function POST() {
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

  await connectDB();
  const result = await withQueueLock(
    config.clinicId,
    config.visitDate,
    config.shift,
    async () => {
      const base = {
        clinicId: config.clinicId,
        visitDate: config.visitDate,
        shift: config.shift,
      };
      const servingCount = await Token.countDocuments({ ...base, status: "serving" });
      if (servingCount > 0) return { code: "ALREADY_SERVING" as const };

      const next = await Token.findOneAndUpdate(
        { ...base, status: "waiting" },
        { $set: { status: "serving", calledAt: new Date() } },
        { sort: { priority: -1, token: 1 }, new: true }
      ).select("token patientName relation source");

      return next
        ? { code: "CALLED" as const, token: next }
        : { code: "QUEUE_EMPTY" as const };
    }
  );

  if (!result.acquired) {
    return NextResponse.json({ ok: false, code: "QUEUE_BUSY" }, { status: 409 });
  }
  if (result.value?.code === "ALREADY_SERVING") {
    return NextResponse.json({ ok: false, code: "ALREADY_SERVING" }, { status: 409 });
  }
  if (result.value?.code === "QUEUE_EMPTY") {
    return NextResponse.json({ ok: true, queueEmpty: true });
  }

  return NextResponse.json({
    ok: true,
    now: {
      token: result.value?.token?.token,
      patientName: result.value?.token?.patientName,
    },
  });
}