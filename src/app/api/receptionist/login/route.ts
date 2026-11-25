import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { isReceptionistAuthConfigured } from "@/lib/receptionist-config";

export async function POST(req: NextRequest) {
  if (!isReceptionistAuthConfigured()) {
    return NextResponse.json(
      { ok: false, code: "RECEPTIONIST_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, code: "BAD_JSON" }, { status: 400 });
  }

  const expected = Buffer.from(process.env.RECEPTIONIST_PASSWORD ?? "");
  const supplied = Buffer.from(password);
  const valid =
    supplied.length === expected.length && timingSafeEqual(supplied, expected);

  if (!valid) {
    return NextResponse.json(
      { ok: false, code: "INVALID_PASSWORD" },
      { status: 401 }
    );
  }

  const session = await getReceptionistSession();
  session.authenticated = true;
  await session.save();

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}