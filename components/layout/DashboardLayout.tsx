import type { ReactNode } from "react";

import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

interface DashboardLayoutProps {
	children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<ErrorBoundary>
			<AuthBootstrap />
			<div className="min-h-screen bg-zinc-950 text-zinc-100">
				<div className="absolute inset-0 -z-0 opacity-50">
					<div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent_45%)]" />
				</div>

				<div className="relative z-10 flex">
					<Sidebar />
					<div className="min-h-screen flex-1">
						<Header />
						<main className="p-4 sm:p-6">{children}</main>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
}
