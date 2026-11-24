import mongoose, { Schema } from "mongoose";

// One document per clinic + visit date + shift. _id = "clinicId:2026-11-25:evening"
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);