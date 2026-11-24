import { connectDB } from "@/lib/db";
import { Clinic } from "@/models/Clininc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    if (req.headers.get("x-api-key") !== process.env.N8N_API_KEY) {
      return NextResponse.json(
        { ok: false, code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }
    const sp = req.nextUrl.searchParams;
    const clinicId = String(sp.get("clinicId") ?? "");
    await connectDB();
    const clinic = await Clinic.findOne({
      _id: clinicId || "6b05800b10ca7e39a14a458a",
    });
    return NextResponse.json(clinic);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        code: error instanceof Error ? error.message : "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

// const newClinic = new Clinic({
//   doctorName: "Dr. Shafqat Batool",
//   address: "Medical & Surgical Complex, Dera Ghazi Khan",
//   isOpen: true,
//   offDates: ["2026-11-29"],
//   maxTokens: 24,
//   cutoffHour: 21,
//   avgConsultMin: 10,
//   additionalInfo:
//     "Consultant Gynecologist, Obstetrician & Infertility Specialist (MBBS, FCPS). Hours: Mon–Sat, 5:00 PM – 9:00 PM. Languages: Urdu, English, Saraiki/Punjabi. On-site lab, ECG, ultrasound, and pharmacy available.",
// });
// await newClinic.save();
