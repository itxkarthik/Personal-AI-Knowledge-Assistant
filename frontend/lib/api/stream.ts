/**
 * Server-Sent Events (SSE) stream parser for chat responses.
 *
 * Handles streaming text from backend /messages/stream endpoint
 * with proper error handling and chunk parsing.
 */

export interface StreamOptions {
	signal?: AbortSignal;
	onChunk?: (chunk: string) => void;
	onError?: (error: Error) => void;
	onComplete?: () => void;
}

/**
 * Parse Server-Sent Events stream from chat endpoint
 *
 * @param response - Fetch Response object with text/event-stream content
 * @param options - Configuration and callbacks for stream processing
 * @throws Error if stream parsing fails or network error occurs
 */
export async function parseSSEStream(
	response: Response,
	options: StreamOptions = {}
): Promise<void> {
	const { signal, onChunk, onError, onComplete } = options;

	if (!response.body) {
		throw new Error("Response body is empty");
	}

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`HTTP ${response.status}: ${text}`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		while (true) {
			// Check for abort signal
			if (signal?.aborted) {
				reader.cancel();
				throw new Error("Stream aborted by user");
			}

			const { done, value } = await reader.read();
			if (done) break;

			// Decode chunk and add to buffer
			buffer += decoder.decode(value, { stream: true });

			// Process complete SSE messages (separated by \n\n)
			const lines = buffer.split("\n\n");

			// Keep the last incomplete message in buffer
			buffer = lines[lines.length - 1];

			// Process all complete messages
			for (let i = 0; i < lines.length - 1; i++) {
				const message = lines[i].trim();
				if (!message) continue;

				// Parse SSE format: "data: <content>"
				if (message.startsWith("data: ")) {
					const data = message.slice(6).trim();

					// Check for completion marker
					if (data === "[DONE]") {
						onComplete?.();
						return;
					}

					// Unescape newlines and yield chunk
					const unescaped = data.replace(/\\n/g, "\n");
					onChunk?.(unescaped);
				}
			}
		}

		// Process any remaining buffer
		if (buffer.trim()) {
			const message = buffer.trim();
			if (message.startsWith("data: ")) {
				const data = message.slice(6).trim();
				if (data !== "[DONE]") {
					const unescaped = data.replace(/\\n/g, "\n");
					onChunk?.(unescaped);
				}
			}
		}

		onComplete?.();
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error));
		onError?.(err);
		throw err;
	} finally {
		reader.releaseLock();
	}
}

/**
 * Stream chat message to backend with SSE parsing
 *
 * @param url - API endpoint URL (e.g., "/api/v1/chat/sessions/1/messages/stream")
 * @param payload - Chat message payload
 * @param options - Stream options with callbacks
 */
export async function streamChatMessage(
	url: string,
	payload: { content: string },
	options: StreamOptions = {}
): Promise<void> {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		signal: options.signal,
	});

	await parseSSEStream(response, options);
}
