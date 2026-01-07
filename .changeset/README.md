# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## About This Project

This is a **Vite + React component library** for building modern websites. It includes:

- **55+ UI Components** - All shadcn/ui primitive components (Button, Card, Input, etc.)
- **15 Website Section Components** - Reusable sections for building complete websites:
  - Hero sections
  - Navigation bars
  - About/Company sections
  - Features grids
  - Pricing tables
  - Testimonials
  - Team showcases
  - FAQ accordions
  - Contact forms
  - Services grids
  - Statistics displays
  - Call-to-action sections
  - Footer sections
  - Image galleries
  - Blog post listings

All section components:
- Accept dynamic arrays for flexible content (no fixed numbers)
- Include comprehensive JSDoc documentation
- Use primitive UI components from `src/components/ui/`
- Support multiple variants (e.g., `hero-centered.tsx`, `pricing-grid.tsx`)

## Using Changesets

### Creating a Changeset

When you make changes to components or add new features, create a changeset:

```bash
npx changeset
```

This will prompt you to:
1. Select which packages changed (if applicable)
2. Choose the type of change (patch, minor, or major)
3. Write a description of the changes

### Changeset Types

- **patch** - Bug fixes, small improvements
- **minor** - New components, new features (backward compatible)
- **major** - Breaking changes

### Example Changeset

For adding a new section component:
```markdown
---
"vite-react-components": minor
---

Add new hero-split.tsx section component variant
```

### Versioning and Publishing

Changesets will automatically:
- Update version numbers in `package.json`
- Generate changelog entries
- Prepare release notes

For more information, see the [Changesets documentation](https://github.com/changesets/changesets/blob/main/docs/common-questions.md).
