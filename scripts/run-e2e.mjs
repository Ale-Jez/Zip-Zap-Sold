import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = process.env.ZIP_ZAP_SOLD_TEST_PORT || "4174";
const baseUrl = `http://127.0.0.1:${port}`;
const playwrightCli = resolve(root, "node_modules", "@playwright", "test", "cli.js");

function startServer() {
  return spawn(process.execPath, ["server.mjs"], {
    cwd: root,
    env: { ...process.env, PORT: port, CALL_PROVIDER: "demo" },
    stdio: ["ignore", "ignore", "pipe"],
    windowsHide: true
  });
}

async function waitForServer(server) {
  let lastError = new Error("The test server did not start.");
  const deadline = Date.now() + 12_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw lastError;
    try {
      const response = await fetch(`${baseUrl}/api/health`, { signal: AbortSignal.timeout(500) });
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await delay(120);
  }
  throw lastError;
}

async function stopServer(server) {
  if (server.exitCode !== null || server.killed) return;
  const exited = once(server, "exit");
  server.kill();
  await Promise.race([exited, delay(2_000)]);
  if (server.exitCode === null) {
    server.kill("SIGKILL");
    await Promise.race([once(server, "exit"), delay(2_000)]);
  }
}

async function main() {
  const server = startServer();
  let stderr = "";
  server.stderr.on("data", (chunk) => { stderr += chunk; });
  try {
    await waitForServer(server);
    const runner = spawn(process.execPath, [playwrightCli, "test", ...process.argv.slice(2)], {
      cwd: root,
      env: { ...process.env },
      stdio: "inherit",
      windowsHide: true
    });
    const [code] = await once(runner, "exit");
    process.exitCode = Number.isInteger(code) ? code : 1;
  } catch (error) {
    console.error(`Unable to run browser tests: ${error.message}${stderr ? `\n${stderr}` : ""}`);
    process.exitCode = 1;
  } finally {
    await stopServer(server);
  }
}

await main();
