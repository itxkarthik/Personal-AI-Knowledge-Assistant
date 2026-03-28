"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/lib/hooks/useAuth";

export function Header() {
	const router = useRouter();
	const { user, logout } = useAuth();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const initials =
		user?.full_name
			?.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ?? "U";

	return (
		<header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
			<div className="flex h-16 items-center justify-between px-4 sm:px-6">
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<p className="text-sm text-zinc-400">Welcome back</p>
					<h2 className="text-base font-semibold text-zinc-100">
						{user?.full_name ?? user?.email ?? "Knowledge Assistant"}
					</h2>
				</motion.div>

				<div className="flex items-center gap-3">
					<button
						type="button"
						className="rounded-lg border border-zinc-700 p-2 text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
						aria-label="Notifications"
					>
						<Bell className="h-4 w-4" />
					</button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button
								type="button"
								className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-zinc-100 transition hover:border-zinc-500"
							>
								<Avatar.Root className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
									<Avatar.Fallback className="text-xs font-semibold text-zinc-100">
										{initials}
									</Avatar.Fallback>
								</Avatar.Root>
								<ChevronDown className="h-4 w-4 text-zinc-400" />
							</button>
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content
								sideOffset={10}
								className="z-50 min-w-48 rounded-xl border border-zinc-700 bg-zinc-900 p-1 text-zinc-100 shadow-2xl"
							>
								<DropdownMenu.Item
									onClick={() => router.push("/dashboard/settings")}
									className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none transition hover:bg-zinc-800"
								>
									<User className="h-4 w-4" />
									Profile
								</DropdownMenu.Item>
								<DropdownMenu.Separator className="my-1 h-px bg-zinc-700" />
								<DropdownMenu.Item
									onClick={async () => {
										if (isLoggingOut) {
											return;
										}
										setIsLoggingOut(true);
										try {
											await logout();
											router.replace("/auth/login");
										} finally {
											setIsLoggingOut(false);
										}
									}}
									className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 outline-none transition hover:bg-red-500/10"
								>
									<LogOut className="h-4 w-4" />
									{isLoggingOut ? "Logging out..." : "Logout"}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</div>
			</div>
		</header>
	);
}
