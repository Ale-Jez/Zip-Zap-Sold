import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");

test("the browser uses only the local phone endpoint and never exposes provider secrets", () => {
  const app = read("app.js");
  const server = read("server.mjs");
  const launcher = read("start.command");
  const readme = read("README.md");
  const phoneEnvExample = read("phone.env.example");

  assert.match(app, /fetch\("\/api\/calls"/);
  assert.doesNotMatch(app, /\b(XMLHttpRequest|axios)\s*\(/);
  assert.doesNotMatch(app, /(TWILIO_|api\.twilio\.com|Authorization:\s*Basic)/);
  assert.match(server, /PHONE_ALLOWLIST/);
  assert.match(server, /PHONE_PROVIDER_NOT_CONFIGURED/);
  assert.match(launcher, /node server\.mjs/);
  assert.match(readme, /phone\.env\.local/);
  assert.match(phoneEnvExample, /CALL_PROVIDER=demo/);
});
