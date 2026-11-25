import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { withQueueLock } from "@/lib/queue-lock";
import { Token } from "@/models/Token";

export async function POST(req: NextRequest) {
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

  let tokenId = "";
  try {
    const body = await req.json();
    tokenId = typeof body.tokenId === "string" ? body.tokenId : "";
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_JSON" }, { status: 400 });
  }
  if (!Types.ObjectId.isValid(tokenId)) {
    return NextResponse.json({ ok: false, code: "BAD_TOKEN" }, { status: 400 });
  }

  await connectDB();
  const result = await withQueueLock(
    config.clinicId,
    config.visitDate,
    config.shift,
    async () => {
      const base = {
        _id: tokenId,
        clinicId: config.clinicId,
        visitDate: config.visitDate,
        shift: config.shift,
        status: "serving",
      };
      const servingCount = await Token.countDocuments({
        clinicId: config.clinicId,
        visitDate: config.visitDate,
        shift: config.shift,
        status: "serving",
      });
      if (servingCount !== 1) return { code: "QUEUE_INCONSISTENT" as const };

      const completed = await Token.findOneAndUpdate(
        base,
        { $set: { status: "completed", completedAt: new Date() } },
        { new: true }
      ).select("token");

      return completed
        ? { code: "COMPLETED" as const, token: completed.token }
        : { code: "STALE_TOKEN" as const };
    }
  );

  if (!result.acquired) {
    return NextResponse.json({ ok: false, code: "QUEUE_BUSY" }, { status: 409 });
  }
  if (result.value?.code === "QUEUE_INCONSISTENT") {
    return NextResponse.json({ ok: false, code: "QUEUE_INCONSISTENT" }, { status: 409 });
  }
  if (result.value?.code === "STALE_TOKEN") {
    return NextResponse.json({ ok: false, code: "STALE_TOKEN" }, { status: 409 });
  }

  return NextResponse.json({ ok: true, completedToken: result.value?.token });
}