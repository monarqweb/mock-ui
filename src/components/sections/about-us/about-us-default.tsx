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
 * Feature - Represents a feature item in the about section.
 */
export interface Feature {
  /** Feature title */
  title: string
  /** Feature description */
  description: string
  /** Optional icon or visual element */
  icon?: React.ReactNode
}

/**
 * AboutUsDefault - Renders an about section with company/person information, image, and feature list.
 *
 * This component displays information about a company, team, or individual.
 * It supports a title, description, optional image, and a list of features or highlights.
 * The layout can be configured to show image on left or right side.
 *
 * @param {AboutUsDefaultProps} props - Component props
 * @param {string} props.title - Section title (e.g., "About Us")
 * @param {string} [props.description] - Main description text
 * @param {string} [props.imageUrl] - Optional image URL
 * @param {string} [props.imageAlt] - Alt text for the image
 * @param {Feature[]} [props.features] - Array of feature items to display
 * @param {"left" | "right"} [props.imagePosition] - Position of the image relative to content
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <AboutUsDefault
 *   title="About Our Company"
 *   description="We are a team of passionate developers..."
 *   imageUrl="/about-image.jpg"
 *   features={[
 *     { title: "10+ Years", description: "Of experience" },
 *     { title: "500+ Clients", description: "Satisfied customers" }
 *   ]}
 * />
 * ```
 */
export interface AboutUsDefaultProps {
  /** Section title (e.g., "About Us") */
  title: string
  /** Main description text */
  description?: string
  /** Optional image URL */
  imageUrl?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Array of feature items to display */
  features?: Feature[]
  /** Position of the image relative to content */
  imagePosition?: "left" | "right"
  /** Additional CSS classes */
  className?: string
}

export function AboutUsDefault({
  title,
  description,
  imageUrl,
  imageAlt = "About us",
  features = [],
  imagePosition = "right",
  className,
}: AboutUsDefaultProps) {
  return (
    <section className={cn("px-4 py-16", className)}>
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "grid gap-8 lg:grid-cols-2 lg:gap-12",
            imagePosition === "left" && "lg:grid-flow-dense"
          )}
        >
          {imageUrl && (
            <div
              className={cn(
                "relative aspect-video overflow-hidden rounded-lg",
                imagePosition === "left" && "lg:col-start-1"
              )}
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div
            className={cn(
              "flex flex-col justify-center space-y-6",
              imagePosition === "left" && "lg:col-start-2"
            )}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}
            {features.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <Card key={feature.title}>
                    <CardHeader>
                      {feature.icon && (
                        <div className="mb-2">{feature.icon}</div>
                      )}
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
