window.ZIP_ZAP_SOLD_DEMO = {
  user: {
    name: "Helena Kowalska", initials: "H", age: 76, phone: "+48 555 010 222",
    rules: [
      ["Routine grocery basket", "Buy automatically up to 65 PLN"],
      ["Unknown seller", "Always call Helena"],
      ["Delivery", "At home tomorrow before 15:00"],
      ["Priority", "Freshness and certainty before a small saving"],
      ["Preferred stores", "FreshMart, then EkstraMarket"],
      ["Contact", "Voice call, then in-app or SMS"]
    ]
  },
  request: {
    text: "Zip Zap Sold, I want to bake a cheesecake tomorrow for eight people. Buy quark cheese, eggs, butter, cream, pudding and biscuits.",
    questions: [
      ["recipe", "Should it be a classic baked cheesecake?", "Zip Zap Sold needs the recipe type to build the right basket.", ["Classic baked", "No-bake cheesecake"]],
      ["pantry", "Do you already have sugar and vanilla sugar?", "We will only buy what Helena actually needs.", ["I already have both", "Please add both"]],
      ["delivery", "When should delivery arrive?", "Helena’s profile already prefers a delivery to her home.", ["Tomorrow before 15:00", "Saturday before 18:00"]]
    ]
  },
  ingredients: [
    ["Twaróg sernikowy", "1 kg", "18.99 PLN"], ["Eggs", "10 pcs", "9.99 PLN"], ["Butter", "200 g", "9.49 PLN"],
    ["Cream 30%", "330 ml", "7.49 PLN"], ["Vanilla pudding", "40 g", "2.29 PLN"], ["Digestive biscuits", "200 g", "5.99 PLN"]
  ],
  agents: [
    ["✦", "Freshness agent", "Checks expiry, stock and delivery slots", "coral", "✓"],
    ["↘", "Value agent", "Compares total basket prices and fees", "lime", "✓"],
    ["⌾", "Trust agent", "Checks merchant reliability and policies", "violet", "!"]
  ],
  offers: [
    { id: "fresh", store: "FreshMart", label: "Helena’s saved store", total: 64.23, items: 54.24, fee: 9.99, eta: "Tomorrow, 12:30–14:00", trust: 96, fit: 98, evidence: 98, status: "Verified", tone: "safe", stock: "All 6 items available", tags: ["Under auto-buy cap", "Fresh dairy", "One delivery"], recommended: true },
    { id: "extra", store: "EkstraMarket", label: "Verified grocery partner", total: 65.78, items: 55.79, fee: 9.99, eta: "Tomorrow, 10:00–12:00", trust: 93, fit: 94, evidence: 96, status: "Approval needed", tone: "warn", stock: "All 6 items available", tags: ["Earlier delivery", "1.55 PLN above cap", "Trusted"] },
    { id: "deal", store: "DealFinder", label: "Marketplace seller", total: 56.50, items: 52.00, fee: 4.50, eta: "Tomorrow, 14:00–18:00", trust: 54, fit: 76, evidence: 42, status: "Blocked", tone: "risk", stock: "Store has a CAPTCHA", tags: ["Save 7.73 PLN", "New seller", "Data unverified"] }
  ],
  weights: [["Freshness & quality", 35, "#dc8064"], ["Reliable delivery", 30, "#776be6"], ["Merchant trust", 20, "#148276"], ["Price", 15, "#d5aa32"]],
  order: { id: "BOS-20483", total: 64.23, delivery: "Tomorrow, 12:30–14:00", address: "Kwiatowa 12, Kraków" }
};
