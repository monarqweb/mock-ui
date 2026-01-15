export const TONE_DEFINITIONS = {
  neutral: {
    label: "Neutral",
    description:
      "Objective, straightforward, and informational in tone. Prioritizes clarity and balance without strong emotional cues or persuasive language.",
    examples: [
      "Product specifications",
      "Feature summaries",
      "Informational banners",
    ],
    anti_examples: [
      "Sales-driven calls to action",
      "Emotive storytelling",
      "Playful or humorous copy",
    ],
    deprecated: false,
  },

  friendly: {
    label: "Friendly",
    description:
      "Warm, approachable, and conversational. Uses inviting language to reduce friction and make the experience feel accessible.",
    examples: ["Welcome messages", "Onboarding prompts", "Support callouts"],
    anti_examples: [
      "Formal legal copy",
      "Highly technical documentation",
      "Aggressive sales messaging",
    ],
    deprecated: false,
  },

  playful: {
    label: "Playful",
    description:
      "Lighthearted, fun, and energetic. Uses humor, delight, or whimsy to engage users and create a sense of personality.",
    examples: [
      "Celebration states",
      "Empty states with personality",
      "Casual consumer apps",
    ],
    anti_examples: [
      "Regulatory disclosures",
      "Security warnings",
      "Serious enterprise workflows",
    ],
    deprecated: false,
  },

  confident: {
    label: "Confident",
    description:
      "Clear, assured, and self-possessed. Communicates certainty and competence without being aggressive or boastful.",
    examples: [
      "Value propositions",
      "Primary CTAs",
      "Product positioning statements",
    ],
    anti_examples: [
      "Hesitant language",
      "Overly apologetic copy",
      "Uncertain messaging",
    ],
    deprecated: false,
  },

  authoritative: {
    label: "Authoritative",
    description:
      "Expert-led, decisive, and instructional. Communicates deep knowledge and sets clear direction for the user.",
    examples: [
      "Technical guides",
      "Compliance instructions",
      "Best-practice recommendations",
    ],
    anti_examples: [
      "Casual conversation",
      "Exploratory or speculative language",
      "Playful marketing copy",
    ],
    deprecated: false,
  },

  reassuring: {
    label: "Reassuring",
    description:
      "Calm, supportive, and confidence-building. Reduces anxiety and addresses user concerns or perceived risks.",
    examples: [
      "Security assurances",
      "Guarantee statements",
      "Post-purchase confirmations",
    ],
    anti_examples: [
      "Urgent or pressuring CTAs",
      "Bold marketing slogans",
      "Playful or humorous messaging",
    ],
    deprecated: false,
  },

  modern: {
    label: "Modern",
    description:
      "Contemporary and current in voice and presentation. Feels up-to-date without relying on trends that may quickly age.",
    examples: [
      "SaaS landing pages",
      "Design system documentation",
      "Tech-forward products",
    ],
    anti_examples: [
      "Outdated jargon",
      "Retro or nostalgic language",
      "Overly formal prose",
    ],
    deprecated: false,
  },

  premium: {
    label: "Premium",
    description:
      "Refined, polished, and high-end. Uses restraint and confidence to convey quality and exclusivity.",
    examples: [
      "Luxury brands",
      "High-end services",
      "Enterprise marketing pages",
    ],
    anti_examples: [
      "Casual slang",
      "Playful humor",
      "Overly verbose explanations",
    ],
    deprecated: false,
  },

  bold: {
    label: "Bold",
    description:
      "Direct, assertive, and high-impact. Uses strong statements and visual emphasis to command attention.",
    examples: ["Hero headlines", "Campaign messaging", "Launch announcements"],
    anti_examples: [
      "Cautious disclaimers",
      "Soft guidance text",
      "Reassuring or calming copy",
    ],
    deprecated: false,
  },

  technical: {
    label: "Technical",
    description:
      "Precise, detailed, and domain-specific. Optimized for accuracy and depth rather than persuasion or emotion.",
    examples: [
      "API documentation",
      "Configuration guides",
      "Developer references",
    ],
    anti_examples: [
      "High-level marketing copy",
      "Emotional storytelling",
      "Casual onboarding text",
    ],
    deprecated: false,
  },

  professional: {
    label: "Professional",
    description:
      "Polished, business-oriented, and respectful. Balances clarity with formality for workplace and B2B contexts.",
    examples: [
      "Enterprise product pages",
      "Client communications",
      "Service descriptions",
    ],
    anti_examples: [
      "Slang-heavy copy",
      "Playful brand voices",
      "Overly casual language",
    ],
    deprecated: false,
  },

  human: {
    label: "Human",
    description:
      "Personal, empathetic, and relatable. Prioritizes understanding and emotional resonance over formality or authority.",
    examples: [
      "Error messages",
      "Support content",
      "Personalized notifications",
    ],
    anti_examples: [
      "Legal disclaimers",
      "Purely technical documentation",
      "Rigid instructional copy",
    ],
    deprecated: false,
  },
} as const
