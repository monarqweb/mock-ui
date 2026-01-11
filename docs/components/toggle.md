# Toggle

A two-state button that can be either on or off.

## Usage

### Basic Usage

```tsx demo
import { BookmarkIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle
      aria-label="Toggle bookmark"
      size="sm"
      variant="outline"
      className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
    >
      <BookmarkIcon />
      Bookmark
    </Toggle>
  )
}
```

### Variants

This component supports multiple variants. Check the source code for available options.

```tsx
<Toggle variant="default">Default</Toggle>
```

## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/toggle.tsx) for full TypeScript prop definitions.

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/toggle).
