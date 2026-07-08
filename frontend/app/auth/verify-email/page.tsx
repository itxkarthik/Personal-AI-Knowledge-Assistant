"use client";

import { ClipboardEvent, FormEvent, KeyboardEvent, Suspense, useEffect, useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button, Card, CardContent } from "@/components/ui";
import { getCurrentUser, resendVerification, verifyEmail } from "@/lib/api/auth";
import { formatVerificationCountdown, sanitizeVerificationCode } from "@/lib/verification";
import { useAuthStore } from "@/store/authStore";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";
  const setAuth = useAuthStore((state) => state.setAuth);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [countdown]);

  const setCode = (value: string) => {
    const sanitized = sanitizeVerificationCode(value);
    const next = Array.from({ length: 6 }, (_, index) => sanitized[index] ?? "");
    setDigits(next);
    inputs.current[Math.min(sanitized.length, 5)]?.focus();
  };

  const onDigitChange = (index: number, value: string) => {
    const sanitized = sanitizeVerificationCode(value);
    if (sanitized.length > 1) {
      setCode(sanitized);
      return;
    }
    setDigits((current) => current.map((digit, position) => position === index ? sanitized : digit));
    if (sanitized && index < 5) inputs.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCode(event.clipboardData.getData("text"));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = digits.join("");
    if (!email || code.length !== 6) {
      setError("Enter the complete six-digit code.");
      return;
    }
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    try {
      await verifyEmail(email, code);
      const user = await getCurrentUser();
      setAuth({ user });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The verification code could not be confirmed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResend = async () => {
    if (!email || countdown > 0 || isResending) return;
    setError(null);
    setNotice(null);
    setIsResending(true);
    try {
      const response = await resendVerification(email);
      setCountdown(response.retry_after_seconds);
      setNotice("A new verification code has been requested.");
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "A new code could not be requested.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border bg-background">
        <CardContent className="p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-muted">
            <MailCheck className="h-5 w-5 text-foreground" />
          </div>
          <p className="mt-5 text-xs text-muted-foreground">Account security</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Verify your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the six-digit code sent to <span className="font-medium text-foreground">{email || "your email address"}</span>.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div className="grid grid-cols-6 gap-2" onPaste={onPaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { inputs.current[index] = element; }}
                  aria-label={`Verification digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  className="aspect-square min-w-0 border border-input bg-background text-center text-xl font-semibold text-foreground outline-none focus:border-foreground focus:ring-1 focus:ring-foreground"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => onDigitChange(index, event.target.value)}
                  onKeyDown={(event) => onKeyDown(index, event)}
                />
              ))}
            </div>

            {error ? <div className="border border-[#ff3b30] bg-[#ff3b30]/10 px-4 py-3 text-sm text-[#a50011]">{error}</div> : null}
            {notice ? <div className="border border-border bg-muted px-4 py-3 text-sm text-foreground">{notice}</div> : null}

            <Button type="submit" disabled={isSubmitting || digits.some((digit) => !digit)} className="w-full">
              {isSubmitting ? <LoadingSpinner /> : "Verify and continue"}
            </Button>
          </form>

          <Button type="button" variant="ghost" className="mt-3 w-full" disabled={countdown > 0 || isResending || !email} onClick={onResend}>
            {isResending ? <LoadingSpinner /> : formatVerificationCountdown(countdown)}
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Wrong address? <Link href="/auth/register" className="font-medium underline underline-offset-4">Create another account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[100dvh] items-center justify-center bg-background"><LoadingSpinner /></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
