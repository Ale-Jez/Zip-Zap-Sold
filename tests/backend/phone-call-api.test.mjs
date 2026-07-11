import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { buildAnswerTwiML, buildApprovalTwiML, createCallService, createZipZapServer, normalizeE164, normalizePublicHttpsUrl, validateTwilioSignature } from "../../server.mjs";

test("phone numbers are normalized to a strict international format", () => {
  assert.equal(normalizeE164(" +48 (123) 456-789 "), "+48123456789");
  assert.equal(normalizeE164("123 456"), null);
  assert.equal(normalizeE164("+00123456789"), null);
});

test("callback URLs must be public HTTPS addresses", () => {
  assert.equal(normalizePublicHttpsUrl("https://zip-zap-sold.example/"), "https://zip-zap-sold.example");
  assert.equal(normalizePublicHttpsUrl("http://zip-zap-sold.example"), "");
  assert.equal(normalizePublicHttpsUrl("https://localhost:4173"), "");
  assert.equal(normalizePublicHttpsUrl("https://127.0.0.1:4173"), "");
});

test("the safe demo provider creates a non-dialling ringing call", async () => {
  const service = createCallService({ env: { CALL_PROVIDER: "demo" }, id: () => "demo-id", now: () => 0 });
  const call = await service.create({ to: "+48123456789", consent: true });

  assert.deepEqual(call, {
    id: "demo-demo-id",
    mode: "demo",
    status: "ringing",
    supportsKeypadResponse: false,
    updatedAt: "1970-01-01T00:00:00.000Z"
  });
});

test("phone configuration exposes no secrets and distinguishes demo from a live provider", () => {
  const demo = createCallService({ env: { CALL_PROVIDER: "demo" } }).config();
  assert.equal(demo.realCallsEnabled, false);
  assert.match(demo.message, /Demo mode/i);

  const live = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789",
      PUBLIC_BASE_URL: "https://zip-zap-sold.example"
    }
  }).config();
  assert.equal(live.realCallsEnabled, true);
  assert.equal(live.supportsKeypadResponse, true);
  assert.equal(JSON.stringify(live).includes("secret"), false);
});

test("a call cannot be created without explicit consent", async () => {
  const service = createCallService({ env: { CALL_PROVIDER: "demo" } });
  await assert.rejects(
    () => service.create({ to: "+48123456789", consent: false }),
    (error) => error.code === "CONSENT_REQUIRED"
  );
});

test("a real provider requires an explicit private allowlist", async () => {
  const service = createCallService({
    env: { CALL_PROVIDER: "twilio", TWILIO_ACCOUNT_SID: "AC123", TWILIO_AUTH_TOKEN: "secret", TWILIO_FROM_NUMBER: "+15005550006" }
  });

  await assert.rejects(
    () => service.create({ to: "+48123456789", consent: true }),
    (error) => error.code === "PHONE_PROVIDER_NOT_CONFIGURED"
  );
});

test("a local callback URL is rejected before Twilio is contacted", async () => {
  let contacted = false;
  const service = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789",
      PUBLIC_BASE_URL: "http://127.0.0.1:4173"
    },
    request: async () => { contacted = true; return new Response("{}", { status: 500 }); }
  });

  await assert.rejects(
    () => service.create({ to: "+48123456789", consent: true }),
    (error) => error.code === "INVALID_PUBLIC_CALLBACK_URL"
  );
  assert.equal(contacted, false);
});

test("the Twilio adapter sends an outbound request only after consent and allowlist validation", async () => {
  let requested;
  const service = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789",
      PUBLIC_BASE_URL: "https://zip-zap-sold.example"
    },
    id: () => "approval-id",
    request: async (url, init) => {
      requested = { url, init };
      return new Response(JSON.stringify({ sid: "CA123", status: "queued" }), { status: 201 });
    }
  });

  const call = await service.create({ to: "+48 123 456 789", consent: true, scenario: "earlier-delivery" });

  assert.equal(call.id, "call-approval-id");
  assert.equal(call.status, "queued");
  assert.equal(call.supportsKeypadResponse, true);
  assert.match(requested.url, /Accounts\/AC123\/Calls\.json$/);
  assert.equal(requested.init.method, "POST");
  assert.match(String(requested.init.body), /To=%2B48123456789/);
  assert.match(String(requested.init.body), /Gather/);
  assert.match(String(requested.init.body), /EkstraMarket/);
  assert.match(String(requested.init.body), /StatusCallback=/);
  assert.match(String(requested.init.body), /StatusCallbackEvent=initiated/);
  assert.match(String(requested.init.body), /StatusCallbackEvent=completed/);
});

test("the flour-alternative call plays recordings and gathers a spoken answer", async () => {
  const prompt = buildApprovalTwiML(
    "https://zip-zap-sold.example/api/twilio/answer?callId=call-flour",
    "flour-alternative",
    "https://zip-zap-sold.example/audio/flour-alternative-question.mp3"
  );
  assert.match(prompt, /input="speech dtmf"/);
  assert.match(prompt, /speechTimeout="auto"/);
  assert.match(prompt, /flour-alternative-question\.mp3/);

  const confirmation = buildAnswerTwiML({
    scenario: "flour-alternative",
    status: "approved",
    confirmationAudioUrl: "https://zip-zap-sold.example/audio/flour-alternative-confirmation.mp3"
  });
  assert.match(confirmation, /flour-alternative-confirmation\.mp3/);
});

