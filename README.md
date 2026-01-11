# Vite React Components

A modern Vite + React component library for building websites with shadcn/ui components and ready-made section templates.

## Features

- ⚡️ [Vite](https://vitejs.dev) for fast development and building
- ⚛️ [React 19](https://react.dev) with TypeScript
- 🎨 [Tailwind CSS v4](https://tailwindcss.com) for styling
- 🧩 **55+ UI components** from shadcn/ui (primitives)
- 🏗️ **15 Website section components** for building complete pages
- 📦 All dependencies pre-configured
- 📚 Auto-generated component documentation with VitePress
- 🔧 Comprehensive JSDoc documentation for all components

## Getting Started

### Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
```

### Documentation

The project includes auto-generated component documentation powered by VitePress.

**Start the docs dev server:**

```bash
npm run docs:dev
# or
pnpm docs:dev
# or
yarn docs:dev
```

**Generate component docs:**

```bash
npm run docs:generate
```

**Build docs for production:**

```bash
npm run docs:build
```

The documentation is available at `http://localhost:5173` when running `docs:dev`, and includes:

- Component usage examples
- Props documentation
- Import instructions
- Links to source code

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/          # Primitive UI components (55+ components)
│   │   └── sections/    # Website section components
│   │       ├── hero/    # Hero sections
│   │       ├── navigation/  # Navigation bars
│   │       ├── about-us/   # About sections
│   │       ├── features/   # Features grids
│   │       ├── pricing/   # Pricing tables
│   │       ├── testimonials/  # Testimonials
│   │       ├── team/     # Team showcases
│   │       ├── faq/      # FAQ accordions
│   │       ├── contact/  # Contact forms
│   │       ├── services/ # Services grids
│   │       ├── stats/    # Statistics displays
│   │       ├── cta/      # Call-to-action sections
│   │       ├── footer/   # Footer sections
│   │       ├── gallery/  # Image galleries
│   │       └── blog/     # Blog post listings
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main app component (template)
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── docs/                # VitePress documentation
│   ├── components/      # Auto-generated component docs
│   └── .vitepress/      # VitePress configuration
├── scripts/             # Utility scripts
│   └── generate-component-docs.mjs  # Auto-generates component docs
├── public/              # Static assets
└── package.json
```

## Using Components

### Primitive UI Components

All primitive components are available in `src/components/ui/`. Import them like this:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Website Section Components

Section components are available in `src/components/sections/`. They accept dynamic arrays for flexible content:

```tsx
import { HeroCentered } from "@/components/sections/hero/hero-centered"
import { PricingGrid } from "@/components/sections/pricing/pricing-grid"
import { NavigationDefault } from "@/components/sections/navigation/navigation-default"

function App() {
  return (
    <div>
      <NavigationDefault
        logoText="MyBrand"
        links={[
          { label: "Home", href: "/", active: true },
          { label: "About", href: "/about" }
        ]}
      />

      <HeroCentered
        title="Welcome to Our Platform"
        description="Build amazing things with our tools"
        ctaButtons={[
          { label: "Get Started", variant: "default" },
          { label: "Learn More", variant: "outline" }
        ]}
      />

      <PricingGrid
        title="Choose Your Plan"
        plans={[
          { name: "Basic", price: 9, features: [...] },
          { name: "Pro", price: 29, features: [...], featured: true }
        ]}
      />
    </div>
  )
}
```

**Key Features of Section Components:**

- ✅ Dynamic arrays - No fixed numbers (e.g., `plans: PricingPlan[]`, `features: Feature[]`)
- ✅ Comprehensive JSDoc - Full prop documentation with examples
- ✅ Multiple variants - Descriptive names allow multiple versions (e.g., `hero-centered.tsx`, `pricing-grid.tsx`)
- ✅ TypeScript types - All props and data structures are fully typed
- ✅ Built on primitives - Uses components from `src/components/ui/`

## Available Components

### Primitive UI Components (55+)

All shadcn/ui components are included:

- Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar
- Badge, Breadcrumb, Button, Button Group
- Calendar, Card, Carousel, Chart, Checkbox
- Collapsible, Combobox, Command, Context Menu
- Dialog, Drawer, Dropdown Menu
- Empty, Field, Form
- Hover Card
- Input, Input Group, Input OTP, Item
- KBD, Label
- Menubar
- Navigation Menu, Native Select
- Pagination, Popover, Progress
- Radio Group, Resizable
- Scroll Area, Select, Separator, Sheet, Sidebar
- Skeleton, Slider, Sonner, Spinner, Switch
- Table, Tabs, Textarea, Toggle, Toggle Group, Tooltip

### Website Section Components (15)

Ready-made sections for building complete websites:

1. **Hero Sections** (`hero/hero-centered.tsx`) - Landing sections with CTAs
2. **Navigation** (`navigation/navigation-default.tsx`) - Header/navigation bars with mobile menu
3. **About Us** (`about-us/about-us-default.tsx`) - Company/person information sections
4. **Features** (`features/features-grid.tsx`) - Feature grids and lists
5. **Pricing** (`pricing/pricing-grid.tsx`) - Pricing plan tables
6. **Testimonials** (`testimonials/testimonials-grid.tsx`) - Customer review sections
7. **Team** (`team/team-grid.tsx`) - Team member showcases
8. **FAQ** (`faq/faq-accordion.tsx`) - Frequently asked questions
9. **Contact** (`contact/contact-form.tsx`) - Contact forms and information
10. **Services** (`services/services-grid.tsx`) - Service offering grids
11. **Stats** (`stats/stats-grid.tsx`) - Statistics/metrics displays
12. **CTA** (`cta/cta-default.tsx`) - Call-to-action sections
13. **Footer** (`footer/footer-default.tsx`) - Footer with links and social media
14. **Gallery** (`gallery/gallery-grid.tsx`) - Image/portfolio galleries
15. **Blog** (`blog/blog-grid.tsx`) - Blog post/article listings

All section components can be imported from the barrel export:

```tsx
import {
  HeroCentered,
  NavigationDefault,
  PricingGrid,
  // ... and more
} from "@/components/sections"
```

## License

MIT
