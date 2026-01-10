# Aspect Ratio

Displays content within a desired ratio.

## Usage

### Basic Usage

```tsx demo
import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
  <img
    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
    alt="Photo by Drew Beamer"
    fill
    className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
  />
</AspectRatio>

```

## Props

See the component source file for full TypeScript prop definitions:
`src/components/ui/aspect-ratio.tsx`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/aspect-ratio).

## Source

See the [Aspect Ratio Component](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/aspect-ratio.tsx) for the full implementation.