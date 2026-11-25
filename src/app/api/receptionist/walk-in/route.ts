import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getReceptionistConfig } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { Clinic } from "@/models/Clininc";
import { Counter } from "@/models/Counter";
import { Token } from "@/models/Token";

const RELATIONS = ["self", "wife", "mother", "sister", "daughter", "other"];

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
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_JSON" }, { status: 400 });
  }

  const patientName = typeof body.patientName === "string" ? body.patientName.trim().slice(0, 60) : "";
  const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const relation = RELATIONS.includes(String(body.relation)) ? String(body.relation) : "self";

  if (!patientName) {
    return NextResponse.json({ ok: false, code: "BAD_NAME" }, { status: 400 });
  }
  if (phone && (phone.length < 10 || phone.length > 15)) {
    return NextResponse.json({ ok: false, code: "BAD_PHONE" }, { status: 400 });
  }

  await connectDB();
  const clinic = await Clinic.findById(config.clinicId)
    .select("isOpen offDates")
    .lean<{ isOpen: boolean; offDates: string[] }>();
  if (!clinic) {
    return NextResponse.json({ ok: false, code: "BAD_CLINIC" }, { status: 404 });
  }
  if (!clinic.isOpen || clinic.offDates?.includes(config.visitDate)) {
    return NextResponse.json({ ok: false, code: "CLINIC_CLOSED" }, { status: 409 });
  }

  const counterId = `${config.clinicId}:${config.visitDate}:${config.shift}`;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const counter = await Counter.findOneAndUpdate(
      { _id: counterId },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    try {
      const token = await Token.create({
        ...config,
        token: counter.seq,
        patientName,
        phone,
        relation,
        source: "walkIn",
      });

      return NextResponse.json(
        {
          ok: true,
          token: {
            id: String(token._id),
            number: token.token,
            patientName: token.patientName,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        continue;
      }
      throw error;
    }
  }

  return NextResponse.json({ ok: false, code: "TOKEN_CONFLICT" }, { status: 500 });
}