# Blocks

Blocks are sections of content on a website. Each block is a reusable component designed to serve specific purposes across different industries and use cases.

## Customization
Blocks are customized through their **props**, which provide options for content, behavior, and styling. Each block's props are documented in its API reference, allowing you to tailor the block to your specific needs.

## Theming
Theming is handled globally through [shadcn/ui's theming system](https://ui.shadcn.com/docs/theming), which uses CSS variables for consistent styling across all components and blocks. This allows you to customize colors, spacing, and other design tokens at a global level rather than per-block.

## Taxonomy
The taxonomy system provides a structured way to identify and categorize components, enabling AI agents to properly understand and select the right components for specific use cases.

The taxonomy system consists of four distinct taxonomies:

### Category

Category describes a component based on its content and how it's used. These are large groupings that do not reflect their intent, tone, or industry.

[View Category Definitions →](/blocks/introduction/category)

### Industry

Industry is an optional tag that can be given to components that have content, features, or functions related to a specific industry. Only tag an industry when the component's structure, props, or default semantics assume that industry.

[View Industry Definitions →](/blocks/introduction/industry)

### Intent

Intent describes the primary outcome the component is trying to achieve. It does not describe visual style. Intent should be stable over time.

[View Intent Definitions →](/blocks/introduction/intent)

### Tone

Tone describes the emotional posture of a component. It does not describe brand adjectives or visuals since those can vary by site. Tone is orthogonal to intent—a conversion component can be calm or aggressive.

[View Tone Definitions →](/blocks/introduction/tone)