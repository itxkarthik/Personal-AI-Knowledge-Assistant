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
		<div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-sm">
			{isStreaming ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
					<span className="text-muted-foreground">Streaming response...</span>
					<span className="ml-auto font-mono text-muted-foreground">{tokenCount} tokens</span>
					{onCancel && (
						<button
							onClick={onCancel}
							className="ml-2 rounded p-1 transition-colors hover:bg-muted"
							title="Cancel streaming"
							type="button"
						>
							<Square className="h-4 w-4 fill-current text-muted-foreground" />
						</button>
					)}
				</>
			) : (
				<>
					<span className="text-muted-foreground">Completed</span>
					<span className="ml-auto font-mono text-foreground">{tokenCount} tokens</span>
				</>
			)}
		</div>
	);
}
