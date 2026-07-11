(() => {
  const d = window.ZIP_ZAP_SOLD_DEMO;
  const stages = ["understand", "discover", "decide", "approve", "purchase", "track", "resolve"];
  const labels = ["Understand", "Discover", "Decide", "Approve", "Purchase", "Track", "Resolve"];
  const savedPreferences = JSON.parse(localStorage.getItem("zip-zap-sold-demo-preferences") || "{}");
  const state = {
    stage: "understand", view: "mission", answers: {}, chosen: "fresh", approved: false, bought: false, feedback: null,
    autoLimit: Number(savedPreferences.autoLimit || 65),
    rules: Object.assign({ substitutions: true, unknownSeller: true, deliveryChange: true }, savedPreferences.rules || {}),
    favourites: savedPreferences.favourites || ["FreshMart", "EkstraMarket", "Classic baked cheesecake"]
  };
  const content = document.querySelector("#content");
  const title = document.querySelector("#title");
  const summaryText = document.querySelector("#summaryText");
  const autonomy = document.querySelector("#autonomy");
  const phone = document.querySelector("#phoneModal");
  const incoming = document.querySelector("#incoming");
  const liveCall = document.querySelector("#liveCall");
  const script = document.querySelector("#callScript");
  const callOptions = document.querySelector("#callOptions");
  const page = {
    understand: ["A cheesecake, without the shopping trip.", "Helena only said what she wanted to bake. Zip Zap Sold asks only what it cannot safely infer."],
    discover: ["Three agents research in the background.", "The agent validates freshness, value and seller trust while Helena carries on with her day."],
    decide: ["One answer, backed by Helena’s priorities.", "Zip Zap Sold does not simply pick the cheapest basket. It weighs the trade-offs Helena has already taught it."],
    approve: ["The agent knows when to interrupt.", "A decision crosses Helena’s autonomy boundary, so Zip Zap Sold calls her—notifies her only when it matters."],
    purchase: ["Approved once. Executed securely.", "The basket, payment, delivery slot and receipt are all bound to Helena’s approval."],
    track: ["The agent stays with the order.", "No carrier apps and no manual tracking. Zip Zap Sold keeps the purchase moving and surfaces exceptions."],
    resolve: ["Every purchase makes the next one easier.", "After delivery, Helena’s feedback becomes a useful preference—not a forgotten chat message."]
  };

  const head = (n, h, p) => `<header class="stage-head"><div><small>0${n} / ${labels[n - 1].toUpperCase()}</small><h2>${h}</h2></div><p>${p}</p></header>`;
  const button = (text, id, className = "dark", disabled = false) => `<button id="${id}" class="${className}" ${disabled ? "disabled" : ""}>${text}</button>`;
  const row = (a, b) => `<div class="row"><span>${a}</span><b>${b}</b></div>`;
  const toast = (message) => { const e = document.querySelector("#toast").content.firstElementChild.cloneNode(true); e.querySelector("span").textContent = message; document.querySelector("#toasts").append(e); setTimeout(() => e.remove(), 3500); };

  function renderJourney() {
    const active = stages.indexOf(state.stage);
    document.querySelector("#journey").innerHTML = stages.map((stage, i) => `<li><button class="journey-item ${i < active ? "done" : i === active ? "active" : ""}" data-stage="${stage}"><i>0${i + 1}</i><span>${labels[i]}</span><b>${i < active ? "✓" : i === active ? "•" : ""}</b></button></li>`).join("");
    document.querySelectorAll("[data-stage]").forEach((b) => b.addEventListener("click", () => setStage(b.dataset.stage)));
  }

  function setStage(stage) {
    state.stage = stage;
    state.view = "mission";
    [title.textContent, summaryText.textContent] = page[stage];
    autonomy.textContent = stage === "approve" ? "Human confirmation required" : `Auto-buy ≤ ${state.autoLimit} PLN`;
    renderJourney(); renderWorkspace(); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function savedContext() {
    return `<aside class="card pad memory"><small>SAVED CONTEXT</small><h3>Helena’s agent<br />already knows</h3><ul><li>Home delivery at Kwiatowa 12</li><li>Freshness before a small saving</li><li>Call when a seller is unknown</li><li>Routine basket limit: 65 PLN</li></ul></aside>`;
  }

  function understand() {
    const questions = d.request.questions.map((q, i) => {
      const picked = state.answers[q[0]];
      return `<article class="question ${picked ? "answered" : ""}"><small>QUESTION ${i + 1} OF 3</small><h3>${q[1]}</h3><p>${q[2]}</p><div class="choices">${q[3].map((v) => `<button class="choice ${picked === v ? "selected" : ""}" data-answer-key="${q[0]}" data-answer="${v}">${v}</button>`).join("")}</div></article>`;
    }).join("");
    const n = Object.keys(state.answers).length;
    content.innerHTML = `${head(1, "Understand the outcome, not a shopping list.", "The agent turns a natural request into one structured mission. It reuses Helena’s context and asks only three material questions.")}<div class="grid"><article class="card pad request"><div class="request-user"><span class="mini-avatar">H</span> Helena’s voice message · 00:14</div><blockquote>“${d.request.text.replace("Zip Zap Sold, ", "") }”</blockquote><footer><span><i class="wave"><i></i><i></i><i></i></i>Voice-first request</span><span>Intent: one cheesecake basket</span></footer></article>${savedContext()}</div><section class="questions">${questions}</section><div class="continue"><span><strong>${n}/3 answers</strong> captured. Zip Zap Sold uses Helena’s profile for the rest.</span>${button("Start background discovery →", "goDiscover", "dark", n < 3)}</div>`;
    document.querySelectorAll("[data-answer-key]").forEach((b) => b.addEventListener("click", () => { state.answers[b.dataset.answerKey] = b.dataset.answer; understand(); }));
    document.querySelector("#goDiscover")?.addEventListener("click", () => setStage("discover"));
  }

  function discover() {
    const ingredients = d.ingredients.map((x) => row(`${x[0]} <small>· ${x[1]}</small>`, x[2])).join("");
    const agents = d.agents.map((a) => `<div class="agent"><i class="${a[3]}">${a[0]}</i><div><strong>${a[1]}</strong><span>${a[2]}</span></div><b class="${a[4] === "!" ? "warn" : ""}">${a[4]}</b></div>`).join("");
    content.innerHTML = `${head(2, "Background research, visible when it matters.", "Zip Zap Sold sends specialists to check what makes a grocery order succeed—not merely the lowest shelf price.")}<div class="grid"><article class="card pad ingredients"><small>RECIPE → CART</small><h3>Classic baked cheesecake</h3>${ingredients}<div class="continue"><span>All 6 ingredients have structured requirements.</span><strong>✓ Basket ready to search</strong></div></article><aside class="card info-card"><h3>Three agents are working</h3><p>They run while Helena is not in the app.</p><div class="agent-list">${agents}</div><div class="log"><p><time>00:01</time><span>Found four delivery slots around Kraków</span></p><p><time>00:03</time><span>Rejected baskets with unavailable cheese</span></p><p><time>00:05</time><span>Flagged a marketplace CAPTCHA</span></p></div></aside></div><div class="continue"><span><strong>Research complete.</strong> Three viable baskets remain.</span>${button("Review agent findings →", "goDecide")}</div>`;
    document.querySelector("#goDecide").addEventListener("click", () => setStage("decide"));
  }

  function offer(o) {
    return `<article class="card offer ${o.recommended ? "best" : ""}">${o.recommended ? '<span class="badge">BEST FIT</span>' : ""}<div class="store"><div><h3>${o.store}</h3><p>${o.label}</p></div><span class="status ${o.tone}">${o.status}</span></div><div class="price">${o.total.toFixed(2)} <small>PLN</small></div><p class="eta">${o.eta}</p>${row("Basket", o.stock)}${row("Fit score", `${o.fit}%`)}<div class="bar"><i style="width:${o.fit}%"></i></div>${row("Evidence confidence", `${o.evidence}%`)}<div class="bar"><i style="width:${o.evidence}%;background:${o.tone === "risk" ? "#d16f55" : "#176e64"}"></i></div><div class="tags">${o.tags.map((t) => `<i>${t}</i>`).join("")}</div><button data-offer="${o.id}">${o.id === "deal" ? "Inspect safety exception" : o.recommended ? "Choose recommendation" : "Show approval path"}</button></article>`;
  }

  function decide() {
    const weights = d.weights.map((w) => `<div class="weight"><p><span>${w[0]}</span><b>${w[1]}%</b></p><i><b style="width:${w[1]}%;background:${w[2]}"></b></i></div>`).join("");
    content.innerHTML = `${head(3, "Turn many options into one defensible decision.", "Every candidate gets a user-fit score and an evidence score, so Zip Zap Sold never hides uncertainty.")}<section class="offers">${d.offers.map(offer).join("")}</section><section class="decision"><article class="card recommend"><small>AGENT RECOMMENDATION</small><h3>FreshMart basket</h3><p>It meets Helena’s hard constraints, costs 0.77 PLN below her automatic-purchase cap and has the strongest evidence score.</p><div class="stat"><div><strong>98%</strong><span>match to needs</span></div><div><strong>98%</strong><span>verified evidence</span></div><div><strong>1</strong><span>trusted delivery</span></div></div></article><aside class="card weights"><h3>Helena’s decision weights</h3>${weights}</aside></section><section class="approval"><div><h3>Explore the exception route</h3><p>EkstraMarket is a verified, earlier delivery—but it is 1.55 PLN over Helena’s auto-buy cap. Zip Zap Sold needs her answer.</p></div>${button("Show phone approval →", "goApprove")}</section>`;
    document.querySelectorAll("[data-offer]").forEach((b) => b.addEventListener("click", () => {
      state.chosen = b.dataset.offer;
      if (b.dataset.offer === "fresh") toast("FreshMart remains the automatic recommendation.");
      else { setStage("approve"); setTimeout(openPhone, 350); }
    }));
    document.querySelector("#goApprove").addEventListener("click", () => { setStage("approve"); setTimeout(openPhone, 350); });
  }

  function approve() {
    const isRisk = state.chosen === "deal";
    const headline = isRisk ? "The cheapest basket is not safe to automate." : "Faster delivery for 1.55 PLN more?";
    const detail = isRisk ? "DealFinder is 7.73 PLN cheaper, but its merchant data is blocked by a CAPTCHA and its trust score is below Helena’s minimum. Zip Zap Sold stops instead of guessing." : "EkstraMarket is trusted and arrives earlier, but it costs 65.78 PLN. Helena’s rule allows grocery auto-buying only below 65 PLN.";
    const scriptText = isRisk ? "Helena, I found a cheaper basket, but I cannot verify the seller or its fresh-food policy. I recommend the trusted FreshMart basket for 64.23 PLN. Shall I use that instead?" : "Helena, the fastest trusted basket costs 65.78 PLN—1.55 PLN over your usual limit. May I buy it?";
    const stats = isRisk ? `<div class="stat"><div><strong>54%</strong><span>merchant trust</span></div><div><strong>CAPTCHA</strong><span>data verification blocked</span></div><div><strong>0</strong><span>unsafe auto-purchases</span></div></div>` : `<div class="stat"><div><strong>93%</strong><span>merchant trust</span></div><div><strong>10–12</strong><span>earlier delivery</span></div><div><strong>1.55</strong><span>PLN above cap</span></div></div>`;
    content.innerHTML = `${head(4, "A meaningful interruption, not another notification.", "Zip Zap Sold handles normal decisions alone. It calls Helena only when a rule or safety boundary requires it.")}<section class="decision"><article class="card recommend"><small>${isRisk ? "SAFETY BOUNDARY REACHED" : "APPROVAL BOUNDARY REACHED"}</small><h3>${headline}</h3><p>${detail}</p>${stats}</article><aside class="card pad"><small>HELENA’S AUTHORITY RULE</small><h3 style="font:600 26px/1 'Fraunces',serif;letter-spacing:-.04em;margin:9px 0">“Call me if something changes.”</h3><p style="color:var(--muted);font-size:12px;line-height:1.5">Zip Zap Sold is not asking Helena to compare every basket. It asks one question because it reached a boundary she chose.</p>${button("☎ Show Helena’s phone call", "openCall", "dark")}</aside></section><section class="approval"><div><h3>Demo call script</h3><p>“${scriptText}”</p></div><b class="status ${isRisk ? "risk" : "safe"}">${isRisk ? "AUTOMATION BLOCKED" : "ONE MEANINGFUL DECISION"}</b></section>`;
    document.querySelector("#openCall").addEventListener("click", openPhone);
  }

  function purchase() {
    const chosen = d.offers.find((o) => o.id === state.chosen);
    content.innerHTML = `${head(5, "Approved once. Executed securely.", "The basket, payment, delivery slot and receipt are all bound to Helena’s specific approval.")}<section class="checkout"><article class="card"><small>CHECKOUT PROPOSAL</small><h3>${chosen.store} · ${chosen.total.toFixed(2)} PLN</h3><p>One complete cheesecake basket, delivered to ${d.order.address} ${chosen.eta.toLowerCase()}.</p><div class="receipt">${row("6 ingredients", `${chosen.items.toFixed(2)} PLN`)}${row("Home delivery", `${chosen.fee.toFixed(2)} PLN`)}<div class="row total"><span>Total approved by Helena</span><b>${chosen.total.toFixed(2)} PLN</b></div></div><div class="secure">✓ Approval logged · ✓ Limits respected or explicitly overridden · ✓ Secure checkout ready</div>${button(state.bought ? "Order completed ✓" : "Complete secure checkout", "checkout", "dark")}</article><aside class="card timeline"><h3>Order audit trail</h3><div class="event done"><i></i><div><strong>Helena’s request understood</strong><span>Recipe, budget and delivery preference saved</span></div></div><div class="event done"><i></i><div><strong>Helena approved ${chosen.store} basket</strong><span>Phone call outcome attached to the purchase</span></div></div><div class="event ${state.bought ? "current" : ""}"><i></i><div><strong>Checkout ${state.bought ? "completed" : "awaiting execution"}</strong><span>Merchant, price and slot will be locked</span></div></div>${state.bought ? `<div class="confirmed"><i>✓</i><div><strong>Order ${d.order.id} is confirmed</strong><span>Zip Zap Sold will call Helena if anything changes.</span></div></div>` : ""}</aside></section>`;
    document.querySelector("#checkout").addEventListener("click", () => { state.bought = true; toast(`Order ${d.order.id} confirmed. Tracking is now active.`); purchase(); setTimeout(() => setStage("track"), 850); });
  }

  function track() {
    const event = (status, strong, span) => `<div class="event ${status}"><i></i><div><strong>${strong}</strong><span>${span}</span></div></div>`;
    content.innerHTML = `${head(6, "The agent remains accountable after checkout.", "Zip Zap Sold turns merchant and carrier updates into one simple, proactive order view for Helena.")}<section class="track"><article class="card timeline"><small>ORDER ${d.order.id}</small><h3 style="font:600 29px/1 'Fraunces',serif;letter-spacing:-.045em;margin:8px 0 19px">Cheesecake ingredients<br />are on their way.</h3>${event("done", "Order confirmed", "Now")}${event("current", "Picker selects fresh ingredients", "Tomorrow, 08:30")}${event("", "Courier collects the basket", "Tomorrow, 10:30")}${event("", "Delivery at Helena’s door", "Tomorrow, 10:00–12:00")}</article><aside class="card info-card"><h3>Background exception handling</h3><p>If anything changes, Zip Zap Sold decides what it can do next—and calls only if it needs Helena.</p><div class="agent-list"><div class="agent"><i class="lime">↻</i><div><strong>Missing ingredient?</strong><span>Use substitution rule or call.</span></div><b>✓</b></div><div class="agent"><i class="coral">!</i><div><strong>Delivery delayed?</strong><span>Find a new slot before the deadline fails.</span></div><b>✓</b></div><div class="agent"><i class="violet">⌾</i><div><strong>Freshness concern?</strong><span>Start return or merchant support path.</span></div><b>✓</b></div></div>${button("Simulate delivered order →", "goResolve", "dark")}</aside></section>`;
    document.querySelector("#goResolve").addEventListener("click", () => setStage("resolve"));
  }

  function resolve() {
    content.innerHTML = `${head(7, "The purchase is complete only when Helena is happy.", "One short call after delivery teaches Zip Zap Sold something useful for the next purchase.")}<section class="resolve"><article class="card"><small>POST-PURCHASE CHECK-IN</small><h3>“Helena, did everything arrive in good condition?”</h3><p>Zip Zap Sold asks through Helena’s chosen channel: a short voice call. Her answer closes this order and improves the next one.</p><div class="feedback"><button data-feedback="perfect" class="${state.feedback === "perfect" ? "selected" : ""}">✓ Everything was perfect</button><button data-feedback="late" class="${state.feedback === "late" ? "selected" : ""}">Delivery was too late</button><button data-feedback="fresh" class="${state.feedback === "fresh" ? "selected" : ""}">One item was not fresh</button></div>${button("Close mission and update profile", "finish", "finish", !state.feedback)}</article><aside class="card learn"><h3>What Zip Zap Sold learned from this mission</h3><p><i>1</i>Helena prefers one complete basket over several shops.</p><p><i>2</i>Fresh dairy and a reliable time slot matter more than a small saving.</p><p><i>3</i>Her agent must call before it overrides a purchase limit.</p></aside></section>`;
    document.querySelectorAll("[data-feedback]").forEach((b) => b.addEventListener("click", () => { state.feedback = b.dataset.feedback; resolve(); }));
    document.querySelector("#finish")?.addEventListener("click", () => { toast("Mission closed. Helena’s profile is ready for the next request."); openProfile(); });
  }

  function renderTabs() {
    document.querySelectorAll(".workspace-tabs [data-view]").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === state.view);
    });
  }

  function setView(view) {
    state.view = view;
    renderWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderWorkspace() {
    renderTabs();
    if (state.view === "mission") { render(); return; }
    if (state.view === "map") { renderMap(); return; }
    if (state.view === "favourites") { renderFavourites(); return; }
    renderAutonomy();
  }

  function renderMap() {
    content.innerHTML = [
      '<section class="workspace-view">',
      '<header class="view-intro"><div><small>LIVE DELIVERY MAP</small><h2>One basket. One trusted route.</h2></div><p>Zip Zap Sold consolidates the order, confirms the delivery slot and shows the background route in a view Helena can understand.</p></header>',
      '<div class="map-layout"><section class="mock-map"><span class="map-label one">KRAKOW · TOMORROW</span><span class="map-label two">ACTIVE ROUTE</span><i class="route"></i>',
      '<i class="map-pin home"><span>⌂</span></i><i class="map-pin store"><span>⌘</span></i><i class="map-pin unsafe"><span>!</span></i>',
      '<div class="map-popover home"><strong>Helena’s home</strong><span>Kwiatowa 12 · delivery before 15:00</span></div>',
      '<div class="map-popover store"><strong>FreshMart</strong><span>6 items reserved · 12:30–14:00</span></div>',
      '<div class="map-popover unsafe"><strong>DealFinder</strong><span>Blocked: seller data cannot be verified</span></div>',
      '<div class="map-legend"><span>● Home</span><span>● Trusted merchant</span><span>● Safety exception</span></div></section>',
      '<aside class="map-side"><article class="card"><small>ACTIVE DELIVERY</small><h3>FreshMart → Helena</h3><p>Complete basket, one merchant, one delivery window. The chosen route avoids multiple errands.</p><div class="map-step"><i>1</i><div><strong>Basket reserved</strong><span>All six ingredients are available</span></div></div><div class="map-step"><i>2</i><div><strong>Freshness check</strong><span>Dairy expiry validated before pickup</span></div></div><div class="map-step"><i>3</i><div><strong>Doorstep delivery</strong><span>Tomorrow, 12:30–14:00</span></div></div></article>',
      '<article class="card"><small>BACKGROUND DECISION</small><h3>Why not the cheapest route?</h3><p>DealFinder would save 7.73 PLN, but its seller data is hidden behind a CAPTCHA. Zip Zap Sold keeps the user safe by refusing unverifiable automation.</p></article></aside></div></section>'
    ].join("");
  }

  function renderFavourites() {
    const cards = [
      ["FreshMart", "Primary grocery partner", "Trusted store · home delivery", "★"],
      ["EkstraMarket", "Trusted backup", "Earlier slots when timing matters", "✦"],
      ["Classic baked cheesecake", "Saved purchase pattern", "Ingredients and quantities ready", "⌁"]
    ].map((item) => '<article class="card favourite-card"><span class="favourite-mark">' + item[3] + '</span><h3>' + item[0] + '</h3><p>' + item[1] + '<br />' + item[2] + '</p><footer><span>Saved preference</span><button data-favourite="' + item[0] + '">Remove</button></footer></article>').join("");
    content.innerHTML = [
      '<section class="workspace-view"><header class="view-intro"><div><small>FAVOURITES</small><h2>The agent remembers what Helena trusts.</h2></div><p>Favourites are not advertisements. They are buyer-side preferences that influence ranking while still allowing better options to win.</p></header>',
      '<div class="favourites-grid">', cards, '<button id="addFavourite" class="favourite-add"><i>+</i> Add a trusted store</button></div>',
      '<section class="preference-strip"><div><h3>Preference in action</h3><p>FreshMart receives a trust and familiarity boost in every grocery search, but it cannot bypass Helena’s spending or safety rules.</p></div><button id="showMission">See it in the mission →</button></section></section>'
    ].join("");
    document.querySelectorAll("[data-favourite]").forEach((button) => button.addEventListener("click", () => { toast(button.dataset.favourite + " removed from this demo profile."); }));
    document.querySelector("#addFavourite").addEventListener("click", () => toast("In a real account, Helena can add a shop after a successful purchase."));
    document.querySelector("#showMission").addEventListener("click", () => setView("mission"));
  }

  function persistPreferences() {
    localStorage.setItem("zip-zap-sold-demo-preferences", JSON.stringify({ autoLimit: state.autoLimit, rules: state.rules, favourites: state.favourites }));
    d.user.rules[0][1] = "Buy automatically up to " + state.autoLimit + " PLN";
    autonomy.textContent = "Auto-buy ≤ " + state.autoLimit + " PLN";
  }

  function renderAutonomy() {
    const checked = (name) => state.rules[name] ? "checked" : "";
    content.innerHTML = [
      '<section class="workspace-view"><header class="view-intro"><div><small>AGENT AUTONOMY</small><h2>Helena chooses where the agent stops.</h2></div><p>These rules transform a generic shopping assistant into a trusted buyer-side agent. They persist only in this browser demo.</p></header>',
      '<div class="autonomy-layout"><article class="card autonomy-card"><small>SPENDING AUTHORITY</small><h3>Automatic grocery purchases</h3><p>Zip Zap Sold may complete a trusted grocery basket without interrupting Helena only below this limit.</p>',
      '<section class="limit-control"><div class="limit-top"><div><span>Current automatic limit</span><strong id="autoLimitValue">' + state.autoLimit + ' PLN</strong></div><span>Hard budget remains 80 PLN</span></div><input id="autoLimitSlider" type="range" min="40" max="80" step="1" value="' + state.autoLimit + '" /><div class="limit-scale"><span>40 PLN</span><span>60 PLN</span><span>80 PLN</span></div></section>',
      '<label class="rule-switch"><span><strong>Ask when a substitute is needed</strong><span>Helena confirms a changed ingredient.</span></span><b class="switch"><input data-rule="substitutions" type="checkbox" ' + checked("substitutions") + ' /><i></i></b></label>',
      '<label class="rule-switch"><span><strong>Block unknown sellers</strong><span>Never auto-buy when trust cannot be verified.</span></span><b class="switch"><input data-rule="unknownSeller" type="checkbox" ' + checked("unknownSeller") + ' /><i></i></b></label>',
      '<label class="rule-switch"><span><strong>Call if delivery changes</strong><span>Protect the promised time window.</span></span><b class="switch"><input data-rule="deliveryChange" type="checkbox" ' + checked("deliveryChange") + ' /><i></i></b></label>',
      '<button id="saveAutonomy" class="save-autonomy">Save Helena’s autonomy rules</button></article>',
      '<aside class="autonomy-side"><article class="card autonomy-preview"><small>WHAT ZIP ZAP SOLD CAN DO NOW</small><h3>Buy, call or stop.</h3><ul><li>Auto-buy trusted baskets up to ' + state.autoLimit + ' PLN.</li><li>Call Helena for a permitted exception.</li><li class="block">Stop when seller evidence cannot be verified.</li></ul></article><article class="card"><small>IMPACT ON THIS MISSION</small><h3>EkstraMarket is 65.78 PLN</h3><p>' + (state.autoLimit >= 66 ? "It now falls within Helena’s automatic limit, so the agent can proceed without a call." : "It remains above Helena’s automatic limit, so the agent calls before checkout.") + '</p><div class="policy-event"><b>Current policy</b><span>' + (state.autoLimit >= 66 ? "Automatic checkout is allowed." : "Human confirmation is required.") + '</span></div></article></aside></div></section>'
    ].join("");
    document.querySelector("#autoLimitSlider").addEventListener("input", (event) => { state.autoLimit = Number(event.target.value); document.querySelector("#autoLimitValue").textContent = state.autoLimit + " PLN"; document.querySelector(".autonomy-preview li").textContent = "Auto-buy trusted baskets up to " + state.autoLimit + " PLN."; });
    document.querySelectorAll("[data-rule]").forEach((input) => input.addEventListener("change", () => { state.rules[input.dataset.rule] = input.checked; }));
    document.querySelector("#saveAutonomy").addEventListener("click", () => { persistPreferences(); toast("Helena’s autonomy rules were saved in this browser."); renderAutonomy(); });
  }

  function render() { ({ understand, discover, decide, approve, purchase, track, resolve })[state.stage](); }

  function speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = .98; u.pitch = 1.04;
    const voice = speechSynthesis.getVoices().find((v) => /^en/i.test(v.lang) && /zira|aria|samantha|female/i.test(v.name)); if (voice) u.voice = voice; speechSynthesis.speak(u);
  }
  function openPhone() { incoming.classList.remove("hidden"); liveCall.classList.add("hidden"); phone.classList.add("open"); phone.setAttribute("aria-hidden", "false"); }
  function closePhone() { phone.classList.remove("open"); phone.setAttribute("aria-hidden", "true"); if (window.speechSynthesis) window.speechSynthesis.cancel(); }
  function answer() {
    incoming.classList.add("hidden"); liveCall.classList.remove("hidden");
    const isRisk = state.chosen === "deal";
    const text = isRisk ? "Helena, I found a cheaper basket, but I cannot verify the seller or its fresh-food policy. I recommend the trusted FreshMart basket for 64 zloty and 23 groszy. Shall I use that instead?" : "Helena, I found a trusted cheesecake basket that arrives tomorrow morning. It costs 65 zloty and 78 groszy, which is 1 zloty and 55 groszy above your usual limit. May I buy it?";
    script.textContent = text; callOptions.innerHTML = isRisk ? `<button data-call="yes">“Yes, use the trusted FreshMart basket.”</button><button data-call="why">“Why can’t you use the cheaper one?”</button><button data-call="wait">“Wait for my decision.”</button>` : `<button data-call="yes">“Yes, buy the faster basket.”</button><button data-call="why">“Why is it more expensive?”</button><button data-call="wait">“Wait for my decision.”</button>`;
    callOptions.querySelectorAll("[data-call]").forEach((b) => b.addEventListener("click", () => callChoice(b.dataset.call))); speak(text);
  }
  function callChoice(choice) {
    const isRisk = state.chosen === "deal";
    if (choice === "yes") { if (isRisk) state.chosen = "fresh"; state.approved = true; closePhone(); toast(`Helena approved the ${isRisk ? "trusted FreshMart" : "faster trusted"} basket by phone.`); setStage("purchase"); return; }
    if (choice === "why") { const text = isRisk ? "The merchant has a low trust score and its product data is blocked by a CAPTCHA. I cannot verify stock, freshness or its return policy, so I will not automate that purchase." : "It includes an earlier verified delivery slot. FreshMart is cheaper, but it will arrive later. Both stores are trusted."; script.textContent = text; callOptions.innerHTML = `<button data-call="yes">“${isRisk ? "Use the trusted FreshMart basket." : "Choose the faster basket."}”</button><button data-call="wait">“Wait for my decision.”</button>`; callOptions.querySelectorAll("[data-call]").forEach((b) => b.addEventListener("click", () => callChoice(b.dataset.call))); speak(text); return; }
    script.textContent = "Of course. I will hold both baskets and call again before the delivery slot expires."; callOptions.innerHTML = `<button data-call="yes">“Actually, choose the faster basket.”</button>`; callOptions.querySelector("[data-call]").addEventListener("click", () => callChoice("yes")); speak(script.textContent);
  }
  function openProfile() { document.querySelector("#profileRules").innerHTML = d.user.rules.map((r) => `<article class="rule"><small>${r[0]}</small><strong>${r[1]}</strong></article>`).join(""); const modal = document.querySelector("#profileModal"); modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); }
  function closeProfile() { const modal = document.querySelector("#profileModal"); modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
  function reset() { Object.assign(state, { stage: "understand", answers: {}, chosen: "fresh", approved: false, bought: false, feedback: null }); setStage("understand"); toast("Demo reset. Start with Helena’s voice request."); }
  const accountKey = "zip-zap-sold-demo-account";
  let account = JSON.parse(localStorage.getItem(accountKey) || "null");
  const accountModal = document.querySelector("#accountModal");
  const accountForm = document.querySelector("#accountForm");
  const accountButton = document.querySelector("#openAccount");
  let accountMode = "signup";
  function openAccount() { renderAccount(); accountModal.classList.add("open"); accountModal.setAttribute("aria-hidden", "false"); }
  function closeAccount() { accountModal.classList.remove("open"); accountModal.setAttribute("aria-hidden", "true"); }
  function setAccountMode(mode) { accountMode = mode; document.querySelectorAll("[data-account-mode]").forEach((button) => button.classList.toggle("active", button.dataset.accountMode === mode)); document.querySelector("#nameField").classList.toggle("hidden", mode === "login"); document.querySelector("#accountName").required = mode === "signup"; document.querySelector("#accountSubmit").textContent = mode === "signup" ? "Create my account" : "Log in"; document.querySelector("#accountPassword").autocomplete = mode === "signup" ? "new-password" : "current-password"; }
  function renderAccount() { const signedIn = Boolean(account); accountButton.textContent = signedIn ? `Account · ${account.name.split(" ")[0]}` : "Log in"; accountForm.classList.toggle("hidden", signedIn); document.querySelector(".account-tabs").classList.toggle("hidden", signedIn); document.querySelector("#accountSummary").classList.toggle("hidden", !signedIn); if (signedIn) { document.querySelector("#savedAccountName").textContent = account.name; document.querySelector("#savedAccountEmail").textContent = account.email; } else { setAccountMode(accountMode); } }
  function saveAccount(event) { event.preventDefault(); const data = new FormData(accountForm); const email = data.get("email").trim(); const saved = JSON.parse(localStorage.getItem(accountKey) || "null"); const fallbackName = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); account = accountMode === "login" && saved?.email === email ? saved : { name: accountMode === "login" ? fallbackName : data.get("name").trim(), email }; localStorage.setItem(accountKey, JSON.stringify(account)); renderAccount(); closeAccount(); toast(`Welcome${accountMode === "login" ? " back" : ""}, ${account.name.split(" ")[0]}. Your agent profile is ready.`); }
  function logoutAccount() { localStorage.removeItem(accountKey); account = null; renderAccount(); toast("You are logged out on this browser."); }

  document.querySelector("#callMaria").addEventListener("click", openPhone); document.querySelector("#answer").addEventListener("click", answer); document.querySelector("#hangUp").addEventListener("click", closePhone); document.querySelector("#repeat").addEventListener("click", () => speak(script.textContent)); document.querySelectorAll("[data-close-phone]").forEach((b) => b.addEventListener("click", closePhone)); document.querySelector("#openProfile").addEventListener("click", openProfile); document.querySelectorAll("[data-close-profile]").forEach((b) => b.addEventListener("click", closeProfile)); document.querySelector("#reset").addEventListener("click", reset); document.querySelector("#startAgent").addEventListener("click", () => { reset(); toast("Your agent is ready. Answer three quick questions to begin discovery."); }); document.querySelector("#openAccount").addEventListener("click", openAccount); document.querySelectorAll("[data-close-account]").forEach((b) => b.addEventListener("click", closeAccount)); document.querySelectorAll("[data-account-mode]").forEach((b) => b.addEventListener("click", () => setAccountMode(b.dataset.accountMode))); accountForm.addEventListener("submit", saveAccount); document.querySelector("#logoutAccount").addEventListener("click", logoutAccount); document.querySelector("#editAccount").addEventListener("click", () => { account = null; localStorage.removeItem(accountKey); renderAccount(); setAccountMode("signup"); }); document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closePhone(); closeProfile(); closeAccount(); } });
  document.querySelectorAll(".workspace-tabs [data-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  renderAccount(); renderJourney(); renderWorkspace();
})();
