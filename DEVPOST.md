# Zip Zap Sold — Devpost copy

## Elevator pitch

> Zip Zap Sold is a voice-first shopping agent that learns your preferences, finds trusted options, buys within your rules, tracks delivery, and calls only when it matters.

**Character count:** 170

## About the project

### Inspiration

Shopping still means comparing offers, checking whether a seller is trustworthy, managing delivery, and making the same decisions repeatedly. We wanted to make purchasing feel less like admin and more like asking a capable, trusted friend for help.

### What it does

Zip Zap Sold is a proactive commerce agent that turns a natural-language request into a safe, transparent purchase journey.

It:

- Understands what the user needs through a voice-first conversation.
- Reuses saved preferences such as budget, delivery address, favourite stores, and autonomy rules.
- Runs specialist checks for value, freshness, delivery, and merchant trust.
- Ranks options using user-specific priorities instead of choosing only the cheapest offer.
- Requests human approval only when a rule is crossed, such as an unfamiliar seller or a budget exception.
- Simulates checkout, tracks delivery, and captures feedback to improve future purchases.
- Includes dashboard views for delivery routes, trusted stores, and editable agent autonomy.

### How we built it

We built a self-contained web demo with HTML, CSS, and JavaScript. The experience is driven by structured mock commerce data and a seven-step agent flow: Understand, Discover, Decide, Approve, Purchase, Track, and Resolve.

The project also includes a browser-local account demo, configurable purchase rules, a simulated approval phone call, and dashboard views for delivery, favourites, and agent autonomy.

### Challenges we ran into

The main challenge was designing automation that feels helpful without becoming opaque or risky. We focused on making the agent’s reasoning visible, defining clear approval boundaries, and showing why an offer was selected or blocked.

### Accomplishments that we're proud of

- A complete, easy-to-follow agent journey from voice request to post-purchase feedback.
- Safety-aware recommendations that account for trust, delivery, freshness, and price.
- Human-in-the-loop approval for meaningful exceptions rather than every small decision.
- A dashboard that makes autonomy, favourites, delivery, and purchase context understandable.
- Automated desktop and mobile browser tests for the most important user flows.

### What we learned

A useful buying agent needs more than search and checkout. It needs a durable understanding of the person, transparent trade-offs, and clear limits on when it can act independently.

### What's next for Zip Zap Sold

Next, we want to connect live merchant, delivery, payment, and voice services; replace mock data with verified real-time offers; add secure authentication; and expand the preference model across more product categories.