test("a spoken yes approves the flour alternative and returns the final line", async () => {
  const service = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789",
      PUBLIC_BASE_URL: "https://zip-zap-sold.example"
    },
    id: () => "flour-id",
    request: async () => new Response(JSON.stringify({ sid: "CA123", status: "queued" }), { status: 201 })
  });
  const call = await service.create({ to: "+48123456789", consent: true, scenario: "flour-alternative" });
  const answer = service.answer(call.id, "", "CA123", "Yes, please. That sounds wonderful.");

  assert.equal(answer.status, "approved");
  assert.match(service.answerTwiML(call.id), /Your cheesecake is going to be absolutely delightful/);
});

test("the morning cheesecake call listens twice before playing its goodbye", async () => {
  const service = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789",
      PUBLIC_BASE_URL: "https://zip-zap-sold.example"
    },
    id: () => "morning-id",
    request: async () => new Response(JSON.stringify({ sid: "CA456", status: "queued" }), { status: 201 })
  });
  const call = await service.create({ to: "+48123456789", consent: true, scenario: "morning-cheesecake" });
  const firstAnswer = service.answer(call.id, "", "CA456", "My legs hurt a little, but I am glad you asked.");

  assert.equal(firstAnswer.status, "in-progress");
  assert.match(service.answerTwiML(call.id), /How can I help you today/);

  const secondAnswer = service.answer(call.id, "", "CA456", "I would like to make a cheesecake, as usual.");
  assert.equal(secondAnswer.status, "approved");
  assert.match(service.answerTwiML(call.id), /What a lovely idea/);
});

test("Twilio error 20003 gives a credential-specific recovery message", async () => {
  const service = createCallService({
    env: {
      CALL_PROVIDER: "twilio",
      TWILIO_ACCOUNT_SID: "AC123",
      TWILIO_AUTH_TOKEN: "secret",
      TWILIO_FROM_NUMBER: "+15005550006",
      PHONE_ALLOWLIST: "+48123456789"
    },
    request: async () => new Response(JSON.stringify({ code: 20003 }), { status: 401 })
  });

  await assert.rejects(
    () => service.create({ to: "+48123456789", consent: true }),
    (error) => error.code === "PHONE_PROVIDER_AUTHENTICATION_FAILED" && /Account SID and current Auth Token/.test(error.message)
  );
});

test("Twilio callback signatures are verified before a keypad response is accepted", () => {
  const url = "https://zip-zap-sold.example/api/twilio/answer?callId=call-approval-id";
  const params = { CallSid: "CA123", Digits: "1" };
  const payload = `${url}CallSidCA123Digits1`;
  const signature = createHmac("sha1", "secret").update(payload).digest("base64");

  assert.equal(validateTwilioSignature({ authToken: "secret", signature, url, params }), true);
  assert.equal(validateTwilioSignature({ authToken: "secret", signature: "wrong", url, params }), false);
});

test("the API accepts a consented demo call without contacting a provider", async (t) => {
  const server = createZipZapServer({ callService: createCallService({ env: { CALL_PROVIDER: "demo" } }) });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const { port } = server.address();

  const response = await fetch(`http://127.0.0.1:${port}/api/calls`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ to: "+48123456789", consent: true })
  });
  const call = await response.json();

  assert.equal(response.status, 202);
  assert.equal(call.mode, "demo");
  assert.equal(call.status, "ringing");
  assert.equal("to" in call, false);

  const configResponse = await fetch(`http://127.0.0.1:${port}/api/phone-config`);
  const config = await configResponse.json();
  assert.equal(configResponse.status, 200);
  assert.equal(config.realCallsEnabled, false);
  assert.equal(config.provider, "demo");
});

test("a signed Twilio status callback updates only its matching call", async (t) => {
  const env = {
    CALL_PROVIDER: "twilio",
    TWILIO_ACCOUNT_SID: "AC123",
    TWILIO_AUTH_TOKEN: "secret",
    TWILIO_FROM_NUMBER: "+15005550006",
    PHONE_ALLOWLIST: "+48123456789",
    PUBLIC_BASE_URL: "https://zip-zap-sold.example"
  };
  const service = createCallService({
    env,
    id: () => "status-id",
    request: async () => new Response(JSON.stringify({ sid: "CA123", status: "queued" }), { status: 201 })
  });
  const call = await service.create({ to: "+48123456789", consent: true });
  const server = createZipZapServer({ callService: service });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const { port } = server.address();
  const path = `/api/twilio/status?callId=${call.id}`;
  const statusUrl = `https://zip-zap-sold.example${path}`;
  const params = { CallSid: "CA123", CallStatus: "ringing" };
  const signature = createHmac("sha1", "secret").update(`${statusUrl}CallSidCA123CallStatusringing`).digest("base64");

  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-twilio-signature": signature },
    body: new URLSearchParams(params)
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.call.status, "ringing");

  const wrongParams = { CallSid: "CA999", CallStatus: "completed" };
  const wrongSignature = createHmac("sha1", "secret").update(`${statusUrl}CallSidCA999CallStatuscompleted`).digest("base64");
  const mismatch = await fetch(`http://127.0.0.1:${port}${path}`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-twilio-signature": wrongSignature },
    body: new URLSearchParams(wrongParams)
  });
  assert.equal(mismatch.status, 403);
});

test("the local server exposes only the client files needed by the app", async (t) => {
  const server = createZipZapServer({ callService: createCallService({ env: { CALL_PROVIDER: "demo" } }) });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const { port } = server.address();

  const publicFile = await fetch(`http://127.0.0.1:${port}/simple.css`);
  const internalFile = await fetch(`http://127.0.0.1:${port}/server.mjs`);

  assert.equal(publicFile.status, 200);
  assert.equal(internalFile.status, 404);
});
