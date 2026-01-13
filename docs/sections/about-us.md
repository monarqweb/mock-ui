---
aside: false
---

# About us

Renders an about section with company/person information, image, and feature list.

## Usage
This component displays information about a company, team, or individual. It supports a title, description, optional image, and a list of features or highlights.

The layout can be configured to show image on left or right side.

```tsx demo
import { AboutUsDefault } from "@/components/sections/about-us/about-us-default"

export function Demo() {
  return (
    <AboutUsDefault
      title="About Our Company"
      description="We are a team of passionate developers..."
      imageUrl="https://images.unsplash.com/photo-1606318621597-c057f7d4926e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW58ZW58MHwyfDB8fHww"
      features={[
        { title: "10+ Years", description: "Of experience" },
        { title: "500+ Clients", description: "Satisfied customers" }
      ]}
    />
  )
}
```


## Props

See the [component source file](https://github.com/monarqweb/mock-ui/blob/main/src/components/sections/about-us/about-us-default.tsx) for full TypeScript prop definitions.