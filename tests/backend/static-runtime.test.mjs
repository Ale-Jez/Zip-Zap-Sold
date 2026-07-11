import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");

test("the demo has an explicit static-runtime boundary", () => {
  const app = read("app.js");
  const launcher = read("start.command");
  const readme = read("README.md");

  assert.doesNotMatch(app, /\b(fetch|XMLHttpRequest|axios)\s*\(/);
  assert.match(launcher, /python3 -m http\.server/);
  assert.match(readme, /no credentials are sent to a server/i);
});
