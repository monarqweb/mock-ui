# Empty

Use the Empty component to display an empty state.

## Usage

### Basic Usage

```tsx demo
import { IconFolderCode } from "@tabler/icons-react"
import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </div>
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}
```

### Variants

This component supports multiple variants. Check the source code for available options.

```tsx
<Empty variant="default">Default</Empty>
```

## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/empty.tsx) for full TypeScript prop definitions.

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/empty).
