import mongoose, { Schema } from "mongoose";

const ClinicSchema = new Schema({
  doctorName: { type: String, required: true },
  address: String,
  isOpen: { type: Boolean, default: true },          // master switch for bookings
  offDates: { type: [String], default: [] },         // ["2026-11-27"] in PKT
  maxTokens: { type: Number, default: 40 },          // per shift per day
  cutoffHour: { type: Number, default: 21 },         // WhatsApp same-day booking closes at 9 PM PKT
  avgConsultMin: { type: Number, default: 6 },
});

export const Clinic =
  mongoose.models.Clinic || mongoose.model("Clinic", ClinicSchema);