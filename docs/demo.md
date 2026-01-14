---
layout: page
sidebar: false
aside: false
---

```tsx demo
import { Hero } from '@/components/blocks/spike/hero';
import { Feature } from '@/components/blocks/spike/feature';
import { Incentives } from '@/components/blocks/spike/incentives';
import { Stats } from '@/components/blocks/spike/stats';
import { Faq } from '@/components/blocks/spike/faq';
import { Footer } from '@/components/blocks/spike/footer';

export function Demo() {
  return (
    <div className="w-full flex flex-col justify-items-center">
      <Hero
        title="Find properties that match your future"
        subtitle="WORLDS NUMBER ONE"
        text="Smart real estate decisions start with clear data, rusted listings, and expert guidance in one platform"
        backgroundImage="https://images.unsplash.com/photo-1587913560680-7f8187bf9634?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJjaGl0ZWN0dXJlJTIwaG91c2V8ZW58MHwwfDB8fHww"
      />

      <Feature />
      <Incentives />
      <Stats />
      <Faq />
      <Footer />
    </div>
  )
}
```