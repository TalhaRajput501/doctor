import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface ReceptionistSession {
  authenticated?: boolean;
}

function getSessionOptions(): SessionOptions {
  const password = process.env.RECEPTIONIST_SESSION_PASSWORD;
  if (!password || password.length < 32) {
    throw new Error("RECEPTIONIST_SESSION_PASSWORD must contain at least 32 characters");
  }

  return {
    cookieName: "receptionist_session",
    password,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // for 24 hours
    },
  };
}

export async function getReceptionistSession() {
  return getIronSession<ReceptionistSession>(await cookies(), getSessionOptions());
}