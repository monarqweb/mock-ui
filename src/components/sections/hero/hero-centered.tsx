import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * CTAButton - Represents a call-to-action button configuration.
 */
export interface CTAButton {
  /** Button label text */
  label: string
  /** Button variant (default, outline, secondary, etc.) */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
  /** Click handler function */
  onClick?: () => void
  /** Optional href for link buttons */
  href?: string
}

/**
 * HeroCentered - Renders a centered hero section with title, description, CTA buttons, and optional image/background.
 * 
 * This component displays a prominent hero section typically used at the top of landing pages.
 * It supports a title, description, multiple CTA buttons (rendered as an array), and optional visual elements.
 * The layout is centered both horizontally and vertically within the section.
 * 
 * @param {HeroCenteredProps} props - Component props
 * @param {string} props.title - Main hero title/headline
 * @param {string} [props.description] - Supporting description text below the title
 * @param {CTAButton[]} [props.ctaButtons] - Array of CTA button configurations to display
 * @param {string} [props.imageUrl] - Optional image URL to display alongside or behind the content
 * @param {string} [props.imageAlt] - Alt text for the image
 * @param {string} [props.backgroundImageUrl] - Optional background image URL
 * @param {string} [props.className] - Additional CSS classes for the container
 * 
 * @example
 * ```tsx
 * <HeroCentered
 *   title="Welcome to Our Platform"
 *   description="Build amazing things with our tools"
 *   ctaButtons={[
 *     { label: "Get Started", variant: "default", onClick: () => console.log("Clicked") },
 *     { label: "Learn More", variant: "outline" }
 *   ]}
 *   imageUrl="/hero-image.png"
 * />
 * ```
 */
export interface HeroCenteredProps {
  /** Main hero title/headline */
  title: string
  /** Supporting description text below the title */
  description?: string
  /** Array of CTA button configurations to display */
  ctaButtons?: CTAButton[]
  /** Optional image URL to display alongside or behind the content */
  imageUrl?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Optional background image URL */
  backgroundImageUrl?: string
  /** Additional CSS classes for the container */
  className?: string
}

export function HeroCentered({
  title,
  description,
  ctaButtons = [],
  imageUrl,
  imageAlt = "Hero image",
  backgroundImageUrl,
  className,
}: HeroCenteredProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[600px] flex-col items-center justify-center px-4 py-16 text-center",
        backgroundImageUrl && "bg-cover bg-center bg-no-repeat",
        className
      )}
      style={
        backgroundImageUrl
          ? {
              backgroundImage: `url(${backgroundImageUrl})`,
            }
          : undefined
      }
    >
      {backgroundImageUrl && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      )}
      <div className="relative z-10 mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {description}
          </p>
        )}
        {ctaButtons.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctaButtons.map((button, index) => (
              <Button
                key={button.href || `${button.label}-${index}`}
                variant={button.variant || "default"}
                size={button.size || "default"}
                onClick={button.onClick}
                asChild={!!button.href}
              >
                {button.href ? (
                  <a href={button.href}>{button.label}</a>
                ) : (
                  button.label
                )}
              </Button>
            ))}
          </div>
        )}
        {imageUrl && (
          <div className="mt-12">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="mx-auto max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  )
}

