import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * TestimonialCardProps - Props for an individual testimonial card.
 */
export interface TestimonialCardProps {
  /** Testimonial text/quote */
  quote: string
  /** Author name */
  author: string
  /** Author title/position */
  authorTitle?: string
  /** Author company */
  company?: string
  /** Author avatar image URL */
  avatarUrl?: string
  /** Alt text for avatar */
  avatarAlt?: string
  /** Optional rating (1-5 stars) */
  rating?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * TestimonialCard - Renders an individual testimonial card.
 * 
 * This component displays a customer testimonial with quote, author information, and optional rating.
 */
export function TestimonialCard({
  quote,
  author,
  authorTitle,
  company,
  avatarUrl,
  avatarAlt,
  rating,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="pt-6">
        {rating !== undefined && (
          <div className="mb-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "text-lg",
                  i < rating ? "text-yellow-400" : "text-muted-foreground"
                )}
              >
                ★
              </span>
            ))}
          </div>
        )}
        <blockquote className="mb-6 text-lg leading-relaxed">
          "{quote}"
        </blockquote>
        <div className="flex items-center gap-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={avatarAlt || author}
              className="size-12 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold">{author}</div>
            {(authorTitle || company) && (
              <div className="text-muted-foreground text-sm">
                {authorTitle}
                {authorTitle && company && " at "}
                {company}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

