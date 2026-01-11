import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Feature - Represents a feature item in the features section.
 */
export interface Feature {
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Optional icon component */
  icon?: React.ReactNode
  /** Optional image URL */
  imageUrl?: string
  /** Alt text for the image */
  imageAlt?: string
}

/**
 * FeaturesGrid - Renders a features section with a grid of feature items.
 *
 * This component displays a title, description, and a grid of feature cards.
 * The number of feature cards is determined by the length of the `features` array.
 * Each feature can include a title, description, optional icon, and optional image.
 *
 * @param {FeaturesGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {Feature[]} props.features - Array of feature objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <FeaturesGrid
 *   title="Our Features"
 *   description="Everything you need to succeed"
 *   features={[
 *     { title: "Fast", description: "Lightning fast performance", icon: <ZapIcon /> },
 *     { title: "Secure", description: "Enterprise-grade security" },
 *     { title: "Scalable", description: "Grows with your business" }
 *   ]}
 * />
 * ```
 */
export interface FeaturesGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of feature objects */
  features: Feature[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function FeaturesGrid({
  title,
  description,
  features,
  columns = 3,
  className,
}: FeaturesGridProps) {
  return (
    <section className={cn("px-4 py-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground mt-4 text-lg">
                {description}
              </p>
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
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                {feature.icon && <div className="mb-4">{feature.icon}</div>}
                {feature.imageUrl && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={feature.imageUrl}
                      alt={feature.imageAlt || feature.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
