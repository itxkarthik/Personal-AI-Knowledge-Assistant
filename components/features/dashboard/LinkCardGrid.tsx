"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import type { DashboardLinkItem } from "@/components/features/dashboard/types";

interface LinkCardGridProps {
	items: DashboardLinkItem[];
	gridClassName: string;
	titleClassName: string;
}

export function LinkCardGrid({
	items,
	gridClassName,
	titleClassName,
}: LinkCardGridProps) {
	return (
		<section className={gridClassName}>
			{items.map((item, idx) => (
				<motion.div
					key={item.title}
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.06 }}
				>
					<Link
						href={item.href}
						className="group block rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur transition hover:border-zinc-600 hover:bg-zinc-900"
					>
						<div className="flex items-start justify-between">
							<item.icon className="h-5 w-5 text-zinc-100" />
							<ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:text-zinc-200" />
						</div>
						<h2 className={`mt-4 font-medium text-zinc-100 ${titleClassName}`}>
							{item.title}
						</h2>
						<p className="mt-1 text-sm text-zinc-300">{item.description}</p>
					</Link>
				</motion.div>
			))}
		</section>
	);
}
