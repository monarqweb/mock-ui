import { cn } from "@/lib/utils"
import { BlogCard, type BlogCardProps } from "./utils/blog-card"

/**
 * BlogPost - Represents a blog post configuration.
 */
export type BlogPost = BlogCardProps

/**
 * BlogGrid - Renders a blog section with a grid of blog post cards.
 *
 * This component displays a title, description, and a grid of blog post cards.
 * The number of blog post cards is determined by the length of the `posts` array.
 * Card rendering uses the BlogCard sub-component from the utils directory.
 *
 * @param {BlogGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {BlogPost[]} props.posts - Array of blog post objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <BlogGrid
 *   title="Latest Blog Posts"
 *   posts={[
 *     {
 *       title: "Getting Started with React",
 *       excerpt: "Learn the basics of React...",
 *       author: "John Doe",
 *       date: "Jan 1, 2024",
 *       href: "/blog/getting-started-react",
 *       imageUrl: "/blog/react.jpg"
 *     }
 *   ]}
 * />
 * ```
 */
export interface BlogGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of blog post objects */
  posts: BlogPost[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function BlogGrid({
  title,
  description,
  posts,
  columns = 3,
  className,
}: BlogGridProps) {
  return (
    <section className={cn("px-4 py-16", className)}>
      <div className="mx-auto max-w-7xl">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground mt-4 text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        <div
          className={cn(
            "grid gap-6",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {posts.map((post) => (
            <BlogCard key={post.href || post.title} {...post} />
          ))}
        </div>
      </div>
    </section>
  )
}
