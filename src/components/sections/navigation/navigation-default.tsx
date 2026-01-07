import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MenuIcon, XIcon } from "lucide-react"

/**
 * NavigationLink - Represents a navigation link.
 */
export interface NavigationLink {
  /** Link label */
  label: string
  /** Link URL */
  href: string
  /** Optional target attribute */
  target?: "_blank" | "_self"
  /** Whether this link is active/current */
  active?: boolean
}

/**
 * NavigationDefault - Renders a header/navigation bar with logo, links, and CTA button.
 * 
 * This component displays a responsive navigation bar typically found at the top of websites.
 * It supports a logo, array of navigation links, optional CTA button, and mobile menu toggle.
 * The navigation links are rendered from the provided array.
 * 
 * @param {NavigationDefaultProps} props - Component props
 * @param {string} [props.logoUrl] - Logo image URL
 * @param {string} [props.logoAlt] - Alt text for the logo
 * @param {string} [props.logoText] - Alternative text logo (used if logoUrl not provided)
 * @param {NavigationLink[]} [props.links] - Array of navigation links
 * @param {string} [props.ctaLabel] - CTA button label
 * @param {string} [props.ctaHref] - CTA button href
 * @param {Function} [props.onCtaClick] - CTA button onClick handler
 * @param {boolean} [props.sticky] - Whether the navigation should be sticky (default: true)
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <NavigationDefault
 *   logoText="MyBrand"
 *   links={[
 *     { label: "Home", href: "/", active: true },
 *     { label: "About", href: "/about" },
 *     { label: "Contact", href: "/contact" }
 *   ]}
 *   ctaLabel="Get Started"
 *   ctaHref="/signup"
 * />
 * ```
 */
export interface NavigationDefaultProps {
  /** Logo image URL */
  logoUrl?: string
  /** Alt text for the logo */
  logoAlt?: string
  /** Alternative text logo (used if logoUrl not provided) */
  logoText?: string
  /** Array of navigation links */
  links?: NavigationLink[]
  /** CTA button label */
  ctaLabel?: string
  /** CTA button href */
  ctaHref?: string
  /** CTA button onClick handler */
  onCtaClick?: () => void
  /** Whether the navigation should be sticky (default: true) */
  sticky?: boolean
  /** Additional CSS classes */
  className?: string
}

export function NavigationDefault({
  logoUrl,
  logoAlt = "Logo",
  logoText,
  links = [],
  ctaLabel,
  ctaHref,
  onCtaClick,
  sticky = true,
  className,
}: NavigationDefaultProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <nav
      className={cn(
        "border-b bg-background",
        sticky && "sticky top-0 z-50",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            {logoUrl ? (
              <a href="/" className="flex items-center">
                <img src={logoUrl} alt={logoAlt} className="h-8 w-auto" />
              </a>
            ) : logoText ? (
              <a href="/" className="text-xl font-bold">
                {logoText}
              </a>
            ) : null}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                target={link.target}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  link.active
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden items-center gap-4 md:flex">
            {ctaLabel && (
              <Button
                variant="default"
                onClick={onCtaClick}
                asChild={!!ctaHref}
              >
                {ctaHref ? (
                  <a href={ctaHref}>{ctaLabel}</a>
                ) : (
                  ctaLabel
                )}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="size-6" />
            ) : (
              <MenuIcon className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="space-y-4">
              {links.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  target={link.target}
                  className={cn(
                    "block text-base font-medium transition-colors hover:text-foreground",
                    link.active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {ctaLabel && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    onCtaClick?.()
                    setMobileMenuOpen(false)
                  }}
                  asChild={!!ctaHref}
                >
                  {ctaHref ? (
                    <a href={ctaHref}>{ctaLabel}</a>
                  ) : (
                    ctaLabel
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

