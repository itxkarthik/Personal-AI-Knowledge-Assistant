export function sanitizeVerificationCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function formatVerificationCountdown(seconds: number): string {
  if (seconds <= 0) {
    return "Resend code";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `Resend in ${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
