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
 * CTADefault - Renders a call-to-action section with title, description, and CTA buttons.
 * 
 * This component displays a prominent CTA section typically used to encourage user action.
 * It supports a title, description, and multiple CTA buttons (rendered as an array).
 * The layout is centered and can include optional background styling.
 * 
 * @param {CTADefaultProps} props - Component props
 * @param {string} props.title - CTA title/headline
 * @param {string} [props.description] - Supporting description text
 * @param {CTAButton[]} [props.ctaButtons] - Array of CTA button configurations to display
 * @param {string} [props.backgroundImageUrl] - Optional background image URL
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <CTADefault
 *   title="Ready to Get Started?"
 *   description="Join thousands of satisfied customers today"
 *   ctaButtons={[
 *     { label: "Sign Up Now", variant: "default", onClick: () => console.log("Clicked") },
 *     { label: "Learn More", variant: "outline" }
 *   ]}
 * />
 * ```
 */
export interface CTADefaultProps {
  /** CTA title/headline */
  title: string
  /** Supporting description text */
  description?: string
  /** Array of CTA button configurations to display */
  ctaButtons?: CTAButton[]
  /** Optional background image URL */
  backgroundImageUrl?: string
  /** Additional CSS classes */
  className?: string
}

export function CTADefault({
  title,
  description,
  ctaButtons = [],
  backgroundImageUrl,
  className,
}: CTADefaultProps) {
  return (
    <section
      className={cn(
        "relative py-16 px-4",
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
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {description}
          </p>
        )}
        {ctaButtons.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
      </div>
    </section>
  )
}

