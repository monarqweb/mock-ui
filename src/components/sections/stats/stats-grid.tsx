import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Stat - Represents a statistic/metric item.
 */
export interface Stat {
  /** Statistic value (can be number or string) */
  value: string | number
  /** Statistic label */
  label: string
  /** Optional description text */
  description?: string
  /** Optional icon component */
  icon?: React.ReactNode
  /** Optional suffix (e.g., "+", "%", "K") */
  suffix?: string
  /** Optional prefix (e.g., "$") */
  prefix?: string
}

/**
 * StatsGrid - Renders a statistics section with a grid of metric cards.
 * 
 * This component displays a title, description, and a grid of statistic/metric cards.
 * The number of stat cards is determined by the length of the `stats` array.
 * Each stat can include a value, label, description, icon, and optional prefix/suffix.
 * 
 * @param {StatsGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {Stat[]} props.stats - Array of statistic objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 4)
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <StatsGrid
 *   title="Our Impact"
 *   stats={[
 *     { value: 1000, suffix: "+", label: "Happy Customers", icon: <UsersIcon /> },
 *     { value: 50, suffix: "+", label: "Countries", icon: <GlobeIcon /> }
 *   ]}
 * />
 * ```
 */
export interface StatsGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of statistic objects */
  stats: Stat[]
  /** Number of columns in the grid (default: 4) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function StatsGrid({
  title,
  description,
  stats,
  columns = 4,
  className,
}: StatsGridProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div
          className={cn(
            "grid gap-6",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                {stat.icon && <div className="mb-4 flex justify-center">{stat.icon}</div>}
                <div className="mb-2 text-4xl font-bold">
                  {stat.prefix}
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                  {stat.suffix}
                </div>
                <div className="text-lg font-semibold">{stat.label}</div>
                {stat.description && (
                  <div className="text-muted-foreground mt-2 text-sm">
                    {stat.description}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

