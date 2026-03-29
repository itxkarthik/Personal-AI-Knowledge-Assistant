"use client";

import { motion } from "motion/react";

interface OverviewHeroProps {
	noteCount: number;
	documentCount: number;
	quickActionCount: number;
}

export function OverviewHero({
	noteCount,
	documentCount,
	quickActionCount,
}: OverviewHeroProps) {
	const summaryCards = [
		{ label: "Total Notes", value: noteCount },
		{ label: "Total Documents", value: documentCount },
		{ label: "Quick Actions", value: quickActionCount },
	];

	return (
		<motion.section
			className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur"
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			<p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Overview</p>
			<h1 className="mt-2 text-2xl font-semibold text-zinc-100">Your Knowledge Hub</h1>
			<p className="mt-2 max-w-2xl text-zinc-300">
				Keep everything in one place: notes, documents, and AI conversations.
			</p>

			<div className="mt-5 grid gap-3 sm:grid-cols-3">
				{summaryCards.map((card) => (
					<div
						key={card.label}
						className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4"
					>
						<p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
							{card.label}
						</p>
						<p className="mt-2 text-2xl font-semibold text-zinc-100">{card.value}</p>
					</div>
				))}
			</div>
		</motion.section>
	);
}
