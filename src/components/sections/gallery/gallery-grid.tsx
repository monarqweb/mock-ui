import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * GalleryImage - Represents an image in the gallery.
 */
export interface GalleryImage {
  /** Image URL */
  url: string
  /** Alt text for the image */
  alt: string
  /** Optional caption/title */
  caption?: string
  /** Optional link URL (makes image clickable) */
  href?: string
  /** Optional onClick handler */
  onClick?: () => void
}

/**
 * GalleryGrid - Renders a gallery section with a grid of images.
 *
 * This component displays a title, description, and a grid of images.
 * The number of images is determined by the length of the `images` array.
 * Each image can include a caption and optional link/onClick handler.
 *
 * @param {GalleryGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {GalleryImage[]} props.images - Array of image objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {"square" | "landscape" | "portrait" | "auto"} [props.aspectRatio] - Image aspect ratio (default: "square")
 * @param {boolean} [props.showCaptions] - Whether to show image captions (default: true)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <GalleryGrid
 *   title="Our Gallery"
 *   images={[
 *     { url: "/image1.jpg", alt: "Image 1", caption: "Beautiful landscape" },
 *     { url: "/image2.jpg", alt: "Image 2", href: "/gallery/image2" }
 *   ]}
 *   columns={4}
 * />
 * ```
 */
export interface GalleryGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of image objects */
  images: GalleryImage[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Image aspect ratio (default: "square") */
  aspectRatio?: "square" | "landscape" | "portrait" | "auto"
  /** Whether to show image captions (default: true) */
  showCaptions?: boolean
  /** Additional CSS classes */
  className?: string
}

export function GalleryGrid({
  title,
  description,
  images,
  columns = 3,
  aspectRatio = "square",
  showCaptions = true,
  className,
}: GalleryGridProps) {
  const aspectRatioClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }

  const ImageWrapper = ({
    image,
    children,
  }: {
    image: GalleryImage
    children: React.ReactNode
  }) => {
    if (image.href) {
      return (
        <a
          href={image.href}
          className="block overflow-hidden rounded-lg transition-transform hover:scale-105"
        >
          {children}
        </a>
      )
    }
    if (image.onClick) {
      return (
        <button
          onClick={image.onClick}
          className="block w-full overflow-hidden rounded-lg transition-transform hover:scale-105"
        >
          {children}
        </button>
      )
    }
    return <div className="overflow-hidden rounded-lg">{children}</div>
  }

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
            "grid gap-4",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 sm:grid-cols-2",
            columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {images.map((image) => (
            <div key={image.url} className="space-y-2">
              <ImageWrapper image={image}>
                <div
                  className={cn(
                    "overflow-hidden",
                    aspectRatioClasses[aspectRatio]
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className={cn(
                      "h-full w-full object-cover",
                      aspectRatio === "auto" && "h-auto w-full"
                    )}
                  />
                </div>
              </ImageWrapper>
              {showCaptions && image.caption && (
                <p className="text-muted-foreground text-sm">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
