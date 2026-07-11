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

test("demo data has the complete cheesecake request", () => {
  const demo = loadDemo();
  assert.equal(demo.request.questions.length, 3);
  assert.equal(demo.ingredients.length, 6);
  assert.match(demo.request.text, /cheesecake/i);
  assert.equal(demo.order.address, "Kwiatowa 12, Kraków");
});

test("recommended basket respects the automatic purchase limit", () => {
  const demo = loadDemo();
  const recommended = demo.offers.filter((offer) => offer.recommended);
  assert.equal(recommended.length, 1);
  assert.equal(recommended[0].id, "fresh");
  assert.ok(recommended[0].total <= 65);
  assert.ok(recommended[0].evidence >= 90);
});

test("unsafe marketplace offer remains blocked from automation", () => {
  const demo = loadDemo();
  const riskyOffer = demo.offers.find((offer) => offer.id === "deal");
  assert.equal(riskyOffer.status, "Blocked");
  assert.ok(riskyOffer.trust < 65);
  assert.ok(riskyOffer.evidence < 65);
});
