"use client";

import { Loader2, Square } from "lucide-react";

interface StreamingIndicatorProps {
	isStreaming: boolean;
	tokenCount: number;
	onCancel?: () => void;
}

/**
 * Streaming indicator component with real-time token counter
 *
 * Features:
 * - Loading animation while streaming
 * - Real-time token count display
 * - Cancel button to abort streaming
 * - Mobile responsive design
 */
export function StreamingIndicator({
	isStreaming,
	tokenCount,
	onCancel,
}: StreamingIndicatorProps) {
	if (!isStreaming && tokenCount === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm">
			{isStreaming ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin text-blue-400" />
					<span className="text-zinc-300">Streaming response...</span>
					<span className="ml-auto font-mono text-blue-400">{tokenCount} tokens</span>
					{onCancel && (
						<button
							onClick={onCancel}
							className="ml-2 rounded p-1 hover:bg-zinc-800 transition-colors"
							title="Cancel streaming"
							type="button"
						>
							<Square className="h-4 w-4 fill-current text-red-400" />
						</button>
					)}
				</>
			) : (
				<>
					<span className="text-zinc-400">Completed</span>
					<span className="ml-auto font-mono text-green-400">{tokenCount} tokens</span>
				</>
			)}
		</div>
	);
}
