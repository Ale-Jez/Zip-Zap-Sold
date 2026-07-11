import { createServer } from "node:http";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, resolve } from "node:path";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const MAX_BODY_BYTES = 16 * 1024;
const MAX_CALLS_PER_HOUR = 3;
const HOUR = 60 * 60 * 1000;
const CALL_PROGRESS_EVENTS = ["initiated", "ringing", "answered", "completed"];
const CALL_STATUSES = new Set(["queued", "initiated", "ringing", "in-progress", "completed", "busy", "failed", "no-answer", "canceled"]);
const CALL_SCRIPTS = {
  approval: "Hello. This is Zip Zap Sold calling about a grocery order approval.",
  "earlier-delivery": "Hello Helena. EkstraMarket can deliver your cheesecake ingredients earlier for 1.55 PLN more.",
  "unverified-seller": "Hello Helena. I found a cheaper basket, but I cannot verify the seller. I recommend your trusted FreshMart store instead.",
  "morning-cheesecake": "Good morning, my dear! How are you feeling today?",
  "flour-alternative": "Hello again, my dear. I’m afraid your favourite flour is currently unavailable at your usual shop. However, I can recommend a lovely alternative—fine all-purpose flour. I’m sure it will make your cheesecake just as smooth, delicate, and delicious. Would you like me to order it for you?"
};
const FLOUR_CONFIRMATION = "Perfect! I’ll take care of it right away. Your cheesecake is going to be absolutely delightful!";
const FLOUR_DECLINE = "Of course. I will not substitute the flour and will keep looking for your usual choice.";
const MORNING_HELP = "I’m sorry to hear that. How can I help you today?";
const MORNING_GOODBYE = "A cheesecake? What a lovely idea! Let’s make it together. Take care, sweetheart!";
const VOICE_AUDIO = {
  morningGreeting: "audio/morning-cheesecake-greeting.mp3",
  morningHelp: "audio/morning-cheesecake-help.mp3",
  morningGoodbye: "audio/morning-cheesecake-goodbye.mp3",
  flourQuestion: "audio/flour-alternative-question.mp3",
  flourConfirmation: "audio/flour-alternative-confirmation.mp3"
};

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml"
};

