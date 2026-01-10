# Badge

Displays a badge or a component that looks like a badge.

## Usage

### Basic Usage

```tsx demo
import { Badge } from "@/components/ui/badge"

<div className="flex flex-col items-center gap-2">
  <div className="flex w-full flex-wrap gap-2">
    <Badge>Badge</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
  <div className="flex w-full flex-wrap gap-2">
    <Badge
      variant="secondary"
      className="bg-blue-500 text-white dark:bg-blue-600"
    >
      Verified
    </Badge>
    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
      8
    </Badge>
    <Badge
      className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
      variant="destructive"
    >
      99
    </Badge>
    <Badge
      className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
      variant="outline"
    >
      20+
    </Badge>
  </div>
</div>
```

### Variants

This component supports multiple variants. Check the source code for available options.

```tsx
<Badge variant="default">Default</Badge>
```

## Props

See the component source file for full TypeScript prop definitions:
`src/components/ui/badge.tsx`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/badge).

## Source

See the [Badge Component](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/badge.tsx) for the full implementation.

