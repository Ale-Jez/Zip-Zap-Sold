import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

function loadDemo() {
  const source = readFileSync(new URL("../../mock-data.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "mock-data.js" });
  return context.window.ZIP_ZAP_SOLD_DEMO;
}

test("named recipe data describes Helena's cheesecake mission", () => {
  const demo = loadDemo();

  assert.equal(demo.person.firstName, "Helena");
  assert.equal(demo.recipe.id, "classic-baked-cheesecake");
  assert.equal(demo.recipe.servings, 8);
  assert.equal(demo.recipe.ingredients.length, 6);
  assert.match(demo.recipe.voiceRequest, /cheesecake/i);
  assert.equal(demo.person.home.address, "Kwiatowa 12, Kraków");
});

test("legacy recipe aliases remain derived from the named recipe", () => {
  const demo = loadDemo();

  assert.equal(demo.request.text, demo.recipe.voiceRequest);
  assert.equal(demo.request.questions.length, demo.recipe.questions.length);
  assert.equal(demo.ingredients.length, demo.recipe.ingredients.length);
  assert.equal(demo.ingredients[0][0], demo.recipe.ingredients[0].name);
  assert.equal(demo.ingredients[0][2], "18.99 PLN");
  assert.equal(demo.order.address, demo.person.home.address);
});

test("a trusted recommended vendor stays within Helena's automatic limit", () => {
  const demo = loadDemo();
  const recommended = demo.vendors.filter((vendor) => vendor.recommended);

  assert.equal(recommended.length, 1);
  assert.equal(recommended[0].id, "fresh");
  assert.equal(recommended[0].trusted, true);
  assert.ok(recommended[0].total <= demo.person.preferences.automaticPurchaseLimit);
  assert.ok(recommended[0].evidence >= 90);

  const legacyOffer = demo.offers.find((offer) => offer.id === recommended[0].id);
  assert.equal(legacyOffer.total, recommended[0].total);
  assert.equal(legacyOffer.recommended, true);
});

test("the mock call contains a clear human approval choice", () => {
  const demo = loadDemo();
  const call = demo.call.scenarios.earlierDelivery;

  assert.equal(call.vendorId, "extra");
  assert.match(call.prompt, /1\.55 PLN/);
  assert.deepEqual(Array.from(call.choices, (choice) => choice.id), ["approve", "keep", "wait"]);
});

test("an unverified marketplace vendor stays blocked and hidden by default", () => {
  const demo = loadDemo();
  const riskyVendor = demo.vendors.find((vendor) => vendor.id === "deal");

  assert.equal(riskyVendor.status, "Blocked");
  assert.equal(riskyVendor.trusted, false);
  assert.equal(riskyVendor.visibleByDefault, false);
  assert.equal(riskyVendor.blocked, true);
  assert.ok(riskyVendor.trust < 65);
  assert.ok(riskyVendor.evidence < 65);
});
