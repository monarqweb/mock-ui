---
aside: false
---

# Stats

Renders a statistics section with animated numbers and year selection.

## Purpose

This component displays company statistics with animated number counters that update based on the selected year. It includes a title, description, action buttons, and an interactive year selector with visual indicators. The numbers animate smoothly when the year changes.

## Demo

```tsx demo
import { Stats } from '@/components/blocks/spike/stats';

export function Demo() {
  return (
    <Stats />
  )
}
```