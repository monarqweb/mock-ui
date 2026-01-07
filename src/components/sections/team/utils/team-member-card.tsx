import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * SocialLink - Represents a social media link for a team member.
 */
export interface SocialLink {
  /** Social platform name */
  name: string
  /** Link URL */
  href: string
  /** Optional icon component */
  icon?: React.ReactNode
}

/**
 * TeamMemberCardProps - Props for an individual team member card.
 */
export interface TeamMemberCardProps {
  /** Team member name */
  name: string
  /** Team member title/position */
  title: string
  /** Team member bio/description */
  bio?: string
  /** Team member avatar image URL */
  avatarUrl?: string
  /** Alt text for avatar */
  avatarAlt?: string
  /** Array of social media links */
  socialLinks?: SocialLink[]
  /** Additional CSS classes */
  className?: string
}

/**
 * TeamMemberCard - Renders an individual team member card.
 * 
 * This component displays a team member with name, title, bio, avatar, and social links.
 */
export function TeamMemberCard({
  name,
  title,
  bio,
  avatarUrl,
  avatarAlt,
  socialLinks = [],
  className,
}: TeamMemberCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardContent className="pt-6">
        {avatarUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={avatarUrl}
              alt={avatarAlt || name}
              className="size-24 rounded-full object-cover"
            />
          </div>
        )}
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{title}</p>
        {bio && <p className="mb-4 text-sm">{bio}</p>}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.href || social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.name}
              >
                {social.icon || social.name}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

