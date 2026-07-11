import { expect, test } from "@playwright/test";

import { registerAndVerify } from "./helpers";

test("uploads a document and finds its content through workspace search", async ({ page, request }) => {
  test.setTimeout(300_000);
  await registerAndVerify(page, request, `search-${Date.now()}@example.com`);
  const marker = `heliotrope-${Date.now()}`;

  await page.goto("/dashboard/documents/upload");
  await page.getByLabel("Document file").setInputFiles({
    name: "release-foundation.txt",
    mimeType: "text/plain",
    buffer: Buffer.from(`Cognolith release validation marker: ${marker}.`),
  });
  await page.getByLabel("Title (optional)").fill("Release Foundation Document");
  await page.getByRole("button", { name: "Upload document" }).click();
  await expect(page).toHaveURL(/\/dashboard\/documents\/\d+/, { timeout: 240_000 });
  await expect(page.getByRole("heading", { name: "Release Foundation Document" })).toBeVisible();

  await page.goto("/dashboard/search");
  await page.getByPlaceholder("Search across documents, notes, and chat conversations").fill(marker);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Release Foundation Document", { exact: true })).toBeVisible({ timeout: 60_000 });
});

test("receives a real response from Ollama", async ({ page, request }, testInfo) => {
  test.setTimeout(240_000);
  test.skip(testInfo.project.name.includes("mobile"), "Run the model-backed assertion once per workflow.");
  await registerAndVerify(page, request, `ai-${Date.now()}@example.com`);
  await page.goto("/dashboard/chat");
  await page.getByRole("button", { name: "New Session" }).click();
  await expect(page).toHaveURL(/\/dashboard\/chat\/\d+/);
  const prompt = "Reply with a short greeting and mention Cognolith.";
  await page.getByPlaceholder("Ask about your workspace or anything else...").fill(prompt);
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled({ timeout: 30_000 });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Assistant", { exact: true })).toBeVisible({ timeout: 120_000 });
  await expect(page.getByRole("paragraph").filter({ hasText: prompt })).toBeVisible();
});
