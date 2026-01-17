"use client"

import React, { Children, isValidElement, type ReactElement } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
// Import needed for typeof in type definition
import { SocialIcons } from "@/components/ui/social-icons"

/**
 * Brand Name Footer
 *
 * A visually dominant footer that emphasizes brand presence while providing
 * essential navigation, legal links, contact information, and social follow
 * actions. Designed to leave a strong final impression and reinforce brand
 * credibility.
 *
 * @category footer
 *
 * @intent route_user
 * @intent introduce_brand
 *
 * @tone bold
 * @tone confident
 * @tone modern
 * @tone premium
 *
 * @example
 * ```tsx
 * import { BrandNameFooter } from "@/components/blocks/footer/brand-name-footer"
 * import { LinkList } from "@/components/ui/link-list"
 * import { SocialIcons } from "@/components/ui/social-icons"
 *
 * <BrandNameFooter
 *   content={
 *     <>
 *       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
 *       <LinkList links={[{ label: "About", href: "/about" }]} />
 *       <LinkList links={[{ label: "Contact", href: "/contact" }]} />
 *       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
 *     </>
 *   }
 *   brandName="Chrysalis"
 *   copyright="© 2026 Chrysalis. All rights reserved."
 *   socialIcons={
 *     <SocialIcons
 *       twitter="https://twitter.com/username"
 *       facebook="https://facebook.com/username"
 *       instagram="https://instagram.com/username"
 *       linkedin="https://linkedin.com/in/username"
 *       youtube="https://youtube.com/@username"
 *       email="contact@example.com"
 *     />
 *   }
 * />
 * ```
 */

export interface BrandNameFooterProps {
  /** Optional content to display in columns at the top of the footer. Max 4 columns. */
  content?: React.ReactNode
  /** Brand name to display and animate */
  brandName: string
  /** Copyright text to display */
  copyright?: string
  /** Social icons component to display */
  socialIcons?: ReactElement<typeof SocialIcons>
  /** Additional CSS classes */
  className?: string
}

export function BrandNameFooter({
  content,
  brandName,
  copyright,
  socialIcons,
  className,
}: BrandNameFooterProps) {
  // Helper function to recursively flatten children, extracting them from Fragments
  const flattenChildren = (children: React.ReactNode): React.ReactNode[] => {
    if (!children) return []

    const array = Children.toArray(children)
    const flattened: React.ReactNode[] = []

    for (const child of array) {
      // If it's a Fragment, recursively flatten its children
      if (isValidElement(child)) {
        const element = child as React.ReactElement<{
          children?: React.ReactNode
        }>
        if (element.type === React.Fragment) {
          flattened.push(...flattenChildren(element.props.children))
        } else {
          flattened.push(child)
        }
      } else {
        flattened.push(child)
      }
    }

    return flattened
  }

  const flattenedChildren = flattenChildren(content)
  if (flattenedChildren.length > 4) {
    throw new Error(
      "BrandNameFooter: content supports a maximum of 4 children."
    )
  }
  return (
    <section
      className={cn(
        "bg-primary text-muted-foreground w-full py-10 text-xs",
        className
      )}
    >
      {content && (
        <div className="container flex gap-20">
          {flattenedChildren.map((child, index) => (
            <div key={index} className="flex-1">
              {child}
            </div>
          ))}
        </div>
      )}
      <div className="container mt-32 flex">
        <div className="text-primary-foreground w-full text-left">
          <AnimatedBrandName brandName={brandName} />
        </div>
        {(socialIcons || copyright) && (
          <div className="flex flex-col items-end gap-10 text-right">
            {socialIcons && (
              <div className="text-primary-foreground">{socialIcons}</div>
            )}
            {copyright && <div>{copyright}</div>}
          </div>
        )}
      </div>
    </section>
  )
}

interface AnimatedBrandNameProps {
  brandName: string
}

const AnimatedBrandName = ({ brandName }: AnimatedBrandNameProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="flex items-center text-6xl font-bold tracking-tight lg:text-8xl"
    >
      {brandName.split("").map((char, index) => {
        // Render spaces as regular spaces without animation
        if (char === " ") {
          return <span key={index} className="inline-block w-4" />
        }

        return (
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block overflow-hidden"
          >
            {char}
          </motion.span>
        )
      })}
    </motion.div>
  )
}
