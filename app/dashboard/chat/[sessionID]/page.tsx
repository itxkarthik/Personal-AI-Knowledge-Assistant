interface ChatSessionPageProps {
	params: Promise<{
		sessionID: string;
	}>;
}

export default async function ChatSessionPage({ params }: ChatSessionPageProps) {
	const { sessionID } = await params;

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold text-zinc-100">Chat Session</h1>
			<p className="text-zinc-300">Session ID: {sessionID}</p>
		</div>
	);
}

