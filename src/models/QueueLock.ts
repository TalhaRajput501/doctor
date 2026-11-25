import mongoose, { Schema } from "mongoose";

const QueueLockSchema = new Schema(
  {
    _id: { type: String, required: true },
    lockToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

export const QueueLock =
  mongoose.models.QueueLock || mongoose.model("QueueLock", QueueLockSchema);