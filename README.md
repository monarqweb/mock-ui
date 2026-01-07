# Vite React Components

A modern Vite + React starter template with shadcn/ui components pre-configured.

## Features

- ⚡️ [Vite](https://vitejs.dev) for fast development and building
- ⚛️ [React 19](https://react.dev) with TypeScript
- 🎨 [Tailwind CSS v4](https://tailwindcss.com) for styling
- 🧩 55+ UI components from shadcn/ui
- 📦 All dependencies pre-configured
- 📚 Auto-generated component documentation with VitePress

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
│   │   └── ui/          # All UI components (55+ components)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Main app component
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

All components are available in `src/components/ui/`. Import them like this:

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

## Available Components

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

## License

MIT
