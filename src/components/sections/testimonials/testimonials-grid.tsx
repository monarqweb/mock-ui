import { cn } from "@/lib/utils"
import {
  TestimonialCard,
  type TestimonialCardProps,
} from "./utils/testimonial-card"

/**
 * Testimonial - Represents a testimonial configuration.
 */
export type Testimonial = TestimonialCardProps

/**
 * TestimonialsGrid - Renders a testimonials section with a grid of testimonial cards.
 *
 * This component displays a title, description, and a grid of customer testimonial cards.
 * The number of testimonial cards is determined by the length of the `testimonials` array.
 * Card rendering uses the TestimonialCard sub-component from the utils directory.
 *
 * @param {TestimonialsGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {Testimonial[]} props.testimonials - Array of testimonial objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <TestimonialsGrid
 *   title="What Our Customers Say"
 *   testimonials={[
 *     {
 *       quote: "Amazing product!",
 *       author: "John Doe",
 *       authorTitle: "CEO",
 *       company: "Acme Corp",
 *       rating: 5
 *     }
 *   ]}
 * />
 * ```
 */
export interface TestimonialsGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of testimonial objects */
  testimonials: Testimonial[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function TestimonialsGrid({
  title,
  description,
  testimonials,
  columns = 3,
  className,
}: TestimonialsGridProps) {
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
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`}
              {...testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
