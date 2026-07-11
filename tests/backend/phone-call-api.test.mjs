import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { createCallService, createZipZapServer, normalizeE164, validateTwilioSignature } from "../../server.mjs";

test("phone numbers are normalized to a strict international format", () => {
  assert.equal(normalizeE164(" +48 (123) 456-789 "), "+48123456789");
  assert.equal(normalizeE164("123 456"), null);
  assert.equal(normalizeE164("+00123456789"), null);
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

  const call = await service.create({ to: "+48 123 456 789", consent: true });

  assert.equal(call.id, "call-approval-id");
  assert.equal(call.status, "queued");
  assert.equal(call.supportsKeypadResponse, true);
  assert.match(requested.url, /Accounts\/AC123\/Calls\.json$/);
  assert.equal(requested.init.method, "POST");
  assert.match(String(requested.init.body), /To=%2B48123456789/);
  assert.match(String(requested.init.body), /Gather/);
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
});

test("the local server exposes only the client files needed by the app", async (t) => {
  const server = createZipZapServer({ callService: createCallService({ env: { CALL_PROVIDER: "demo" } }) });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const { port } = server.address();

  const publicFile = await fetch(`http://127.0.0.1:${port}/phone.css`);
  const internalFile = await fetch(`http://127.0.0.1:${port}/server.mjs`);

  assert.equal(publicFile.status, 200);
  assert.equal(internalFile.status, 404);
});
