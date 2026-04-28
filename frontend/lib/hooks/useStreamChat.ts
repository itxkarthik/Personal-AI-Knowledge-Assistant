"use client";

import { useCallback, useRef, useState } from "react";

import { apiClient } from "@/lib/api/client";
import { streamChatMessage } from "@/lib/api/stream";

export interface UseStreamChatState {
	isStreaming: boolean;
	streamedContent: string;
	tokenCount: number;
	error: string | null;
	abortController: AbortController | null;
}

/**
 * React hook for streaming chat responses with real-time token counter
 *
 * Features:
 * - Real-time streaming from /messages/stream endpoint
 * - Token counting as text arrives
 * - Abort/cancel support via AbortController
 * - Error handling and display
 * - State management for streaming progress
 */
export function useStreamChat() {
	const [state, setState] = useState<UseStreamChatState>({
		isStreaming: false,
		streamedContent: "",
		tokenCount: 0,
		error: null,
		abortController: null,
	});

	const contentRef = useRef<string>("");

	/**
	 * Stream a chat message and accumulate response
	 */
	const streamMessage = useCallback(
		async (sessionId: number, content: string): Promise<void> => {
			// Reset state
			contentRef.current = "";
			setState({
				isStreaming: true,
				streamedContent: "",
				tokenCount: 0,
				error: null,
				abortController: null,
			});

			const abortController = new AbortController();
			setState((prev) => ({ ...prev, abortController }));

			try {
				const url = `${apiClient.defaults.baseURL}/chat/sessions/${sessionId}/messages/stream`;

				await streamChatMessage(
					url,
					{ content },
					{
						signal: abortController.signal,
						onChunk: (chunk: string) => {
							contentRef.current += chunk;

							// Count tokens (rough estimate: split by whitespace)
							const tokens = contentRef.current.split(/\s+/).filter(Boolean).length;

							setState((prev) => ({
								...prev,
								streamedContent: contentRef.current,
								tokenCount: tokens,
							}));
						},
						onError: (error: Error) => {
							setState((prev) => ({
								...prev,
								isStreaming: false,
								error: error.message,
								abortController: null,
							}));
						},
						onComplete: () => {
							setState((prev) => ({
								...prev,
								isStreaming: false,
								abortController: null,
							}));
						},
					}
				);
			} catch (error) {
				// Error already handled by parseSSEStream callback
				if (error instanceof Error && error.message !== "Stream aborted by user") {
					setState((prev) => ({
						...prev,
						isStreaming: false,
						error: error.message,
						abortController: null,
					}));
				}
			}
		},
		[]
	);

	/**
	 * Cancel the current streaming operation
	 */
	const cancelStream = useCallback((): void => {
		state.abortController?.abort();
		setState((prev) => ({
			...prev,
			isStreaming: false,
			abortController: null,
		}));
	}, [state.abortController]);

	/**
	 * Clear the streamed content and reset state
	 */
	const clearStream = useCallback((): void => {
		contentRef.current = "";
		setState({
			isStreaming: false,
			streamedContent: "",
			tokenCount: 0,
			error: null,
			abortController: null,
		});
	}, []);

	return {
		...state,
		streamMessage,
		cancelStream,
		clearStream,
	};
}
