# Zip Zap Sold

A self-contained, interactive demonstration of a proactive commerce agent.

## Run

On Windows, run `./start.ps1` from PowerShell.

Double-click `start.command` on macOS, or run this from a terminal:

```sh
sh start.command
```

It opens the demo and serves it locally on `http://127.0.0.1:4173`. Alternatively, open [index.html](./index.html) directly, or run a local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Included demo flow

Helena asks by voice for a complete cheesecake ingredient basket. The app visibly runs:

1. `Understand` — intent extraction, follow-up questions, saved context.
2. `Discover` — background price, freshness and trust agents.
3. `Decide` — scored, evidence-backed basket comparison.
4. `Approve` — an accessible simulated phone call for a policy exception.
5. `Purchase` — mock secure checkout and audit trail.
6. `Track` — fulfillment timeline and exception paths.
7. `Resolve` — feedback becomes a future preference.

All mock data lives in [mock-data.js](./mock-data.js). The phone call is deliberately simulated in-app, making it reliable for a live demo without needing an external telephony account or a real phone number.

## Account demo

The top bar includes a Start agent action and a local account flow. You can create an account, log in, manage it and log out. It is deliberately browser-only: account details stay in local storage and no credentials are sent to a server.

## Dashboard views

The integrated Zip Zap Sold GUI also includes:

- **Live map** — visualizes the trusted merchant, Helena's destination, delivery route and blocked seller path.
- **Favourites** — buyer-owned trusted stores and saved shopping patterns that influence ranking.
- **Agent autonomy** — an editable automatic-purchase limit plus safety, substitution and delivery-change rules. Changes persist locally and update the policy displayed in the buying flow.
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
- `npm run test:backend` guards the current static-runtime boundary: the demo must not quietly gain untested network/API calls.
- `npm run test:e2e` launches the app and exercises the browser journey, agent start, account creation and logout flows in Chromium and mobile Chromium.

GitHub Actions runs the unit, runtime-boundary and Chromium end-to-end checks on every push and pull request. The project currently has no backend service; when one is introduced, replace the static-runtime contract with API, authentication and database integration tests.
