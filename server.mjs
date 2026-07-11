import { createServer } from "node:http";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, resolve } from "node:path";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const MAX_BODY_BYTES = 16 * 1024;
const MAX_CALLS_PER_HOUR = 3;
const HOUR = 60 * 60 * 1000;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml"
};

const PUBLIC_FILES = new Set([
  "account.css",
  "app.js",
  "dashboard.css",
  "index.html",
  "mock-data.js",
  "phone.css",
  "styles.css"
]);

export class CallError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function normalizeE164(value) {
  const normalized = String(value || "").trim().replace(/[\s().-]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
}

function parseAllowlist(value) {
  return new Set(
    String(value || "")
      .split(",")
      .map((number) => normalizeE164(number))
      .filter(Boolean)
  );
}

function xmlEscape(value) {
  return String(value).replace(/[<>&"']/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;"
  }[character]));
}

export function buildApprovalTwiML(callbackUrl) {
  const opening = "Hello. This is Zip Zap Sold calling about a grocery order approval.";
  if (!callbackUrl) {
    return `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${opening} A decision is waiting in your Zip Zap Sold dashboard.</Say></Response>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Gather input="dtmf" numDigits="1" timeout="8" action="${xmlEscape(callbackUrl)}" method="POST"><Say>${opening} Press 1 to approve the trusted basket, or 2 to wait.</Say></Gather><Say>No response was received. The agent will wait for your decision.</Say></Response>`;
}

export function validateTwilioSignature({ authToken, signature, url, params }) {
  if (!authToken || !signature || !url) return false;
  const payload = `${url}${Object.entries(params || {})
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}${value}`)
    .join("")}`;
  const expected = createHmac("sha1", authToken).update(payload).digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

function publicCall(call) {
  if (!call) return null;
  return {
    id: call.id,
    mode: call.mode,
    status: call.status,
    supportsKeypadResponse: call.supportsKeypadResponse,
    updatedAt: call.updatedAt
  };
}

export function createCallService({ env = process.env, request = fetch, now = () => Date.now(), id = randomUUID } = {}) {
  const provider = String(env.CALL_PROVIDER || "demo").toLowerCase();
  const allowlist = parseAllowlist(env.PHONE_ALLOWLIST);
  const publicBaseUrl = String(env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const calls = new Map();
  const recentCalls = new Map();

  function registerAttempt(phone) {
    const cutoff = now() - HOUR;
    const recent = (recentCalls.get(phone) || []).filter((timestamp) => timestamp > cutoff);
    if (recent.length >= MAX_CALLS_PER_HOUR) {
      throw new CallError(429, "RATE_LIMITED", "This phone has reached the call limit. Please try again later.");
    }
    recent.push(now());
    recentCalls.set(phone, recent);
  }

  function configuredTwilio() {
    const required = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"];
    const missing = required.filter((name) => !env[name]);
    if (missing.length || !allowlist.size) {
      throw new CallError(503, "PHONE_PROVIDER_NOT_CONFIGURED", "Real phone calls need Twilio credentials and a PHONE_ALLOWLIST in phone.env.local.");
    }
  }

  async function create({ to, consent, scenario = "approval" }) {
    if (!consent) {
      throw new CallError(400, "CONSENT_REQUIRED", "Confirm that you own or control this phone before placing a call.");
    }
    const phone = normalizeE164(to);
    if (!phone) {
      throw new CallError(422, "INVALID_PHONE", "Use an international phone number, for example +48123456789.");
    }
    registerAttempt(phone);

    if (provider === "demo") {
      const call = {
        id: `demo-${id()}`,
        mode: "demo",
        scenario,
        status: "ringing",
        supportsKeypadResponse: false,
        to: phone,
        updatedAt: new Date(now()).toISOString()
      };
      calls.set(call.id, call);
      return publicCall(call);
    }

    if (provider !== "twilio") {
      throw new CallError(503, "UNSUPPORTED_PHONE_PROVIDER", "Set CALL_PROVIDER to demo or twilio.");
    }
    configuredTwilio();
    if (!allowlist.has(phone)) {
      throw new CallError(403, "PHONE_NOT_ALLOWED", "That phone number is not on the private call allowlist.");
    }

    const call = {
      id: `call-${id()}`,
      mode: "twilio",
      scenario,
      status: "placing",
      supportsKeypadResponse: Boolean(publicBaseUrl),
      to: phone,
      updatedAt: new Date(now()).toISOString()
    };
    const callbackUrl = publicBaseUrl ? `${publicBaseUrl}/api/twilio/answer?callId=${encodeURIComponent(call.id)}` : "";
    const body = new URLSearchParams({
      To: phone,
      From: env.TWILIO_FROM_NUMBER,
      Twiml: buildApprovalTwiML(callbackUrl)
    });
    const authorization = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64");
    let response;
    try {
      response = await request(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(env.TWILIO_ACCOUNT_SID)}/Calls.json`, {
        method: "POST",
        headers: {
          authorization: `Basic ${authorization}`,
          "content-type": "application/x-www-form-urlencoded"
        },
        body
      });
    } catch {
      throw new CallError(502, "PHONE_PROVIDER_UNAVAILABLE", "The phone provider could not be reached. Please try again.");
    }
    if (!response.ok) {
      throw new CallError(502, "PHONE_PROVIDER_REJECTED", "The phone provider rejected the call request. Check the local phone configuration.");
    }
    const providerCall = await response.json();
    call.providerId = providerCall.sid;
    call.status = providerCall.status || "queued";
    call.updatedAt = new Date(now()).toISOString();
    calls.set(call.id, call);
    return publicCall(call);
  }

  function get(callId) {
    return publicCall(calls.get(callId));
  }

  function answer(callId, digit) {
    const call = calls.get(callId);
    if (!call) throw new CallError(404, "CALL_NOT_FOUND", "This call no longer exists.");
    call.status = digit === "1" ? "approved" : digit === "2" ? "waiting" : "unrecognized";
    call.updatedAt = new Date(now()).toISOString();
    return publicCall(call);
  }

  function verifyWebhook(pathWithQuery, signature, params) {
    if (provider !== "twilio" || !publicBaseUrl) return false;
    return validateTwilioSignature({
      authToken: env.TWILIO_AUTH_TOKEN,
      signature,
      url: `${publicBaseUrl}${pathWithQuery}`,
      params
    });
  }

  return { answer, create, get, provider, verifyWebhook };
}

