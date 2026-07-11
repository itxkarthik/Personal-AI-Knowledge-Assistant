import { expect, type Page, type APIRequestContext } from "@playwright/test";

export const testPassword = "Cognolith-E2E-Password-42";

export function uniqueEmail(prefix = "e2e"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
}

async function latestMailText(request: APIRequestContext, email: string): Promise<string> {
  const response = await request.get(`${process.env.MAILPIT_URL ?? "http://127.0.0.1:8025"}/api/v1/messages`);
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const message = messages.find((item: { To?: Array<{ Address?: string }> }) =>
    item.To?.some((recipient) => recipient.Address?.toLowerCase() === email.toLowerCase()),
  );
  if (!message?.ID) return "";
  const detail = await request.get(`${process.env.MAILPIT_URL ?? "http://127.0.0.1:8025"}/api/v1/message/${message.ID}`);
  expect(detail.ok()).toBeTruthy();
  const body = await detail.json();
  return `${body.Text ?? ""}\n${body.HTML ?? ""}`;
}

export async function waitForOtp(request: APIRequestContext, email: string): Promise<string> {
  await expect.poll(async () => latestMailText(request, email), { timeout: 30_000 }).toMatch(/\b\d{6}\b/);
  const text = await latestMailText(request, email);
  const code = text.match(/\b\d{6}\b/)?.[0];
  if (!code) throw new Error(`No verification code received for ${email}`);
  return code;
}

export async function registerAndVerify(page: Page, request: APIRequestContext, email = uniqueEmail()): Promise<string> {
  await page.goto("/auth/register");
  await page.getByLabel("Full name").fill("Cognolith E2E");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(testPassword);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/auth\/verify-email/);
  const code = await waitForOtp(request, email);
  await page.getByLabel("Verification digit 1").fill(code[0]);
  for (let index = 1; index < code.length; index += 1) {
    await page.getByLabel(`Verification digit ${index + 1}`).fill(code[index]);
  }
  await page.getByRole("button", { name: "Verify and continue" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  return email;
}
