import { Suspense } from "react";
import { ReceptionistGate } from "@/components/features/dashboard/ReceptionistGate";

export default function DashboardPage() {
	return (
		<Suspense fallback={<main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Loading reception...</main>}>
			<ReceptionistGate />
		</Suspense>
	);
}
