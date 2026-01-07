import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Service - Represents a service offering.
 */
export interface Service {
  /** Service title */
  title: string
  /** Service description */
  description: string
  /** Optional icon component */
  icon?: React.ReactNode
  /** Optional image URL */
  imageUrl?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Optional CTA button label */
  ctaLabel?: string
  /** Optional CTA button onClick handler */
  onCtaClick?: () => void
  /** Optional CTA button href */
  ctaHref?: string
}

/**
 * ServicesGrid - Renders a services section with a grid of service cards.
 * 
 * This component displays a title, description, and a grid of service offering cards.
 * The number of service cards is determined by the length of the `services` array.
 * Each service can include a title, description, optional icon/image, and optional CTA button.
 * 
 * @param {ServicesGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {Service[]} props.services - Array of service objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <ServicesGrid
 *   title="Our Services"
 *   services={[
 *     {
 *       title: "Web Development",
 *       description: "Custom web solutions",
 *       icon: <CodeIcon />,
 *       ctaLabel: "Learn More",
 *       ctaHref: "/services/web"
 *     }
 *   ]}
 * />
 * ```
 */
export interface ServicesGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of service objects */
  services: Service[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function ServicesGrid({
  title,
  description,
  services,
  columns = 3,
  className,
}: ServicesGridProps) {
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
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col">
              <CardHeader>
                {service.icon && <div className="mb-4">{service.icon}</div>}
                {service.imageUrl && (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={service.imageUrl}
                      alt={service.imageAlt || service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
              {(service.ctaLabel || service.onCtaClick || service.ctaHref) && (
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={service.onCtaClick}
                    asChild={!!service.ctaHref}
                    className="w-full"
                  >
                    {service.ctaHref ? (
                      <a href={service.ctaHref}>{service.ctaLabel || "Learn More"}</a>
                    ) : (
                      service.ctaLabel || "Learn More"
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