const PUBLIC_FILES = new Set([
  "account.css",
  VOICE_AUDIO.flourConfirmation,
  VOICE_AUDIO.flourQuestion,
  VOICE_AUDIO.morningGoodbye,
  VOICE_AUDIO.morningGreeting,
  VOICE_AUDIO.morningHelp,
  "app.js",
  "dashboard.css",
  "index.html",
  "mock-data.js",
  "phone.css",
  "simple.css",
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

export function normalizePublicHttpsUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    if (url.protocol !== "https:" || localHosts.has(url.hostname.toLowerCase()) || !url.hostname) return "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
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

function twimlResponse(body) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${body}</Response>`;
}

function sayOrPlay(text, audioUrl = "") {
  return audioUrl ? `<Play>${xmlEscape(audioUrl)}</Play>` : `<Say>${xmlEscape(text)}</Say>`;
}

function conversationGatherTwiML(callbackUrl, text, audioUrl, noResponseText) {
  return twimlResponse(`<Gather input="speech" timeout="10" speechTimeout="auto" language="en-US" action="${xmlEscape(callbackUrl)}" method="POST">${sayOrPlay(text, audioUrl)}</Gather><Say>${xmlEscape(noResponseText)}</Say>`);
}

export function buildApprovalTwiML(callbackUrl, scenario = "approval", audioUrl = "") {
  const opening = CALL_SCRIPTS[scenario] || CALL_SCRIPTS.approval;
  if (scenario === "morning-cheesecake") {
    if (!callbackUrl) return twimlResponse(sayOrPlay(opening, audioUrl));
    return conversationGatherTwiML(callbackUrl, opening, audioUrl, "I will be here when you are ready to talk.");
  }
  if (scenario === "flour-alternative") {
    if (!callbackUrl) return twimlResponse(sayOrPlay(opening, audioUrl));
    return twimlResponse(`<Gather input="speech dtmf" numDigits="1" timeout="10" speechTimeout="auto" language="en-US" action="${xmlEscape(callbackUrl)}" method="POST">${sayOrPlay(opening, audioUrl)}</Gather><Say>I did not hear an answer, so I will wait before changing the flour.</Say>`);
  }
  if (!callbackUrl) {
    return twimlResponse(`<Say>${xmlEscape(opening)} A decision is waiting in your Zip Zap Sold dashboard.</Say>`);
  }
  return twimlResponse(`<Gather input="dtmf" numDigits="1" timeout="8" action="${xmlEscape(callbackUrl)}" method="POST"><Say>${xmlEscape(opening)} Press 1 to approve the trusted basket, or 2 to wait.</Say></Gather><Say>No response was received. The agent will wait for your decision.</Say>`);
}

export function buildAnswerTwiML({ scenario, status, callbackUrl = "", confirmationAudioUrl = "", helpAudioUrl = "", goodbyeAudioUrl = "", turn = 0 }) {
  if (scenario === "morning-cheesecake" && turn === 1) {
    return conversationGatherTwiML(callbackUrl, MORNING_HELP, helpAudioUrl, "I will be here when you need me.");
  }
  if (scenario === "morning-cheesecake") return twimlResponse(sayOrPlay(MORNING_GOODBYE, goodbyeAudioUrl));
  if (scenario === "flour-alternative" && status === "approved") {
    return twimlResponse(sayOrPlay(FLOUR_CONFIRMATION, confirmationAudioUrl));
  }
  if (scenario === "flour-alternative") return twimlResponse(`<Say>${xmlEscape(FLOUR_DECLINE)}</Say>`);
  const message = status === "approved" ? "Thank you. Zip Zap Sold will complete the trusted purchase." : "Thank you. Zip Zap Sold will wait for your decision.";
  return twimlResponse(`<Say>${xmlEscape(message)}</Say>`);
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
  const suppliedPublicBaseUrl = String(env.PUBLIC_BASE_URL || "").trim();
  const publicBaseUrl = normalizePublicHttpsUrl(suppliedPublicBaseUrl);
  const calls = new Map();
  const recentCalls = new Map();

  function hostedAudioUrl(filename) {
    if (!publicBaseUrl || !existsSync(resolve(ROOT, filename))) return "";
    return `${publicBaseUrl}/${filename}`;
  }

  function registerAttempt(phone) {
    const cutoff = now() - HOUR;
    const recent = (recentCalls.get(phone) || []).filter((timestamp) => timestamp > cutoff);
    if (recent.length >= MAX_CALLS_PER_HOUR) {
      throw new CallError(429, "RATE_LIMITED", "This phone has reached the call limit. Please try again later.");
    }
    recent.push(now());
    recentCalls.set(phone, recent);
  }

  function twilioConfigError() {
    const required = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"];
    const missing = required.filter((name) => !env[name]);
    if (missing.length || !allowlist.size) {
      return new CallError(503, "PHONE_PROVIDER_NOT_CONFIGURED", "Real phone calls need Twilio credentials, a voice-capable sender number, and a PHONE_ALLOWLIST in phone.env.local.");
    }
    if (!normalizeE164(env.TWILIO_FROM_NUMBER)) {
      return new CallError(503, "INVALID_TWILIO_FROM_NUMBER", "TWILIO_FROM_NUMBER must be a voice-capable E.164 number from your Twilio account.");
    }
    if (suppliedPublicBaseUrl && !publicBaseUrl) {
      return new CallError(503, "INVALID_PUBLIC_CALLBACK_URL", "PUBLIC_BASE_URL must be a public HTTPS URL. Localhost cannot receive Twilio callbacks.");
    }
    return null;
  }

  function configuredTwilio() {
    const error = twilioConfigError();
    if (error) throw error;
  }

  function config() {
    const error = provider === "twilio" ? twilioConfigError() : null;
    return {
      provider,
      realCallsEnabled: provider === "twilio" && !error,
      supportsKeypadResponse: Boolean(publicBaseUrl) && !error,
      message: provider === "demo"
        ? "Demo mode is active. No real phone number will be dialled."
        : error ? error.message : "Real Twilio calls are enabled for the private allowlist."
    };
  }

  async function create({ to, consent, scenario = "approval" }) {
    if (!consent) {
      throw new CallError(400, "CONSENT_REQUIRED", "Confirm that you own or control this phone before placing a call.");
    }
    const phone = normalizeE164(to);
    if (!phone) {
      throw new CallError(422, "INVALID_PHONE", "Use an international phone number, for example +48123456789.");
    }
    if (provider === "demo") {
      registerAttempt(phone);
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
    registerAttempt(phone);

    const callScenario = CALL_SCRIPTS[scenario] ? scenario : "approval";
    const call = {
      id: `call-${id()}`,
      mode: "twilio",
      scenario: callScenario,
      status: "placing",
      supportsKeypadResponse: Boolean(publicBaseUrl),
      to: phone,
      updatedAt: new Date(now()).toISOString()
    };
    const callbackUrl = publicBaseUrl ? `${publicBaseUrl}/api/twilio/answer?callId=${encodeURIComponent(call.id)}` : "";
    const statusCallbackUrl = publicBaseUrl ? `${publicBaseUrl}/api/twilio/status?callId=${encodeURIComponent(call.id)}` : "";
    const body = new URLSearchParams({
      To: phone,
      From: env.TWILIO_FROM_NUMBER,
      Twiml: buildApprovalTwiML(
        callbackUrl,
        callScenario,
        callScenario === "morning-cheesecake" ? hostedAudioUrl(VOICE_AUDIO.morningGreeting) : callScenario === "flour-alternative" ? hostedAudioUrl(VOICE_AUDIO.flourQuestion) : ""
      ),
      Timeout: "20"
    });
    if (statusCallbackUrl) {
      body.set("StatusCallback", statusCallbackUrl);
      body.set("StatusCallbackMethod", "POST");
      CALL_PROGRESS_EVENTS.forEach((event) => body.append("StatusCallbackEvent", event));
    }
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
    let providerCall = {};
    try {
      providerCall = await response.json();
    } catch {
      throw new CallError(502, "PHONE_PROVIDER_INVALID_RESPONSE", "The phone provider returned an invalid response.");
    }
    if (!response.ok) {
      if (Number(providerCall.code) === 20003) {
        throw new CallError(
          502,
          "PHONE_PROVIDER_AUTHENTICATION_FAILED",
          "Twilio authentication failed (error 20003). In phone.env.local, use the Account SID and current Auth Token from the same active Twilio project, then restart the server. Do not use an API Key SID or API Key Secret here."
        );
      }
      const code = providerCall.code ? ` (Twilio error ${providerCall.code})` : "";
      throw new CallError(502, "PHONE_PROVIDER_REJECTED", `The phone provider rejected the call request${code}. Check the local phone configuration.`);
    }
    if (!providerCall.sid) {
      throw new CallError(502, "PHONE_PROVIDER_INVALID_RESPONSE", "The phone provider did not return a call identifier.");
    }
    call.providerId = providerCall.sid;
    call.status = providerCall.status || "queued";
    call.updatedAt = new Date(now()).toISOString();
    calls.set(call.id, call);
    return publicCall(call);
  }

  function get(callId) {
    return publicCall(calls.get(callId));
  }

  function assertProviderId(call, providerId) {
    if (!providerId || providerId !== call.providerId) {
      throw new CallError(403, "CALL_PROVIDER_ID_MISMATCH", "The callback does not match the requested phone call.");
    }
  }

  function answer(callId, digit, providerId, speechResult = "") {
    const call = calls.get(callId);
    if (!call) throw new CallError(404, "CALL_NOT_FOUND", "This call no longer exists.");
    assertProviderId(call, providerId);
    const spokenAnswer = String(speechResult || "").toLowerCase();
    const flourApproved = /\b(yes|yeah|yep|sure|please|tak)\b/.test(spokenAnswer);
    if (call.scenario === "morning-cheesecake") {
      call.turn = (call.turn || 0) + 1;
      call.status = call.turn >= 2 ? "approved" : "in-progress";
    } else call.status = call.scenario === "flour-alternative"
      ? (digit === "1" || flourApproved ? "approved" : "waiting")
      : (digit === "1" ? "approved" : digit === "2" ? "waiting" : "unrecognized");
    call.updatedAt = new Date(now()).toISOString();
    return publicCall(call);
  }

  function answerTwiML(callId) {
    const call = calls.get(callId);
    if (!call) throw new CallError(404, "CALL_NOT_FOUND", "This call no longer exists.");
    return buildAnswerTwiML({
      scenario: call.scenario,
      status: call.status,
      callbackUrl: `${publicBaseUrl}/api/twilio/answer?callId=${encodeURIComponent(call.id)}`,
      confirmationAudioUrl: call.scenario === "flour-alternative" ? hostedAudioUrl(VOICE_AUDIO.flourConfirmation) : "",
      helpAudioUrl: call.scenario === "morning-cheesecake" ? hostedAudioUrl(VOICE_AUDIO.morningHelp) : "",
      goodbyeAudioUrl: call.scenario === "morning-cheesecake" ? hostedAudioUrl(VOICE_AUDIO.morningGoodbye) : "",
      turn: call.turn || 0
    });
  }

  function updateStatus(callId, status, providerId) {
    const call = calls.get(callId);
    if (!call) throw new CallError(404, "CALL_NOT_FOUND", "This call no longer exists.");
    assertProviderId(call, providerId);
    if (!CALL_STATUSES.has(status)) {
      throw new CallError(422, "INVALID_CALL_STATUS", "The phone provider returned an unknown call status.");
    }
    call.status = status;
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

  return { answer, answerTwiML, config, create, get, provider, updateStatus, verifyWebhook };
}

function send(res, status, body, contentType = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": contentType, "cache-control": "no-store" });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload));
}

function sendTwiML(res, twiml) {
  send(res, 200, twiml, "text/xml; charset=utf-8");
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
      if (req.method === "GET" && url.pathname === "/api/phone-config") {
        sendJson(res, 200, callService.config());
        return;
      }
      if (req.method === "POST" && url.pathname === "/api/twilio/answer") {
        const raw = await readBody(req);
        const params = Object.fromEntries(new URLSearchParams(raw));
        const pathWithQuery = `${url.pathname}${url.search}`;
        if (!callService.verifyWebhook(pathWithQuery, req.headers["x-twilio-signature"], params)) {
          throw new CallError(401, "INVALID_PHONE_WEBHOOK", "The phone provider signature could not be verified.");
        }
        const callId = url.searchParams.get("callId");
        callService.answer(callId, params.Digits, params.CallSid, params.SpeechResult);
        sendTwiML(res, callService.answerTwiML(callId));
        return;
      }
      if (req.method === "POST" && url.pathname === "/api/twilio/status") {
        const raw = await readBody(req);
        const params = Object.fromEntries(new URLSearchParams(raw));
        const pathWithQuery = `${url.pathname}${url.search}`;
        if (!callService.verifyWebhook(pathWithQuery, req.headers["x-twilio-signature"], params)) {
          throw new CallError(401, "INVALID_PHONE_WEBHOOK", "The phone provider signature could not be verified.");
        }
        const call = callService.updateStatus(url.searchParams.get("callId"), params.CallStatus, params.CallSid);
        sendJson(res, 200, { ok: true, call });
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
