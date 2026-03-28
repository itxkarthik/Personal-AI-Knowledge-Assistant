import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface LoadingSpinnerProps {
	className?: string;
	label?: string;
}

export function LoadingSpinner({
	className,
	label = "Loading",
}: LoadingSpinnerProps) {
	return (
		<div className={cn("inline-flex items-center gap-2 text-zinc-300", className)}>
			<LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
			<span className="text-sm">{label}</span>
		</div>
	);
}
