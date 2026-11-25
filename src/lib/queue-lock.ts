import { randomUUID } from "node:crypto";
import { QueueLock } from "@/models/QueueLock";

const LOCK_LEASE_MS = 30_000;

export async function withQueueLock<T>(
  clinicId: string,
  visitDate: string,
  shift: string,
  operation: () => Promise<T>
): Promise<{ acquired: boolean; value?: T }> {
  const lockId = `${clinicId}:${visitDate}:${shift}`;
  const lockToken = randomUUID();
  const now = new Date();

  try {
    const lock = await QueueLock.findOneAndUpdate(
      {
        _id: lockId,
        $or: [{ expiresAt: { $lte: now } }, { expiresAt: { $exists: false } }],
      },
      {
        $set: {
          lockToken,
          expiresAt: new Date(now.getTime() + LOCK_LEASE_MS),
        },
      },
      { upsert: true, new: true }
    );

    if (lock.lockToken !== lockToken) return { acquired: false };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return { acquired: false };
    }
    throw error;
  }

  try {
    return { acquired: true, value: await operation() };
  } finally {
    await QueueLock.updateOne(
      { _id: lockId, lockToken },
      { $set: { expiresAt: new Date(0) } }
    );
  }
}