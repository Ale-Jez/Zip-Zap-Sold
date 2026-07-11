# Zip Zap Sold

A self-contained, interactive demonstration of a proactive commerce agent.

## Run

On Windows, run `.\start.ps1` from PowerShell.

Double-click `start.command` on macOS, or run this from a terminal:

```sh
sh start.command
```

It opens the demo and its local call connector at `http://127.0.0.1:4173`. You can also run it directly with Node:

```powershell
npm start
```

Then visit `http://127.0.0.1:4173`.

## Included demo flow

Helena asks by voice for a complete cheesecake ingredient basket. The app visibly runs:

1. `Understand` — intent extraction, follow-up questions, saved context.
2. `Discover` — background price, freshness and trust agents.
3. `Decide` — scored, evidence-backed basket comparison.
4. `Approve` — an accessible simulated phone call for a policy exception.
5. `Purchase` — mock secure checkout and audit trail.
6. `Track` — fulfillment timeline and exception paths.
7. `Resolve` — feedback becomes a future preference.

All mock data lives in [mock-data.js](./mock-data.js). The in-app phone conversation remains available as a reliable presentation fallback.

## Demo mockups

The demo data is ready to present and kept in one place:

- `recipe` — an eight-person classic baked cheesecake and six required ingredients;
- `vendors` — FreshMart (recommended), EkstraMarket (trusted but needs approval), and DealFinder (blocked);
- `call` — clear AI-agent scripts and answer choices for an earlier delivery or an unsafe seller.

The default journey is deliberately simple: one question at a time, one recommended shop, and a call only when Helena needs to decide. The delivery map layout is unchanged.

## Account demo

The top bar includes a Start agent action and a local account flow. You can create an account, log in, manage it and log out. It is deliberately browser-only: account details stay in local storage and no credentials are sent to a server.

## Dashboard views

The integrated Zip Zap Sold GUI also includes:

- **Live map** — visualizes the trusted merchant, Helena's destination, delivery route and blocked seller path.
- **Favourites** — buyer-owned trusted stores and saved shopping patterns that influence ranking.
- **Agent autonomy** — an editable automatic-purchase limit plus safety, substitution and delivery-change rules. Changes persist locally and update the policy displayed in the buying flow.

## Phone connector

The **Call me** control is consent-gated and has two modes:

- **Demo mode** is the default. It never dials a real number and opens the in-app call preview.
- **Twilio mode** places a real outbound approval call and reports its progress in the app.

To enable a real call, copy [phone.env.example](./phone.env.example) to `phone.env.local`, then set `CALL_PROVIDER=twilio` and provide a live Twilio Account SID, Auth Token, a voice-capable Twilio `From` number, and a narrow `PHONE_ALLOWLIST` containing only numbers you own or control. Do not put these credentials in browser code or commit `phone.env.local`.

Trial Twilio projects may call only verified recipient numbers; international calls also depend on the account's Voice Geographic Permissions. A public HTTPS `PUBLIC_BASE_URL` is optional for placing the call, but required for live call-progress updates and keypad answers (`1` to approve, `2` to wait). Localhost cannot receive Twilio webhooks.

No phone credentials are exposed to browser code. The server validates international format, explicit consent, the private allowlist, and signed Twilio callbacks. It places the outbound call through Twilio's Calls API with a short scripted prompt; it is not a free-form conversational voice bot.
## Automated tests

Install the test dependencies once:

```sh
npm install
npx playwright install chromium
```

Run every available test with:

```sh
npm test
```

The suite has three layers:

- `npm run test:unit` validates the basket data and UI wiring contracts.
- `npm run test:backend` validates the local phone-call API, phone format, consent, allowlist safeguards and the provider adapter with no external call.
- `npm run test:e2e` launches the app and exercises the browser journey, account flow, phone connector, dashboard views, and mobile Chromium.

GitHub Actions runs the unit, runtime-boundary and Chromium end-to-end checks on every push and pull request.
