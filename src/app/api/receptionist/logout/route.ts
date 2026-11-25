import { NextResponse } from "next/server";
import { getReceptionistSession } from "@/lib/receptionist-session";

export async function POST() {
  const session = await getReceptionistSession();
  session.destroy();
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}