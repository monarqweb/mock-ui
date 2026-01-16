export const INTENT_DEFINITIONS = {
  introduce_brand: {
    label: "Introduce brand",
    description:
      "Establishes who the company or organization is, what it stands for, and the high-level promise it makes. Optimized for first impressions and positioning rather than immediate conversion.",
    examples: [
      "Meet Chrysalis",
      "Design systems, delivered",
      "A better way to build UI",
    ],
    anti_examples: ["Start free trial", "Request a demo", "Compare plans"],
    deprecated: false,
  },

  introduce_product: {
    label: "Introduce product",
    description:
      "Explains what the product is and what it does at a high level. Focuses on the product concept and core capabilities without going deep into steps, comparisons, or pricing.",
    examples: [
      "All-in-one project tracking",
      "AI summaries for every chat",
      "Your payments hub",
    ],
    anti_examples: [
      "How it works in 3 steps",
      "See pricing",
      "Get started now",
    ],
    deprecated: false,
  },

  position_value: {
    label: "Position value",
    description:
      "Communicates the primary value proposition and differentiation. Answers why this is better, different, or more desirable than alternatives, without necessarily naming competitors.",
    examples: [
      "Ship faster with composable blocks",
      "Less busywork, more output",
      "Enterprise security, consumer simplicity",
    ],
    anti_examples: [
      "Step 1, Step 2, Step 3",
      "FAQ: billing questions",
      "Trusted by 10,000 teams",
    ],
    deprecated: false,
  },

  announce_update: {
    label: "Announce update",
    description:
      "Highlights a new feature, product launch, change, or timely announcement. Optimized for novelty, clarity, and directing attention to what’s new.",
    examples: [
      "Now available: Automated releases",
      "Introducing Blocks",
      "New: Team workspaces",
    ],
    anti_examples: [
      "Our mission and values",
      "Compare Basic vs Pro",
      "Enter your email to subscribe",
    ],
    deprecated: false,
  },

  educate: {
    label: "Educate",
    description:
      "Explains a concept, context, or set of ideas to help the user understand what something is and why it matters. Typically informational and narrative, not step-by-step.",
    examples: [
      "What is RAG?",
      "Why design systems accelerate teams",
      "Understanding donor-advised funds",
    ],
    anti_examples: [
      "3 steps to get started",
      "Start your free trial",
      "Plans and pricing table",
    ],
    deprecated: false,
  },

  explain_process: {
    label: "Explain process",
    description:
      "Explains how something works in ordered steps. Emphasizes sequence, stages, or a workflow the user follows, often with numbered steps or a timeline.",
    examples: [
      "How it works",
      "Get started in 3 steps",
      "From signup to launch",
    ],
    anti_examples: [
      "What is this product?",
      "Trusted by these teams",
      "FAQ: account security",
    ],
    deprecated: false,
  },

  compare_options: {
    label: "Compare options",
    description:
      "Helps users evaluate choices by comparing plans, tiers, products, approaches, or alternatives. Often uses side-by-side layouts, tables, or structured contrasts.",
    examples: [
      "Free vs Pro",
      "Plan comparison",
      "Self-serve vs Sales-assisted",
    ],
    anti_examples: [
      "Our story",
      "How it works in steps",
      "Customer testimonials",
    ],
    deprecated: false,
  },

  answer_questions: {
    label: "Answer questions",
    description:
      "Addresses common questions or uncertainties to reduce confusion and unblock a decision. Typically formatted as FAQ, accordion, or short Q&A content.",
    examples: [
      "Frequently asked questions",
      "Billing questions",
      "Security and compliance FAQs",
    ],
    anti_examples: [
      "Start a trial",
      "Side-by-side plan comparison",
      "Our mission statement",
    ],
    deprecated: false,
  },

  build_trust: {
    label: "Build trust",
    description:
      "Strengthens credibility through proof signals such as testimonials, logos, case studies, press, stats, certifications, or social validation.",
    examples: [
      "Trusted by leading teams",
      "Used by 10,000+ companies",
      "Customer stories",
    ],
    anti_examples: [
      "How it works in 3 steps",
      "Pick a plan",
      "Enter your email",
    ],
    deprecated: false,
  },

  reduce_risk: {
    label: "Reduce risk",
    description:
      "Lowers perceived risk by addressing objections and safeguards such as guarantees, security posture, privacy, refunds, no-credit-card claims, or implementation support.",
    examples: ["No credit card required", "Cancel anytime", "SOC 2 compliant"],
    anti_examples: ["Our origin story", "Feature tour", "Compare plans table"],
    deprecated: false,
  },

  validate_choice: {
    label: "Validate choice",
    description:
      "Reassures users who are already leaning yes, reinforcing that they’re making a smart decision. Common near pricing, checkout, or post-CTA moments.",
    examples: [
      "You’re in good company",
      "What happens next",
      "Join teams like yours",
    ],
    anti_examples: [
      "What is this product?",
      "How it works step-by-step",
      "Browse our blog",
    ],
    deprecated: false,
  },

  conversion_push: {
    label: "Conversion push",
    description:
      "Drives a high-intent action with a prominent call-to-action. Optimized to move the user from interest to action quickly, often with strong copy and minimal distraction.",
    examples: ["Start free trial", "Request a demo", "Create your account"],
    anti_examples: [
      "Learn about our mission",
      "FAQ: what is X?",
      "Read the documentation",
    ],
    deprecated: false,
  },

  lead_capture: {
    label: "Lead capture",
    description:
      "Collects user information for follow-up or nurturing, such as email signup, waitlist, demo request, or newsletter. The form is the primary interaction.",
    examples: ["Join the waitlist", "Get product updates", "Request a demo"],
    anti_examples: ["Buy now", "Add to cart", "See plan comparison"],
    deprecated: false,
  },

  purchase_prompt: {
    label: "Purchase prompt",
    description:
      "Encourages an immediate transaction or checkout-oriented action. Typically includes pricing, urgency, or product selection context.",
    examples: ["Buy now", "Add to cart", "Checkout"],
    anti_examples: ["Request a demo", "Read the docs", "Our story"],
    deprecated: false,
  },

  upsell_cross_sell: {
    label: "Upsell or cross-sell",
    description:
      "Encourages an existing user or buyer to add upgrades, higher tiers, add-ons, or complementary items. Often appears inside product flows or post-purchase areas.",
    examples: ["Upgrade to Pro", "Add team seats", "Bundle and save"],
    anti_examples: [
      "What is this product?",
      "How it works",
      "Join the newsletter",
    ],
    deprecated: false,
  },

  onboarding: {
    label: "Onboarding",
    description:
      "Guides first-time users through initial context and setup. Focuses on orientation, first steps, and reducing early confusion.",
    examples: [
      "Welcome, here’s how to begin",
      "Set up your workspace",
      "Invite your team",
    ],
    anti_examples: ["Buy now", "Press logos", "Compare pricing tiers"],
    deprecated: false,
  },

  activation: {
    label: "Activation",
    description:
      "Moves users toward a key first-value moment by prompting a specific action that correlates with retention. More action-oriented than onboarding.",
    examples: [
      "Create your first project",
      "Connect your account",
      "Import your contacts",
    ],
    anti_examples: ["Our mission", "FAQ list", "Case studies carousel"],
    deprecated: false,
  },

  retention: {
    label: "Retention",
    description:
      "Encourages ongoing engagement and repeated usage. Reinforces habits, highlights value over time, and prompts continued interaction.",
    examples: [
      "Keep your streak going",
      "See what you missed",
      "Weekly summary",
    ],
    anti_examples: ["Start trial", "Pricing comparison", "Brand introduction"],
    deprecated: false,
  },

  reengagement: {
    label: "Re-engagement",
    description:
      "Brings inactive or drifting users back by reminding them of value, showing what changed, or offering a clear next step to return.",
    examples: [
      "Come back to your workspace",
      "You missed updates",
      "New since you last visited",
    ],
    anti_examples: [
      "Plans and pricing table",
      "Company mission",
      "What is this product?",
    ],
    deprecated: false,
  },

  orient_user: {
    label: "Orient user",
    description:
      "Helps the user understand where they are, what this page or section is about, and how content is organized. Focused on clarity and wayfinding.",
    examples: ["Documentation overview", "Explore categories", "Browse topics"],
    anti_examples: ["Start free trial", "Buy now", "3 steps to get started"],
    deprecated: false,
  },

  route_user: {
    label: "Route user",
    description:
      "Directs users to the correct destination or next path, often through navigation, links, filters, or choices. Focused on routing rather than persuasion.",
    examples: ["Choose your path", "Find a template", "Browse listings"],
    anti_examples: [
      "Our mission statement",
      "Case study quote",
      "Feature deep dive",
    ],
    deprecated: false,
  },
} as const
