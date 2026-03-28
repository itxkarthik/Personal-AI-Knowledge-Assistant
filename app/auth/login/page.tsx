"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { getCurrentUser, login } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
	const router = useRouter();
	const setAuth = useAuthStore((state) => state.setAuth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			await login({ email, password });
			const user = await getCurrentUser();

			setAuth({
				user,
			});

			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to login.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="auth-shell">
			<motion.div
				className="auth-card"
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
			>
				<p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Welcome Back</p>
				<h1 className="mt-3 text-3xl font-semibold text-zinc-100">Sign in</h1>
				<p className="mt-2 text-zinc-300">Access your knowledge workspace.</p>

				<form onSubmit={onSubmit} className="mt-8 space-y-4">
					<label className="block">
						<span className="mb-1 block text-sm text-zinc-300">Email</span>
						<input
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="auth-input"
							placeholder="you@example.com"
						/>
					</label>

					<label className="block">
						<span className="mb-1 block text-sm text-zinc-300">Password</span>
						<input
							type="password"
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="auth-input"
							placeholder="••••••••"
						/>
					</label>

					{error ? (
						<p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
							{error}
						</p>
					) : null}

					<button type="submit" disabled={isSubmitting} className="auth-button">
						{isSubmitting ? (
							<LoadingSpinner label="Signing in" className="text-zinc-900" />
						) : (
							<>
								Sign in <ArrowRight className="h-4 w-4" />
							</>
						)}
					</button>
				</form>

				<p className="mt-6 text-sm text-zinc-400">
					No account yet?{" "}
					<Link href="/auth/register" className="text-zinc-100 underline-offset-4 hover:underline">
						Create one
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
