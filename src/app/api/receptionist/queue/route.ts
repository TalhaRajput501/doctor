import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { Clinic } from "@/models/Clininc";
import { Token } from "@/models/Token";

interface QueueTokenRecord {
  _id: Types.ObjectId;
  token: number;
  patientName: string;
  relation: string;
  source: "walkIn" | "whatsapp";
  priority: number;
  calledAt?: Date;
}

export async function GET() {
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

  await connectDB();
  const clinic = await Clinic.findById(config.clinicId)
    .select("doctorName avgConsultMin isOpen")
    .lean<{ doctorName: string; avgConsultMin: number; isOpen: boolean }>();

  if (!clinic) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 404 });
  }

  const base = {
    clinicId: config.clinicId,
    visitDate: config.visitDate,
    shift: config.shift,
  };
  const [waiting, serving, completedCount] = await Promise.all([
    Token.find({ ...base, status: "waiting" })
      .select("_id token patientName relation source priority bookedAt")
      .sort({ priority: -1, token: 1 })
      .lean<QueueTokenRecord[]>(),
    Token.find({ ...base, status: "serving" })
      .select("_id token patientName relation source calledAt")
      .sort({ calledAt: 1 })
      .lean<QueueTokenRecord[]>(),
    Token.countDocuments({ ...base, status: "completed" }),
  ]);

  const activePatient = serving.length === 1 ? serving[0] : null;
  const averageMinutes = clinic.avgConsultMin || 6;

  return NextResponse.json(
    {
      ok: true,
      clinic: { doctorName: clinic.doctorName, isOpen: clinic.isOpen },
      visitDate: config.visitDate,
      shift: config.shift,
      averageMinutes,
      waiting: waiting.map((token, index) => ({
        id: String(token._id),
        token: token.token,
        patientName: token.patientName,
        relation: token.relation,
        source: token.source,
        priority: token.priority,
        ahead: index + (activePatient ? 1 : 0),
        estimatedMinutes: (index + (activePatient ? 1 : 0)) * averageMinutes,
      })),
      serving: activePatient
        ? {
            id: String(activePatient._id),
            token: activePatient.token,
            patientName: activePatient.patientName,
            relation: activePatient.relation,
            source: activePatient.source,
            calledAt: activePatient.calledAt,
          }
        : null,
      servingCount: serving.length,
      waitingCount: waiting.length,
      completedCount,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}