"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Brain,
	FileText,
	FolderKanban,
	Home,
	MessageSquare,
	Search,
	Settings,
} from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils/cn";

const navItems = [
	{ href: "/dashboard", label: "Overview", icon: Home },
	{ href: "/dashboard/notes", label: "Notes", icon: FileText },
	{ href: "/dashboard/documents", label: "Documents", icon: FolderKanban },
	{ href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
	{ href: "/dashboard/search", label: "Search", icon: Search },
	{ href: "/dashboard/knowledge-graph", label: "Knowledge Graph", icon: Brain },
	{ href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-zinc-800 bg-zinc-950/95 px-4 py-6 lg:block">
			<div className="mb-8 px-2">
				<p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Workspace</p>
				<h1 className="mt-2 text-xl font-semibold text-zinc-100">
					Personal Knowledge
				</h1>
			</div>

			<nav className="space-y-2">
				{navItems.map((item, idx) => {
					const isActive =
						pathname === item.href ||
						(item.href !== "/dashboard" && pathname.startsWith(item.href));

					return (
						<motion.div
							key={item.href}
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, ease: "easeOut", delay: idx * 0.04 }}
						>
							<Link
								href={item.href}
								className={cn(
									"group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
									isActive
										? "bg-zinc-100 text-zinc-900"
										: "text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
								)}
							>
								<item.icon className="h-4 w-4" />
								<span>{item.label}</span>
							</Link>
						</motion.div>
					);
				})}
			</nav>
		</aside>
	);
}
