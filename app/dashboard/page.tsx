"use client";

import { ArrowUpRight, Brain, FileText, FolderKanban, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const cards = [
	{
		title: "Notes",
		description: "Capture ideas, summaries, and linked insights.",
		href: "/dashboard/notes",
		icon: FileText,
	},
	{
		title: "Documents",
		description: "Ingest PDFs and text sources for retrieval.",
		href: "/dashboard/documents",
		icon: FolderKanban,
	},
	{
		title: "Chat",
		description: "Ask questions and convert insights into notes.",
		href: "/dashboard/chat",
		icon: MessageSquare,
	},
	{
		title: "Knowledge Graph",
		description: "Visualize relationships across your knowledge base.",
		href: "/dashboard/knowledge-graph",
		icon: Brain,
	},
];

export default function DashboardPage() {
	return (
		<div className="space-y-6">
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
			</motion.section>

			<section className="grid gap-4 sm:grid-cols-2">
				{cards.map((card, idx) => (
					<motion.div
						key={card.title}
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.06 }}
					>
						<Link
							href={card.href}
							className="block rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur transition hover:border-zinc-600 hover:bg-zinc-900"
						>
							<div className="flex items-start justify-between">
								<card.icon className="h-5 w-5 text-zinc-100" />
								<ArrowUpRight className="h-4 w-4 text-zinc-400" />
							</div>
							<h2 className="mt-4 text-lg font-medium text-zinc-100">{card.title}</h2>
							<p className="mt-1 text-sm text-zinc-300">{card.description}</p>
						</Link>
					</motion.div>
				))}
			</section>
		</div>
	);
}
