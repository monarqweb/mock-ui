import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * BlogCardProps - Props for an individual blog post card.
 */
export interface BlogCardProps {
  /** Blog post title */
  title: string
  /** Blog post excerpt/description */
  excerpt?: string
  /** Blog post featured image URL */
  imageUrl?: string
  /** Alt text for the image */
  imageAlt?: string
  /** Author name */
  author?: string
  /** Publication date */
  date?: string
  /** Blog post URL */
  href: string
  /** Optional category/tag */
  category?: string
  /** Optional read time (e.g., "5 min read") */
  readTime?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * BlogCard - Renders an individual blog post card.
 *
 * This component displays a blog post with title, excerpt, image, author, date, and link.
 */
export function BlogCard({
  title,
  excerpt,
  imageUrl,
  imageAlt,
  author,
  date,
  href,
  category,
  readTime,
  className,
}: BlogCardProps) {
  return (
    <Card className={cn("flex flex-col overflow-hidden", className)}>
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        {category && (
          <span className="text-primary mb-2 inline-block text-sm font-semibold">
            {category}
          </span>
        )}
        <CardTitle className="line-clamp-2">{title}</CardTitle>
        {excerpt && (
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {(author || date || readTime) && (
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            {author && <span>{author}</span>}
            {date && <span>• {date}</span>}
            {readTime && <span>• {readTime}</span>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <a href={href}>Read More</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
