export const CATEGORY_DEFINITIONS = {
  hero: {
    label: "Hero",
    description:
      "Top-of-page introductory section that establishes context, value, and a primary action. Often includes headline, supporting copy, media, and CTAs.",
    examples: [
      "Centered hero with CTA",
      "Split hero with image",
      "Hero with signup form",
    ],
    anti_examples: ["Pricing table", "FAQ accordion", "Site footer"],
    deprecated: false,
  },

  navbar: {
    label: "Navbar",
    description:
      "Primary site navigation component, typically at the top of the page. Includes links, menus, branding, and sometimes a primary CTA.",
    examples: [
      "Top navigation with dropdowns",
      "Sticky navbar with CTA",
      "Mobile hamburger menu",
    ],
    anti_examples: [
      "Footer links",
      "In-page table of contents",
      "Pricing card grid",
    ],
    deprecated: false,
  },

  footer: {
    label: "Footer",
    description:
      "Bottom-of-page section for secondary navigation, legal links, contact info, and brand reinforcement. Often repeated across the site.",
    examples: [
      "Multi-column link footer",
      "Simple footer with legal",
      "Footer with newsletter signup",
    ],
    anti_examples: ["Top navigation", "Hero section", "Product grid"],
    deprecated: false,
  },

  cta: {
    label: "Call to action",
    description:
      "Focused section designed to drive a single next step. Typically short copy with a primary action, sometimes with supporting trust or reassurance.",
    examples: [
      "CTA band with button",
      "CTA with secondary link",
      "CTA with small form",
    ],
    anti_examples: [
      "Long-form education content",
      "Comparison table",
      "Full page hero",
    ],
    deprecated: false,
  },

  feature: {
    label: "Features",
    description:
      "Highlights product or service capabilities and benefits. Often presented as cards, grids, or sections with icons and short descriptions.",
    examples: [
      "3-up feature cards",
      "Feature list with icons",
      "Feature grid with screenshots",
    ],
    anti_examples: ["Testimonials carousel", "FAQ list", "Checkout form"],
    deprecated: false,
  },

  pricing: {
    label: "Pricing",
    description:
      "Displays plan or package options, pricing details, and included features. Often supports comparison and upgrade decisions.",
    examples: [
      "Plan cards",
      "Pricing table comparison",
      "Pricing with monthly/annual toggle",
    ],
    anti_examples: ["Blog list", "Team gallery", "Navbar"],
    deprecated: false,
  },

  testimonial: {
    label: "Testimonials",
    description:
      "Social proof content from customers or users. Often includes quotes, names, roles, company logos, and star ratings.",
    examples: [
      "Testimonial grid",
      "Quote carousel",
      "Review cards with ratings",
    ],
    anti_examples: ["Feature list", "FAQ accordion", "Contact form"],
    deprecated: false,
  },

  logos: {
    label: "Logo cloud",
    description:
      "Displays customer, partner, or press logos to build credibility. Often used near heroes, CTAs, or pricing.",
    examples: ["Trusted by logo row", "Press logos grid", "Partner logo strip"],
    anti_examples: ["Written case studies", "Pricing tables", "Checkout flow"],
    deprecated: false,
  },

  stats: {
    label: "Stats",
    description:
      "Key metrics or proof points presented as numbers. Often used to support credibility, impact, or performance claims.",
    examples: ["3-up metric tiles", "KPI strip", "Impact stats section"],
    anti_examples: ["FAQ", "Blog post body", "Authentication screens"],
    deprecated: false,
  },

  faq: {
    label: "FAQ",
    description:
      "Frequently asked questions to reduce uncertainty and unblock decisions. Typically accordion or list format.",
    examples: ["Accordion FAQ", "Two-column Q&A", "FAQ with categories"],
    anti_examples: ["Hero", "Pricing grid", "Logo cloud"],
    deprecated: false,
  },

  comparison: {
    label: "Comparison",
    description:
      "Side-by-side contrasts between plans, products, approaches, or alternatives. Often includes tables, checkmarks, and structured differences.",
    examples: [
      "Plan comparison table",
      "Competitor comparison",
      "Before vs after section",
    ],
    anti_examples: ["Generic feature grid", "Newsletter signup", "Footer"],
    deprecated: false,
  },

  steps: {
    label: "Steps",
    description:
      "Ordered sequence explaining a workflow or process. Often numbered steps, timeline, or progress-based layout.",
    examples: ["How it works (3 steps)", "Timeline steps", "Checklist steps"],
    anti_examples: ["Testimonials", "Pricing", "Navbar"],
    deprecated: false,
  },

  contact: {
    label: "Contact",
    description:
      "Contact and inquiry sections designed to help users reach out. Often includes form fields, addresses, or scheduling prompts.",
    examples: [
      "Contact form with details",
      "Contact split layout",
      "Support contact section",
    ],
    anti_examples: ["Pricing cards", "Logo cloud", "Product grid"],
    deprecated: false,
  },

  newsletter: {
    label: "Newsletter",
    description:
      "Email subscription and updates capture. Typically small form + short value statement.",
    examples: [
      "Inline email capture",
      "Newsletter CTA in footer",
      "Subscribe card",
    ],
    anti_examples: [
      "Checkout form",
      "Authentication form",
      "Feature comparison table",
    ],
    deprecated: false,
  },

  content: {
    label: "Content",
    description:
      "General-purpose editorial or informational sections. Used for explanations, long-form copy, and structured content layouts.",
    examples: [
      "Two-column content section",
      "Rich text + media",
      "Content with callouts",
    ],
    anti_examples: ["Navbar", "Pricing", "Checkout"],
    deprecated: false,
  },

  blog: {
    label: "Blog",
    description:
      "Layouts for listing posts, highlighting recent articles, or presenting blog-style content feeds.",
    examples: ["Blog post grid", "Featured post + list", "Article cards row"],
    anti_examples: ["Checkout", "Login form", "Pricing comparison"],
    deprecated: false,
  },

  gallery: {
    label: "Gallery",
    description:
      "Media-forward layouts for showing images, screenshots, or visual collections. Often grid, carousel, or masonry style.",
    examples: ["Screenshot gallery", "Image carousel", "Masonry gallery"],
    anti_examples: ["FAQ accordion", "Pricing table", "Navbar"],
    deprecated: false,
  },

  team: {
    label: "Team",
    description:
      "People-focused sections highlighting team members, leadership, or contributors. Often includes avatars, roles, and short bios.",
    examples: ["Team grid", "Leadership section", "Advisor row"],
    anti_examples: [
      "Product checkout",
      "Plan comparison",
      "How-it-works steps",
    ],
    deprecated: false,
  },

  careers: {
    label: "Careers",
    description:
      "Recruiting-focused layouts for job listings, culture highlights, and application CTAs.",
    examples: [
      "Open roles list",
      "Careers hero + roles",
      "Benefits + application CTA",
    ],
    anti_examples: [
      "E-commerce cart",
      "Authentication forms",
      "Product detail page",
    ],
    deprecated: false,
  },

  integrations: {
    label: "Integrations",
    description:
      "Sections that showcase integrations, partner tools, or compatibility. Often includes logos, categories, and capability descriptions.",
    examples: [
      "Integration grid",
      "Partner directory",
      "Compatibility callouts",
    ],
    anti_examples: ["Testimonials", "Checkout", "Footer legal links"],
    deprecated: false,
  },

  form: {
    label: "Form",
    description:
      "Standalone form sections not strictly tied to contact, newsletter, or authentication. Used for surveys, onboarding steps, or structured input.",
    examples: [
      "Multi-field intake form",
      "Survey form",
      "Application form section",
    ],
    anti_examples: ["Navbar", "Logo cloud", "Blog list"],
    deprecated: false,
  },

  authentication: {
    label: "Authentication",
    description:
      "Login, signup, password reset, and related identity screens or sections. Often includes fields, providers, and security notes.",
    examples: ["Login form", "Signup form", "Password reset flow"],
    anti_examples: ["Pricing cards", "Feature grid", "Testimonials"],
    deprecated: false,
  },

  ecommerce: {
    label: "E-commerce",
    description:
      "Commerce-specific blocks for browsing, product presentation, cart, and checkout supporting sections.",
    examples: ["Product grid", "Product detail section", "Cart summary block"],
    anti_examples: ["Developer docs navigation", "FAQ only", "Team gallery"],
    deprecated: false,
  },

  dashboard: {
    label: "Dashboard",
    description:
      "App-like layouts focused on authenticated experiences: data presentation, navigation rails, tables, charts, and management surfaces.",
    examples: [
      "Sidebar + content shell",
      "Stats + table layout",
      "Settings page layout",
    ],
    anti_examples: ["Marketing hero", "Logo cloud", "Newsletter signup"],
    deprecated: false,
  },
} as const
