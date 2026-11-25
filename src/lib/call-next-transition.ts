import { Types } from "mongoose";
import { Token } from "@/models/Token";
import { withQueueLock } from "@/lib/queue-lock";

const DOUBLE_TAP_MS = 3000;

export async function callNextLegacy(
  clinicId: string,
  visitDate: string,
  shift: string
) {
  return withQueueLock(clinicId, visitDate, shift, async () => {
    const base = { clinicId, visitDate, shift };
    const serving = await Token.find({ ...base, status: "serving" })
      .select("_id calledAt")
      .lean<{ _id: Types.ObjectId; calledAt?: Date }[]>();

    if (serving.length > 1) return { code: "QUEUE_INCONSISTENT" as const };
    if (serving[0]?.calledAt && Date.now() - serving[0].calledAt.getTime() < DOUBLE_TAP_MS) {
      return { code: "TOO_FAST" as const };
    }

    let servedJustNow = 0;
    if (serving[0]) {
      const completed = await Token.updateOne(
        { ...base, _id: serving[0]._id, status: "serving" },
        { $set: { status: "completed", completedAt: new Date() } }
      );
      servedJustNow = completed.modifiedCount;
    }

    const next = await Token.findOneAndUpdate(
      { ...base, status: "waiting" },
      { $set: { status: "serving", calledAt: new Date() } },
      { sort: { priority: -1, token: 1 }, new: true }
    );
    const waitingLeft = await Token.countDocuments({ ...base, status: "waiting" });

    return {
      code: "OK" as const,
      next,
      servedJustNow,
      waitingLeft,
      queueEmpty: !next,
    };
  });
}