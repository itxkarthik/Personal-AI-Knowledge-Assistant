import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardRootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<DashboardLayout>
			<div className="w-full">{children}</div>
		</DashboardLayout>
	);
}
