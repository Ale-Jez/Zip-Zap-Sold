# Zip Zap Sold

A self-contained, interactive demonstration of a proactive commerce agent.

## Run

Open [index.html](./index.html) directly, or run a local server:

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
