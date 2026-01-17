@componentIntro(/src/components/ui/link-list.tsx)

```tsx demo
import { ArrowUpRight } from "lucide-react"
import { LinkList } from "@/components/ui/link-list"

<LinkList
  links={[
    { label: "Home", href: "/" },
    { label: "Documentation", href: "https://example.com/docs", target: "_blank", trailingIcon: <ArrowUpRight className="size-3.5" /> },
    { label: "GitHub", href: "https://github.com", target: "_blank", trailingIcon: <ArrowUpRight className="size-3.5" /> },
  ]}
/>
```

@componentApiReference(/src/components/ui/link-list.tsx)