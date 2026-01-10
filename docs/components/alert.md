# Alert

Displays a callout for user attention.

## Usage

### Basic Usage

```tsx demo
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"

<div className="grid w-full max-w-xl items-start gap-4">
  <Alert>
    <AlertTitle>Success! Your changes have been saved</AlertTitle>
    <AlertDescription>
      This is an alert with icon, title and description.
    </AlertDescription>
  </Alert>
  <Alert>
    <AlertTitle>
      This Alert has a title and an icon. No description.
    </AlertTitle>
  </Alert>
  <Alert variant="destructive">
    <AlertTitle>Unable to process your payment.</AlertTitle>
    <AlertDescription>
      <p>Please verify your billing information and try again.</p>
      <ul className="list-inside list-disc text-sm">
        <li>Check your card details</li>
        <li>Ensure sufficient funds</li>
        <li>Verify billing address</li>
      </ul>
    </AlertDescription>
  </Alert>
</div>
```

### Variants

This component supports multiple variants. Check the source code for available options.

```tsx
<Alert variant="default">Default</Alert>
```

## Props

See the component source file for full TypeScript prop definitions:
`src/components/ui/alert.tsx`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/alert).

## Source

See the [Alert Component](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/alert.tsx) for the full implementation.