function send(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType, "cache-control": "no-store" });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload));
}

function sendTwiML(res, text) {
  send(res, 200, `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${xmlEscape(text)}</Say></Response>`, "text/xml; charset=utf-8");
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new CallError(413, "REQUEST_TOO_LARGE", "The request is too large.");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readJson(req) {
  const raw = await readBody(req);
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new CallError(400, "INVALID_JSON", "The call request must contain valid JSON.");
  }
}

function serveStatic(res, rootDir, pathname) {
  const requested = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^\/+/, "");
  if (!PUBLIC_FILES.has(requested)) {
    sendJson(res, 404, { error: "NOT_FOUND", message: "Not found." });
    return;
  }
  const filename = resolve(rootDir, requested);
  try {
    const content = readFileSync(filename);
    send(res, 200, content, MIME_TYPES[extname(filename)] || "application/octet-stream");
  } catch {
    sendJson(res, 404, { error: "NOT_FOUND", message: "Not found." });
  }
}

export function createZipZapServer({ rootDir = ROOT, callService = createCallService() } = {}) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://zip-zap-sold.local");
      if (req.method === "POST" && url.pathname === "/api/calls") {
        const payload = await readJson(req);
        const call = await callService.create(payload);
        sendJson(res, 202, call);
        return;
      }
      if (req.method === "GET" && url.pathname.startsWith("/api/calls/")) {
        const call = callService.get(decodeURIComponent(url.pathname.slice("/api/calls/".length)));
        if (!call) throw new CallError(404, "CALL_NOT_FOUND", "This call no longer exists.");
        sendJson(res, 200, call);
        return;
      }
      if (req.method === "POST" && url.pathname === "/api/twilio/answer") {
        const raw = await readBody(req);
        const params = Object.fromEntries(new URLSearchParams(raw));
        const pathWithQuery = `${url.pathname}${url.search}`;
        if (!callService.verifyWebhook(pathWithQuery, req.headers["x-twilio-signature"], params)) {
          throw new CallError(401, "INVALID_PHONE_WEBHOOK", "The phone provider signature could not be verified.");
        }
        const call = callService.answer(url.searchParams.get("callId"), params.Digits);
        const message = call.status === "approved" ? "Thank you. Zip Zap Sold will complete the trusted purchase." : "Thank you. Zip Zap Sold will wait for your decision.";
        sendTwiML(res, message);
        return;
      }
      if (req.method === "GET" && url.pathname === "/api/health") {
        sendJson(res, 200, { ok: true, phoneProvider: callService.provider });
        return;
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        sendJson(res, 405, { error: "METHOD_NOT_ALLOWED", message: "Method not allowed." });
        return;
      }
      serveStatic(res, rootDir, url.pathname);
    } catch (error) {
      if (error instanceof CallError) {
        sendJson(res, error.status, { error: error.code, message: error.message });
        return;
      }
      sendJson(res, 500, { error: "SERVER_ERROR", message: "Unexpected server error." });
    }
  });
}

function readPhoneEnvironment() {
  const filename = resolve(ROOT, "phone.env.local");
  if (!existsSync(filename)) return {};
  return Object.fromEntries(
    readFileSync(filename, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
      })
  );
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const env = { ...readPhoneEnvironment(), ...process.env };
  const port = Number(env.PORT || 4173);
  const host = env.HOST || "127.0.0.1";
  const server = createZipZapServer({ callService: createCallService({ env }) });
  server.listen(port, host, () => {
    console.log(`Zip Zap Sold is running at http://${host}:${port}`);
  });
}
