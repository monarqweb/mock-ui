# Calendar

A date field component that allows users to enter and edit date.

## Usage

### Basic Usage

```tsx demo
import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = React.useState(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
    />
  )
}

```

## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/calendar.tsx) for full TypeScript prop definitions.

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/calendar).

