# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## Usage

### Basic Usage

```tsx demo
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  )
}
```

## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/tooltip.tsx) for full TypeScript prop definitions.

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/tooltip).
