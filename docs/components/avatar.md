# Avatar

An image element with a fallback for representing the user.

## Usage

### Basic Usage

```tsx demo
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"

<div className="flex flex-row flex-wrap items-center gap-12">
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar className="rounded-lg">
    <AvatarImage
      src="https://github.com/evilrabbit.png"
      alt="@evilrabbit"
    />
    <AvatarFallback>ER</AvatarFallback>
  </Avatar>
  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage
        src="https://github.com/maxleiter.png"
        alt="@maxleiter"
      />
      <AvatarFallback>LR</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage
        src="https://github.com/evilrabbit.png"
        alt="@evilrabbit"
      />
      <AvatarFallback>ER</AvatarFallback>
    </Avatar>
  </div>
</div>
```

## Props

See the component source file for full TypeScript prop definitions:
`src/components/ui/avatar.tsx`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/avatar).

## Source

See the [Avatar Component](https://github.com/monarqweb/mock-ui/blob/main/src/components/ui/avatar.tsx) for the full implementation.

