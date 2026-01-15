# Blocks

Blocks are sections of content on a website. Each block is a reusable component designed to serve specific purposes across different industries and use cases.

## Taxonomy

Blocks are identified and categorized using a taxonomy system defined in their JSDoc comments. This taxonomy helps organize and discover blocks based on:

- **Category**: The type of block (e.g., `hero`, `footer`, `navigation`)
- **Industry**: The target industry or vertical (e.g., `real_estate`, `ecommerce`, `saas`)
- **Intent**: The user action or goal the block supports (e.g., `conversion_push`, `route_user`, `inform`)
- **Tone**: The emotional or stylistic approach (e.g., `premium`, `confident`, `modern`, `friendly`)

This taxonomy is documented in each block's JSDoc comments using tags like `@category`, `@industry`, `@intent`, and `@tone`.

## Customization

Blocks are customized through their **props**, which provide options for content, behavior, and styling. Each block's props are documented in its API reference, allowing you to tailor the block to your specific needs.

## Theming

Theming is handled globally through [shadcn/ui's theming system](https://ui.shadcn.com/docs/theming), which uses CSS variables for consistent styling across all components and blocks. This allows you to customize colors, spacing, and other design tokens at a global level rather than per-block.