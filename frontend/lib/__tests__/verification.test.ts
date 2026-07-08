import { describe, expect, it } from "vitest";

import { formatVerificationCountdown, sanitizeVerificationCode } from "../verification";

describe("email verification helpers", () => {
  it("keeps only the first six digits", () => {
    expect(sanitizeVerificationCode(" 12a34-567 ")).toBe("123456");
  });

  it("formats a resend countdown", () => {
    expect(formatVerificationCountdown(0)).toBe("Resend code");
    expect(formatVerificationCountdown(9)).toBe("Resend in 0:09");
    expect(formatVerificationCountdown(65)).toBe("Resend in 1:05");
  });
});
