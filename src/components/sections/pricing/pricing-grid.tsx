import { cn } from "@/lib/utils"
import { PricingCard, type PricingCardProps } from "./utils/pricing-card"

/**
 * PricingPlan - Represents a pricing plan configuration.
 */
export type PricingPlan = Omit<PricingCardProps, "className">

/**
 * PricingGrid - Renders a pricing section with multiple pricing plan cards in a grid layout.
 *
 * This component displays a title, description, and a grid of pricing plan cards.
 * The number of cards is determined by the length of the `plans` array.
 * Card rendering uses the PricingCard sub-component from the utils directory.
 *
 * @param {PricingGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {PricingPlan[]} props.plans - Array of pricing plan objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <PricingGrid
 *   title="Choose Your Plan"
 *   description="Select the perfect plan for your needs"
 *   plans={[
 *     { name: "Basic", price: 9, features: [{ text: "Feature 1", included: true }] },
 *     { name: "Pro", price: 29, features: [...], featured: true },
 *     { name: "Enterprise", price: 99, features: [...] }
 *   ]}
 * />
 * ```
 */
export interface PricingGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of pricing plan objects */
  plans: PricingPlan[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function PricingGrid({
  title,
  description,
  plans,
  columns = 3,
  className,
}: PricingGridProps) {
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
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
