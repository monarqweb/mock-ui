---
aside: false
---

# Hero

Renders a hero section with full-width background image, headline, and call-to-action.

## Purpose

This component displays a prominent hero section typically used at the top of a page. It supports a background image, headline text, description, and an optional CTA button. The layout is optimized for full-screen viewport height with responsive design.

## Demo

```tsx demo
import { Hero } from '@/components/blocks/spike/hero';

export function Demo() {
  return (
    <Hero
      title="Find properties that match your future"
      subtitle="WORLDS NUMBER ONE"
      text="Smart real estate decisions start with clear data, rusted listings, and expert guidance in one platform"
      backgroundImage="https://images.unsplash.com/photo-1587913560680-7f8187bf9634?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJjaGl0ZWN0dXJlJTIwaG91c2V8ZW58MHwwfDB8fHww"
    />
  )
}
```