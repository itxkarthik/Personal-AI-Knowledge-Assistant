import { expect, test } from "@playwright/test";

import { registerAndVerify } from "./helpers";

test("registers through Mailpit and opens the authenticated workspace", async ({ page, request }) => {
  await registerAndVerify(page, request);
  await expect(page.getByRole("heading", { name: "Welcome back, Cognolith." })).toBeVisible();
  await page.goto("/dashboard/notes");
  await expect(page).toHaveURL(/\/dashboard\/notes/);
  await page.goto("/dashboard/documents");
  await expect(page).toHaveURL(/\/dashboard\/documents/);
  await page.goto("/dashboard/search");
  await expect(page).toHaveURL(/\/dashboard\/search/);
  await page.goto("/dashboard/knowledge-graph");
  await expect(page).toHaveURL(/\/dashboard\/knowledge-graph/);
});

test("redirects an anonymous user to sign in", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});
