import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Link List
 *
 * A reusable component for rendering a list of links with optional trailing icons.
 * Supports custom icons for each link item, commonly used for external link indicators.
 *
 * @example
 * ```tsx
 * import { ArrowUpRight } from "lucide-react"
 *
 * <LinkList
 *   links={[
 *     { label: "Home", href: "/" },
 *     { label: "Documentation", href: "https://example.com/docs", target: "_blank", trailingIcon: <ArrowUpRight className="size-3.5" /> },
 *     { label: "GitHub", href: "https://github.com", target: "_blank", trailingIcon: <ArrowUpRight className="size-3.5" /> },
 *   ]}
 * />
 * ```
 */

export interface LinkItem {
  /** The display text for the link */
  label: string
  /** The URL destination */
  href: string
  /** Optional trailing icon to display after the label */
  trailingIcon?: React.ReactNode
  /** The target attribute for the link (e.g., "_blank" for external links) */
  target?: string
}

export interface LinkListProps {
  /** Array of link items to display */
  links: LinkItem[]
  /** Additional CSS classes */
  className?: string
}

export function LinkList({ links, className }: LinkListProps) {
  return (
    <ul className={cn("space-y-1", className)}>
      {links.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target={item.target}
            className={cn(
              "tracking-tight text-inherit! hover:opacity-70",
              item.trailingIcon && "group flex items-center gap-1"
            )}
          >
            {item.label}
            {item.trailingIcon}
          </a>
        </li>
      ))}
    </ul>
  )
}
