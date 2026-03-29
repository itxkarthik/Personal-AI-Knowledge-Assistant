"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { formatBytes, formatDate } from "@/components/features/dashboard/utils";
import type { DocumentResponse } from "@/types";

interface RecentDocumentsPanelProps {
	documents: DocumentResponse[];
	isLoading: boolean;
	errorMessage: string | null;
}

export function RecentDocumentsPanel({
	documents,
	isLoading,
	errorMessage,
}: RecentDocumentsPanelProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 18 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 }}
			className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5"
		>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
						Recent Documents
					</p>
					<h3 className="mt-1 text-lg font-medium text-zinc-100">Latest uploaded docs</h3>
				</div>
				<Link href="/dashboard/documents" className="text-sm text-zinc-300 hover:text-zinc-100">
					View all
				</Link>
			</div>

			{isLoading ? (
				<ul className="space-y-3">
					{Array.from({ length: 3 }).map((_, idx) => (
						<li key={idx} className="rounded-xl border border-zinc-800 p-3">
							<div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
							<div className="mt-2 h-3 w-full animate-pulse rounded bg-zinc-800" />
						</li>
					))}
				</ul>
			) : errorMessage ? (
				<p className="rounded-xl border border-rose-800/70 bg-rose-950/40 p-3 text-sm text-rose-200">
					{errorMessage}
				</p>
			) : documents.length === 0 ? (
				<p className="rounded-xl border border-zinc-800 p-3 text-sm text-zinc-300">
					No documents yet. Upload your first document to build context.
				</p>
			) : (
				<ul className="space-y-3">
					{documents.map((document) => (
						<li key={document.id}>
							<Link
								href={`/dashboard/documents/${document.id}`}
								className="block rounded-xl border border-zinc-800 p-3 transition hover:border-zinc-700 hover:bg-zinc-950/70"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="line-clamp-1 font-medium text-zinc-100">
										{document.title}
									</p>
									<span className="shrink-0 text-xs text-zinc-400">
										{formatDate(document.updated_at)}
									</span>
								</div>
								<p className="mt-1 text-sm text-zinc-300">
									{document.file_type.toUpperCase()} - {formatBytes(document.file_size)}
								</p>
							</Link>
						</li>
					))}
				</ul>
			)}
		</motion.div>
	);
}
