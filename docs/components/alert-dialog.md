# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

## Usage

### Basic Usage

```tsx demo
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

```

## Props

See the component source file for full TypeScript prop definitions:
`src/components/ui/alert-dialog.tsx`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/alert-dialog).

## Source


See the [Alert Dialoge Component](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/alert-dialog.tsx) for the full implementation.
