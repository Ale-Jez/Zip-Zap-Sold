import { expect, test } from "@playwright/test";

test("agent can start a guided purchase journey", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "✦ Start agent" }).click();
  await expect(page.getByText("Your agent is ready. Answer three quick questions to begin discovery.")).toBeVisible();

  await page.getByRole("button", { name: "Classic baked" }).click();
  await page.getByRole("button", { name: "I already have both" }).click();
  await page.getByRole("button", { name: "Tomorrow before 15:00" }).click();
  const discoveryButton = page.getByRole("button", { name: "Start background discovery →" });
  await expect(discoveryButton).toBeEnabled();
  await discoveryButton.click();
  await expect(page.getByRole("heading", { name: "Three agents research in the background." })).toBeVisible();
});

test("account can be created and shown in the header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByLabel("Your name").fill("Test Helena");
  await page.getByLabel("Email address").fill("helena@example.test");
  await page.getByLabel("Password").fill("testing-pass-123");
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page.getByRole("button", { name: "Account · Test" })).toBeVisible();
  await expect(page.getByText("Welcome, Test. Your agent profile is ready.")).toBeVisible();
});

test("account modal can be reopened and logged out", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByLabel("Your name").fill("Test Helena");
  await page.getByLabel("Email address").fill("helena@example.test");
  await page.getByLabel("Password").fill("testing-pass-123");
  await page.getByRole("button", { name: "Create my account" }).click();
  await page.getByRole("button", { name: "Account · Test" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.locator("#openAccount")).toHaveText("Log in");
});
