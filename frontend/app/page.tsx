"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui";
import { Loader2 } from "lucide-react";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, hasHydrated } = useAuthStore();

	useEffect(() => {
		if (hasHydrated) {
			if (isAuthenticated) {
				router.push("/dashboard");
			} else {
				router.push("/auth/login");
			}
		}
	}, [hasHydrated, isAuthenticated, router]);

	// Show loading state while checking authentication
	return (
		<div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(192,193,255,0.14),transparent_32%),linear-gradient(180deg,#141414_0%,#101010_100%)] px-4">
			<Card className="w-full max-w-sm border-white/10 bg-[#171717]/90 shadow-2xl">
				<CardContent className="flex flex-col items-center justify-center gap-4 py-10">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/6 text-[#bcff5f]">
						<Loader2 className="h-6 w-6 animate-spin" />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium text-white">Loading workspace</p>
						<p className="mt-1 text-sm text-white/55">Preparing your dashboard and session state.</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
