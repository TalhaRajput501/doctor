import { connection } from "next/server";
import { getReceptionistConfig, isReceptionistAuthConfigured } from "@/lib/receptionist-config";
import { getReceptionistSession } from "@/lib/receptionist-session";
import { ReceptionistDashboard } from "@/components/features/dashboard/ReceptionistDashboard";
import { ReceptionistLogin } from "@/components/features/dashboard/ReceptionistLogin";

export async function ReceptionistGate() {
  await connection();

  if (!isReceptionistAuthConfigured()) {
    return <ReceptionistLogin configured={false} />;
  }

  const session = await getReceptionistSession();
  if (!session.authenticated) {
    return <ReceptionistLogin configured />;
  }

  return <ReceptionistDashboard clinicConfigured={Boolean(getReceptionistConfig())} />;
}