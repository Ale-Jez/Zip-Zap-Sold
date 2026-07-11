import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");

test("the document exposes the main interactive controls", () => {
  const html = read("index.html");
  for (const id of ["startAgent", "openAccount", "accountModal", "accountForm", "journey"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("the client wires agent, account and safety interactions", () => {
  const app = read("app.js");
  for (const hook of ["startAgent", "openAccount", "accountForm", "localStorage", "openPhone", "closeAccount"]) {
    assert.match(app, new RegExp(hook));
  }
});
