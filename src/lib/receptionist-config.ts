import { Types } from "mongoose";
import { pktDate } from "@/lib/pkt";

export function getReceptionistConfig() {
  const clinicId = process.env.RECEPTIONIST_CLINIC_ID ?? "";
  const shift = process.env.RECEPTIONIST_SHIFT ?? "evening";

  if (
    !Types.ObjectId.isValid(clinicId) ||
    !/^[a-zA-Z0-9_-]{1,32}$/.test(shift)
  ) {
    return null;
  }

  return { clinicId, shift, visitDate: pktDate(0) };
}

export function isReceptionistAuthConfigured() {
  const password = process.env.RECEPTIONIST_SESSION_PASSWORD;
  return Boolean(
    process.env.RECEPTIONIST_PASSWORD && password && password.length >= 32
  );
}