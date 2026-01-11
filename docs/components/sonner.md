# Sonner

An opinionated toast component for React.

## Usage

### Setup the toaster

Add `<Toaster />` once to the root of your app.

```tsx
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

### Showing a toast

Now that your toaster is setup, you can show toasts.

```tsx demo
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/sonner.tsx) for full TypeScript prop definitions.

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/sonner).

