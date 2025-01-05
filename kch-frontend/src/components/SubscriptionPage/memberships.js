const memberships = [
  {
    id: "trial",
    title: "Starter",
    pricing: [{ amount: "9.99", period: "month" }],
    description:
      "Access to Ford & GM keycodes. Basic VIN lookup capabilities. Ticket support during business hours and some premium features.",
    features: [
      { text: "3 key codes/month" },
      { text: "Access to manufacturers: Ford & GM (1989-2018 models)" },
      { text: "Basic VIN lookup capabilities" },
      { text: "Ticket-based support during business hours (8 AM - 6 PM EST)" },
      { text: "Introduction to premium features to demonstrate value" },
    ],
  },
  {
    id: "professional",
    title: "Professional",
    pricing: [
      { amount: "49.99", period: "month" },
      { amount: "139.00", period: "quarter" },
    ],
    description:
      "Access to additional manufacturers keycodes. Premium support after business hours. Advanced programming guides and more premium benefits.",
    features: [
      {
        text: "10 key codes/month with discounted additional codes ($10 per code)",
      },
      {
        text: "Expanded manufacturer access: Ford, Lincoln, GM, Nissan, Hyundai, Kia",
      },
      { text: "Premium support during extended hours (8 AM - 7 PM EST)" },
      {
        text: "Access to advanced programming guides and VIN-to-key insights.",
      },
      { text: "Real-time notifications for keycode requests" },
      { text: "Downloadable programming and troubleshooting resources" },
      { text: "New Feature: Early access to updates and features" },
    ],
  },
  {
    id: "ultimate",
    title: "Ultimate",
    pricing: [{ amount: "179.00", period: "year" }, { setupFee: "49.00" }],
    description:
      "Unlimited access to all manufacturer keycodes. 24/7 support. Comprehensive programming resources and exclusive benefits.",
    features: [
      { text: "Unlimited key codes/month across all manufacturers" },
      { text: "Full access: Toyota, Lexus, Acura, BMW, Subaru, Chrysler" },
      { text: "24/7 keycode retrieval for emergencies" },
      { text: "Dedicated account manager for personalized support" },
      { text: "Live chat and phone support (7 PM - 11 PM EST)" },
      { text: "Comprehensive Tech Knowledge Database access" },
    ],
    perks: [
      { text: "1:1 consultations (up to 2 sessions per year)" },
      { text: "Exclusive member-only webinars" },
      { text: "Early access to beta features" },
      { text: "Discounted rates on premium tools" },
    ],
  },
];

export default memberships;
