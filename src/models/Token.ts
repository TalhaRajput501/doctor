import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
  clinicId:    { type: Schema.Types.ObjectId, required: true },
  visitDate:   { type: String, required: true },        // day the patient will be SEEN, "2026-11-25" (PKT)
  shift:       { type: String, default: "evening" },
  token:       { type: Number, required: true },        // 1..N per clinic + visitDate + shift
  patientName: { type: String, required: true, trim: true },
  phone:       { type: String, default: "", index: true }, // digits only, e.g. 923001234567; walk-ins may be ""
  relation:    { type: String, enum: ["self","wife","mother","sister","daughter","other"], default: "self" },
  source:      { type: String, enum: ["walkIn","whatsapp"], required: true },
  status:      { type: String, enum: ["waiting","serving","completed","skipped","cancelled","no_show"], default: "waiting" },
  priority:    { type: Number, default: 0 },            // 1 = carried over from a previous day, called first
  carriedFromId: Schema.Types.ObjectId,
  idemKey:     { type: String, unique: true, sparse: true }, // WhatsApp message id of the confirm tap
  bookedAt:    { type: Date, default: Date.now },
  calledAt: Date,
  completedAt: Date,
});

// Two patients can never share a token number for the same clinic/day/shift.
TokenSchema.index({ clinicId: 1, visitDate: 1, shift: 1, token: 1 }, { unique: true });
// Fast queue reads for the board and the 3-ahead alert.
TokenSchema.index({ clinicId: 1, visitDate: 1, shift: 1, status: 1, priority: -1, token: 1 });

export const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);