import * as React from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/**
 * FooterLink - Represents a link in the footer.
 */
export interface FooterLink {
  /** Link label */
  label: string
  /** Link URL */
  href: string
  /** Optional target attribute */
  target?: "_blank" | "_self"
}

/**
 * FooterColumn - Represents a column of links in the footer.
 */
export interface FooterColumn {
  /** Column title */
  title: string
  /** Array of links in this column */
  links: FooterLink[]
}

/**
 * SocialLink - Represents a social media link.
 */
export interface SocialLink {
  /** Social platform name */
  name: string
  /** Link URL */
  href: string
  /** Optional icon component */
  icon?: React.ReactNode
  /** Optional target attribute */
  target?: "_blank" | "_self"
}

/**
 * FooterDefault - Renders a footer section with links, social media, and copyright information.
 * 
 * This component displays a comprehensive footer typically found at the bottom of websites.
 * It supports multiple columns of links, social media links, copyright text, and optional logo.
 * The number of columns and links is determined by the arrays provided.
 * 
 * @param {FooterDefaultProps} props - Component props
 * @param {FooterColumn[]} [props.columns] - Array of footer columns, each containing a title and links
 * @param {SocialLink[]} [props.socialLinks] - Array of social media links to display
 * @param {string} [props.copyright] - Copyright text (e.g., "© 2024 Company Name")
 * @param {string} [props.logoUrl] - Optional logo image URL
 * @param {string} [props.logoAlt] - Alt text for the logo
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <FooterDefault
 *   columns={[
 *     { title: "Product", links: [{ label: "Features", href: "/features" }] },
 *     { title: "Company", links: [{ label: "About", href: "/about" }] }
 *   ]}
 *   socialLinks={[
 *     { name: "Twitter", href: "https://twitter.com", icon: <TwitterIcon /> }
 *   ]}
 *   copyright="© 2024 Company Name"
 * />
 * ```
 */
export interface FooterDefaultProps {
  /** Array of footer columns, each containing a title and links */
  columns?: FooterColumn[]
  /** Array of social media links to display */
  socialLinks?: SocialLink[]
  /** Copyright text (e.g., "© 2024 Company Name") */
  copyright?: string
  /** Optional logo image URL */
  logoUrl?: string
  /** Alt text for the logo */
  logoAlt?: string
  /** Additional CSS classes */
  className?: string
}

export function FooterDefault({
  columns = [],
  socialLinks = [],
  copyright,
  logoUrl,
  logoAlt = "Logo",
  className,
}: FooterDefaultProps) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {logoUrl && (
            <div className="space-y-4">
              <img src={logoUrl} alt={logoAlt} className="h-8 w-auto" />
            </div>
          )}
          {columns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a
                      href={link.href}
                      target={link.target}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {copyright && (
            <p className="text-sm text-muted-foreground">{copyright}</p>
          )}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href || social.name}
                  href={social.href}
                  target={social.target}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  {social.icon || social.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

