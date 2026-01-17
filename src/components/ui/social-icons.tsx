import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
} from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Social Icons
 *
 * A component for displaying social media icons with links. Each icon is rendered
 * only if its corresponding URL prop is provided.
 *
 * @example
 * ```tsx
 * <SocialIcons
 *   twitter="https://twitter.com/username"
 *   facebook="https://facebook.com/username"
 *   instagram="https://instagram.com/username"
 *   linkedin="https://linkedin.com/in/username"
 *   youtube="https://youtube.com/@username"
 *   email="contact@example.com"
 * />
 * ```
 */

export interface SocialIconsProps {
  /** Twitter/X URL */
  twitter?: string
  /** Facebook URL */
  facebook?: string
  /** Instagram URL */
  instagram?: string
  /** LinkedIn URL */
  linkedin?: string
  /** YouTube URL */
  youtube?: string
  /** Email address */
  email?: string
  /** Additional CSS classes */
  className?: string
}

const iconMap = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  email: Mail,
} as const

export function SocialIcons({
  twitter,
  facebook,
  instagram,
  linkedin,
  youtube,
  email,
  className,
}: SocialIconsProps) {
  const socialLinks = [
    { key: "twitter", url: twitter, icon: iconMap.twitter },
    { key: "facebook", url: facebook, icon: iconMap.facebook },
    { key: "instagram", url: instagram, icon: iconMap.instagram },
    { key: "linkedin", url: linkedin, icon: iconMap.linkedin },
    { key: "youtube", url: youtube, icon: iconMap.youtube },
    {
      key: "email",
      url: email ? `mailto:${email}` : undefined,
      icon: iconMap.email,
    },
  ].filter((link) => link.url)

  if (socialLinks.length === 0) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {socialLinks.map(({ key, url, icon: Icon }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-foreground/70 transition-colors"
          aria-label={`Visit our ${key} page`}
        >
          <Icon className="size-5" />
        </a>
      ))}
    </div>
  )
}
