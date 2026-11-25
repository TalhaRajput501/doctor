import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { withQueueLock } from "@/lib/queue-lock";
import { Token } from "@/models/Token";

const ACTIONS = ["skip", "priority", "cancel", "requeue"] as const;
type TokenAction = (typeof ACTIONS)[number];

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

  const tokenId = typeof body.tokenId === "string" ? body.tokenId : "";
  const action = body.action;
  if (!Types.ObjectId.isValid(tokenId)) {
    return NextResponse.json({ ok: false, code: "BAD_TOKEN" }, { status: 400 });
  }
  if (typeof action !== "string" || !ACTIONS.includes(action as TokenAction)) {
    return NextResponse.json({ ok: false, code: "BAD_ACTION" }, { status: 400 });
  }

  await connectDB();
  const result = await withQueueLock(
    config.clinicId,
    config.visitDate,
    config.shift,
    async () => {
      const base = {
        _id: new Types.ObjectId(tokenId),
        clinicId: config.clinicId,
        visitDate: config.visitDate,
        shift: config.shift,
      };

      if (action === "skip") {
        const servingCount = await Token.countDocuments({
          clinicId: config.clinicId,
          visitDate: config.visitDate,
          shift: config.shift,
          status: "serving",
        });
        if (servingCount > 1) return { code: "QUEUE_INCONSISTENT" as const };
        if (servingCount !== 1) return { code: "STALE_TOKEN" as const };

        const skipped = await Token.updateOne(
          { ...base, status: "serving" },
          { $set: { status: "skipped" } }
        );
        return skipped.modifiedCount === 1
          ? { code: "SKIPPED" as const }
          : { code: "STALE_TOKEN" as const };
      }

      if (action === "priority") {
        const current = await Token.findOne({ ...base, status: "waiting" })
          .select("priority")
          .lean<{ priority: number } | null>();
        if (!current) return { code: "STALE_TOKEN" as const };

        const priority = current.priority > 0 ? 0 : 1;
        const updated = await Token.updateOne(
          { ...base, status: "waiting", priority: current.priority },
          { $set: { priority } }
        );
        return updated.modifiedCount === 1
          ? { code: "PRIORITY_UPDATED" as const, priority }
          : { code: "STALE_TOKEN" as const };
      }

      const expectedStatus = action === "cancel" ? "waiting" : "skipped";
      const nextStatus = action === "cancel" ? "cancelled" : "waiting";
      const updated = await Token.updateOne(
        { ...base, status: expectedStatus },
        { $set: { status: nextStatus } }
      );
      if (updated.modifiedCount !== 1) return { code: "STALE_TOKEN" as const };

      return action === "cancel"
        ? { code: "CANCELLED" as const }
        : { code: "REQUEUED" as const };
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

  return NextResponse.json({
    ok: true,
    action: result.value?.code,
    priority: result.value?.code === "PRIORITY_UPDATED" ? result.value.priority : undefined,
  });
}
