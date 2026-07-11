(() => {
  // The named records below are the source of truth. The legacy aliases at the
  // end keep the existing presentation app working while it is simplified.
  const person = {
    firstName: "Helena",
    fullName: "Helena Kowalska",
    initials: "H",
    age: 76,
    phone: "+48 555 010 222",
    home: {
      address: "Kwiatowa 12, Kraków",
      city: "Kraków"
    },
    preferences: {
      automaticPurchaseLimit: 65,
      deliveryPreference: "At home tomorrow before 15:00",
      priority: "Freshness and certainty before a small saving",
      trustedVendorIds: ["fresh", "extra"],
      contactMethod: "Voice call, then in-app or SMS",
      blockUnknownSellers: true
    }
  };

  const recipe = {
    id: "classic-baked-cheesecake",
    title: "Classic baked cheesecake",
    servings: 8,
    voiceRequest: "Zip Zap Sold, I want to bake a cheesecake tomorrow for eight people. Buy quark cheese, eggs, butter, cream, pudding and biscuits.",
    delivery: "Tomorrow, 12:30–14:00",
    questions: [
      {
        id: "recipe",
        prompt: "Should it be a classic baked cheesecake?",
        help: "Zip Zap Sold needs the recipe type to build the right basket.",
        choices: ["Classic baked", "No-bake cheesecake"]
      },
      {
        id: "pantry",
        prompt: "Do you already have sugar and vanilla sugar?",
        help: "We will only buy what Helena actually needs.",
        choices: ["I already have both", "Please add both"]
      },
      {
        id: "delivery",
        prompt: "When should delivery arrive?",
        help: "Helena's profile already prefers delivery to her home.",
        choices: ["Tomorrow before 15:00", "Saturday before 18:00"]
      }
    ],
    ingredients: [
      { name: "Twaróg sernikowy", amount: "1 kg", price: 18.99 },
      { name: "Eggs", amount: "10 pcs", price: 9.99 },
      { name: "Butter", amount: "200 g", price: 9.49 },
      { name: "Cream 30%", amount: "330 ml", price: 7.49 },
      { name: "Vanilla pudding", amount: "40 g", price: 2.29 },
      { name: "Digestive biscuits", amount: "200 g", price: 5.99 }
    ]
  };

  const vendors = [
    {
      id: "fresh",
      name: "FreshMart",
      relationship: "Helena's trusted store",
      trusted: true,
      visibleByDefault: true,
      total: 64.23,
      basketTotal: 54.24,
      deliveryFee: 9.99,
      delivery: "Tomorrow, 12:30–14:00",
      availability: "All 6 items available",
      trust: 96,
      fit: 98,
      evidence: 98,
      status: "Verified",
      tone: "safe",
      reason: "Everything is available in one trusted delivery.",
      tags: ["Under auto-buy cap", "Fresh dairy", "One delivery"],
      recommended: true,
      mapRole: "chosen"
    },
    {
      id: "extra",
      name: "EkstraMarket",
      relationship: "Trusted backup",
      trusted: true,
      visibleByDefault: true,
      total: 65.78,
      basketTotal: 55.79,
      deliveryFee: 9.99,
      delivery: "Tomorrow, 10:00–12:00",
      availability: "All 6 items available",
      trust: 93,
      fit: 94,
      evidence: 96,
      status: "Approval needed",
      tone: "warn",
      reason: "It arrives earlier, but costs 1.55 PLN more.",
      tags: ["Earlier delivery", "1.55 PLN above cap", "Trusted"],
      needsApproval: true,
      mapRole: "backup"
    },
    {
      id: "deal",
      name: "DealFinder",
      relationship: "Unverified marketplace seller",
      trusted: false,
      visibleByDefault: false,
      total: 56.5,
      basketTotal: 52,
      deliveryFee: 4.5,
      delivery: "Tomorrow, 14:00–18:00",
      availability: "Seller data cannot be verified",
      trust: 54,
      fit: 76,
      evidence: 42,
      status: "Blocked",
      tone: "risk",
      reason: "The agent cannot verify this seller, so it will not buy here.",
      tags: ["Save 7.73 PLN", "New seller", "Data unverified"],
      blocked: true,
      mapRole: "blocked"
    }
  ];

  const call = {
    callerName: "Zip Zap Sold",
    purpose: "Ask only when Helena's rule needs an answer.",
    scenarios: {
      earlierDelivery: {
        id: "earlier-delivery",
        vendorId: "extra",
        title: "A quick question",
        prompt: "Hello Helena. EkstraMarket can deliver two hours earlier for 1.55 PLN more. Would you like the earlier delivery?",
        choices: [
          { id: "approve", label: "Yes, choose earlier delivery" },
          { id: "keep", label: "No, keep my usual delivery" },
          { id: "wait", label: "I will decide later" }
        ]
      },
      unverifiedSeller: {
        id: "unverified-seller",
        vendorId: "deal",
        title: "Safety check",
        prompt: "Hello Helena. I found a cheaper basket, but I cannot verify the seller. Shall I use your trusted FreshMart store instead?",
        choices: [
          { id: "use-trusted", label: "Yes, use FreshMart" },
          { id: "wait", label: "I will decide later" }
        ]
      },
      flourAlternative: {
        id: "flour-alternative",
        vendorId: "fresh",
        title: "Flour substitution",
        prompt: "Hello again, my dear. I’m afraid your favourite flour is currently unavailable at your usual shop. However, I can recommend a lovely alternative—fine all-purpose flour. I’m sure it will make your cheesecake just as smooth, delicate, and delicious. Would you like me to order it for you?",
        choices: [
          { id: "approve", label: "Yes, please. That sounds wonderful." },
          { id: "wait", label: "No, wait for my usual flour" }
        ]
      }
    }
  };

  const researchAgents = [
    { icon: "✦", name: "Freshness agent", description: "Checks expiry, stock and delivery slots", color: "coral", status: "✓" },
    { icon: "↘", name: "Value agent", description: "Compares total basket prices and fees", color: "lime", status: "✓" },
    { icon: "⌾", name: "Trust agent", description: "Checks merchant reliability and policies", color: "violet", status: "!" }
  ];

  const decisionWeights = [
    { label: "Freshness & quality", value: 35, color: "#dc8064" },
    { label: "Reliable delivery", value: 30, color: "#776be6" },
    { label: "Merchant trust", value: 20, color: "#148276" },
    { label: "Price", value: 15, color: "#d5aa32" }
  ];

  const recommendedVendor = vendors.find((vendor) => vendor.recommended);
  const trustedVendorNames = person.preferences.trustedVendorIds
    .map((vendorId) => vendors.find((vendor) => vendor.id === vendorId)?.name)
    .filter(Boolean);

  window.ZIP_ZAP_SOLD_DEMO = {
    person,
    recipe,
    vendors,
    call,
    researchAgents,
    decisionWeights,

    // Compatibility aliases for the current app.js implementation.
    user: {
      name: person.fullName,
      initials: person.initials,
      age: person.age,
      phone: person.phone,
      rules: [
        ["Routine grocery basket", `Buy automatically up to ${person.preferences.automaticPurchaseLimit} PLN`],
        ["Unknown seller", person.preferences.blockUnknownSellers ? "Always call Helena" : "Do not buy automatically"],
        ["Delivery", person.preferences.deliveryPreference],
        ["Priority", person.preferences.priority],
        ["Preferred stores", `${trustedVendorNames[0]}, then ${trustedVendorNames[1]}`],
        ["Contact", person.preferences.contactMethod]
      ]
    },
    request: {
      text: recipe.voiceRequest,
      questions: recipe.questions.map((question) => [question.id, question.prompt, question.help, question.choices])
    },
    ingredients: recipe.ingredients.map((ingredient) => [ingredient.name, ingredient.amount, `${ingredient.price.toFixed(2)} PLN`]),
    offers: vendors.map((vendor) => ({
      id: vendor.id,
      store: vendor.name,
      label: vendor.relationship,
      total: vendor.total,
      items: vendor.basketTotal,
      fee: vendor.deliveryFee,
      eta: vendor.delivery,
      trust: vendor.trust,
      fit: vendor.fit,
      evidence: vendor.evidence,
      status: vendor.status,
      tone: vendor.tone,
      stock: vendor.availability,
      tags: vendor.tags,
      recommended: Boolean(vendor.recommended)
    })),
    weights: decisionWeights.map((weight) => [weight.label, weight.value, weight.color]),
    order: {
      id: "ZZS-20483",
      total: recommendedVendor.total,
      delivery: recipe.delivery,
      address: person.home.address
    }
  };

  // app.js reads this tuple-shaped property today; expose it after named agents.
  window.ZIP_ZAP_SOLD_DEMO.agents = researchAgents.map((agent) => [agent.icon, agent.name, agent.description, agent.color, agent.status]);
})();
