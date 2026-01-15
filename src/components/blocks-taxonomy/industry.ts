export const INDUSTRY_DEFINITIONS = {
  saas: {
    label: "SaaS",
    description:
      "Software delivered via subscription and accessed over the internet. Emphasizes onboarding, feature value, retention, and recurring conversion patterns.",
    examples: [
      "Project management tools",
      "CRM platforms",
      "Design systems",
      "Analytics dashboards",
    ],
    anti_examples: [
      "Physical retail storefronts",
      "One-time digital downloads",
      "Property listings",
    ],
    deprecated: false,
  },

  ecommerce: {
    label: "E-commerce",
    description:
      "Online retail experiences focused on browsing, selecting, and purchasing physical or digital products. Emphasizes product discovery, pricing, and checkout flows.",
    examples: [
      "Product grids",
      "Shopping carts",
      "Checkout pages",
      "Product detail pages",
    ],
    anti_examples: [
      "Subscription software onboarding",
      "Lead generation forms",
      "Editorial content hubs",
    ],
    deprecated: false,
  },

  marketplace: {
    label: "Marketplace",
    description:
      "Platforms that connect multiple buyers and sellers or service providers. Emphasizes discovery, comparison, trust, and facilitation of transactions between parties.",
    examples: [
      "Two-sided platforms",
      "Service directories",
      "Vendor listings",
      "Peer-to-peer selling",
    ],
    anti_examples: [
      "Single-vendor storefronts",
      "Internal enterprise tools",
      "Static marketing sites",
    ],
    deprecated: false,
  },

  fintech: {
    label: "Fintech",
    description:
      "Financial technology products handling payments, money management, investing, lending, or compliance. Emphasizes trust, security, accuracy, and regulatory clarity.",
    examples: [
      "Banking apps",
      "Payment processors",
      "Investment platforms",
      "Expense management tools",
    ],
    anti_examples: [
      "Content-only sites",
      "Creative portfolios",
      "Hospitality booking systems",
    ],
    deprecated: false,
  },

  healthcare: {
    label: "Healthcare",
    description:
      "Products and services related to medical care, wellness, patient management, or health data. Emphasizes clarity, privacy, accessibility, and regulatory compliance.",
    examples: [
      "Patient portals",
      "Appointment scheduling",
      "Telehealth platforms",
      "Health dashboards",
    ],
    anti_examples: [
      "Retail product catalogs",
      "Entertainment media",
      "Real estate listings",
    ],
    deprecated: false,
  },

  education: {
    label: "Education",
    description:
      "Learning-focused platforms for teaching, training, or knowledge delivery. Emphasizes progression, comprehension, and learner engagement.",
    examples: [
      "Learning management systems",
      "Online courses",
      "Tutorial platforms",
      "Educational dashboards",
    ],
    anti_examples: [
      "Checkout-heavy retail sites",
      "Financial trading apps",
      "Property search tools",
    ],
    deprecated: false,
  },

  enterprise: {
    label: "Enterprise",
    description:
      "Software and services designed for large organizations with complex needs. Emphasizes scalability, security, customization, and stakeholder alignment.",
    examples: [
      "Enterprise dashboards",
      "Admin panels",
      "Role-based access systems",
      "Compliance tooling",
    ],
    anti_examples: [
      "Single-user consumer apps",
      "Casual content sites",
      "Small business storefronts",
    ],
    deprecated: false,
  },

  consumer: {
    label: "Consumer",
    description:
      "Products built for individual end users rather than organizations. Emphasizes usability, clarity, emotional appeal, and ease of use.",
    examples: [
      "Mobile apps",
      "Personal productivity tools",
      "Lifestyle platforms",
      "Entertainment apps",
    ],
    anti_examples: [
      "Enterprise admin tools",
      "B2B procurement systems",
      "Compliance-heavy platforms",
    ],
    deprecated: false,
  },

  developer_tools: {
    label: "Developer tools",
    description:
      "Products built primarily for software developers. Emphasizes documentation, configuration, extensibility, and technical clarity.",
    examples: [
      "CLI tools",
      "APIs and SDKs",
      "Component libraries",
      "Infrastructure dashboards",
    ],
    anti_examples: [
      "Marketing landing pages",
      "Retail checkout flows",
      "Content publishing platforms",
    ],
    deprecated: false,
  },

  media: {
    label: "Media",
    description:
      "Content-driven platforms focused on publishing, consumption, and discovery of articles, videos, audio, or interactive media.",
    examples: [
      "News sites",
      "Streaming platforms",
      "Blogs and magazines",
      "Podcast networks",
    ],
    anti_examples: [
      "Transactional checkout flows",
      "Enterprise dashboards",
      "Property management tools",
    ],
    deprecated: false,
  },

  nonprofit: {
    label: "Nonprofit",
    description:
      "Organizations focused on social impact rather than profit. Emphasizes storytelling, trust, transparency, and calls to action such as donations or volunteering.",
    examples: [
      "Donation pages",
      "Impact reports",
      "Volunteer signups",
      "Campaign landing pages",
    ],
    anti_examples: [
      "Product upsell flows",
      "Subscription management tools",
      "Retail catalogs",
    ],
    deprecated: false,
  },

  government: {
    label: "Government",
    description:
      "Public-sector services and information platforms. Emphasizes accessibility, clarity, compliance, and service delivery at scale.",
    examples: [
      "Public service portals",
      "Permit applications",
      "Information directories",
      "Civic dashboards",
    ],
    anti_examples: [
      "Brand marketing sites",
      "E-commerce storefronts",
      "Social entertainment apps",
    ],
    deprecated: false,
  },

  real_estate: {
    label: "Real estate",
    description:
      "Platforms related to buying, selling, renting, or managing property. Emphasizes search, filtering, location data, and listings.",
    examples: [
      "Property search tools",
      "Listing pages",
      "Agent profiles",
      "Map-based browsing",
    ],
    anti_examples: [
      "Subscription software onboarding",
      "Editorial media sites",
      "Retail checkout flows",
    ],
    deprecated: false,
  },

  hospitality: {
    label: "Hospitality",
    description:
      "Travel and accommodation experiences such as hotels, resorts, and short-term rentals. Emphasizes booking, availability, amenities, and guest experience.",
    examples: [
      "Hotel booking flows",
      "Room galleries",
      "Reservation management",
      "Experience listings",
    ],
    anti_examples: [
      "Enterprise admin dashboards",
      "Software onboarding flows",
      "Financial trading platforms",
    ],
    deprecated: false,
  },

  professional_services: {
    label: "Professional services",
    description:
      "Service-based businesses offering expertise or consulting. Emphasizes credibility, process clarity, and lead generation.",
    examples: [
      "Consulting firm websites",
      "Service overview pages",
      "Case studies",
      "Contact and intake forms",
    ],
    anti_examples: [
      "Product comparison tables",
      "Marketplace listings",
      "Content-only media platforms",
    ],
    deprecated: false,
  },
} as const
