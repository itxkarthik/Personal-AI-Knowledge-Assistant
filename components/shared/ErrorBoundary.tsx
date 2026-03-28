"use client";

import type { ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	message?: string;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	public constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, message: error.message };
	}

	public componentDidCatch(error: Error): void {
		console.error("ErrorBoundary captured:", error);
	}

	private readonly reset = () => {
		this.setState({ hasError: false, message: undefined });
	};

	public render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="mx-auto my-20 max-w-md rounded-2xl border border-zinc-700/60 bg-zinc-900/70 p-6 text-zinc-100 backdrop-blur">
					<h2 className="text-lg font-semibold">Something went wrong</h2>
					<p className="mt-2 text-sm text-zinc-300">
						{this.state.message ?? "An unexpected rendering error occurred."}
					</p>
					<button
						type="button"
						onClick={this.reset}
						className="mt-4 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
