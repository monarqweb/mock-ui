---
sidebar: false
aside: false
---

@componentIntro(/src/components/blocks/footer/brand-name-footer.tsx)

## Demo

```tsx demo
import { BrandNameFooter } from '@/components/blocks/footer/brand-name-footer';
import { LinkList } from "@/components/ui/link-list"
import { SocialIcons } from "@/components/ui/social-icons"

export function Demo() {
  return (
    <BrandNameFooter
      content={
        <>
          <p class="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
          <LinkList className="text-primary-foreground" links={[{ label: "Link One", href: "#", target: "_blank" }, { label: "Link Two", href: "#" }, { label: "Link Three", href: "#" }, { label: "Link Four", href: "#" }]} />
          <LinkList className="text-primary-foreground" links={[{ label: "Link One", href: "#" }, { label: "Link Two", href: "#" }, { label: "Link Three", href: "#" }, { label: "Link Four", href: "#" }]} />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </>
      }
      brandName="Brand"
      copyright="©2026 Company Inc."
      socialIcons={
        <SocialIcons
          iconClassName="size-4"
          twitter="https://twitter.com/username"
          facebook="https://facebook.com/username"
          instagram="https://instagram.com/username"
          linkedin="https://linkedin.com/in/username"
          youtube="https://youtube.com/@username"
          email="contact@example.com"
        />
      }
    />
  )
}
```

@componentApiReference(/src/components/blocks/footer/brand-name-footer.tsx)