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

test("the phone connector is consent-gated and works in safe demo mode", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Call my phone" }).click();
  await page.getByLabel("Phone number").fill("+48123456789");
  await page.getByLabel(/I own or control this number/).check();
  await page.getByRole("button", { name: "Place phone call" }).click();
  await expect(page.getByText("Demo call is ringing.")).toBeVisible();
  await page.getByRole("button", { name: "Preview the in-app call" }).click();
  await expect(page.locator("#phoneModal")).toHaveClass(/open/);
  await expect(page.getByText("ZIP ZAP SOLD AGENT IS CALLING")).toBeVisible();
});

test("map, favourites and autonomy views remain available alongside the journey", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Live map/ }).click();
  await expect(page.getByRole("heading", { name: "One basket. One trusted route." })).toBeVisible();
  await page.getByRole("button", { name: /Favourites/ }).click();
  await expect(page.getByRole("heading", { name: "The agent remembers what Helena trusts." })).toBeVisible();
  await page.getByRole("button", { name: /Agent autonomy/ }).click();
  await page.locator("#autoLimitSlider").evaluate((element) => {
    element.value = "70";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Save Helena’s autonomy rules" }).click();
  await expect(page.getByText("Automatic checkout is allowed.")).toBeVisible();
});
