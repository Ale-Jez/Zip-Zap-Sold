import { expect, test } from "@playwright/test";

test("agent can start a guided purchase journey", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start shopping" }).click();
  await expect(page.getByText("Let's start with one short question.")).toBeVisible();
  await expect(page.locator("#content .question")).toHaveCount(1);

  await page.getByRole("button", { name: "Classic baked" }).click();
  await expect(page.locator("#content .question")).toHaveCount(1);
  await page.getByRole("button", { name: "I already have both" }).click();
  await page.getByRole("button", { name: "Tomorrow before 15:00" }).click();
  const discoveryButton = page.getByRole("button", { name: "Start background discovery ->" });
  await expect(discoveryButton).toBeEnabled();
  await discoveryButton.click();
  await expect(page.locator("#content").getByRole("heading", { name: "We are checking the shops." })).toBeVisible();
});

test("account can be created and shown in the header", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "My account" }).click();
  await page.getByLabel("Your name").fill("Test Helena");
  await page.getByLabel("Email address").fill("helena@example.test");
  await page.getByLabel("Password").fill("testing-pass-123");
  await page.getByRole("button", { name: "Create my account" }).click();
  await expect(page.getByRole("button", { name: "My account · Test" })).toBeVisible();
  await expect(page.getByText("Welcome, Test. Your agent profile is ready.")).toBeVisible();
});

test("account modal can be reopened and logged out", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "My account" }).click();
  await page.getByLabel("Your name").fill("Test Helena");
  await page.getByLabel("Email address").fill("helena@example.test");
  await page.getByLabel("Password").fill("testing-pass-123");
  await page.getByRole("button", { name: "Create my account" }).click();
  await page.getByRole("button", { name: "My account · Test" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page.locator("#openAccount")).toHaveText("My account");
});

test("the phone connector is consent-gated and works in safe demo mode", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Call me" }).first().click();
  await page.getByLabel("Your phone number").fill("+48123456789");
  await page.getByLabel(/I want Zip Zap Sold to call this number/).check();
  await page.locator("#placePhoneCall").click();
  await expect(page.getByText("Demo call is ringing.")).toBeVisible();
  await page.getByRole("button", { name: "See the call first" }).click();
  await expect(page.locator("#phoneModal")).toHaveClass(/open/);
  await expect(page.getByText("ZIP ZAP SOLD AGENT IS CALLING")).toBeVisible();
});

test("map, favourites and autonomy views remain available alongside the journey", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Delivery map/ }).click();
  await expect(page.getByRole("heading", { name: "One basket. One trusted route." })).toBeVisible();
  await expect(page.locator(".map-layout")).toBeVisible();
  await page.getByRole("button", { name: /Trusted shops/ }).click();
  await expect(page.getByRole("heading", { name: "Shops Helena already trusts." })).toBeVisible();
  await page.getByRole("button", { name: /My choices/ }).click();
  await page.locator("#autoLimitSlider").evaluate((element) => {
    element.value = "70";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.getByRole("button", { name: "Save Helena’s autonomy rules" }).click();
  await expect(page.getByText("Automatic checkout is allowed.")).toBeVisible();
});
