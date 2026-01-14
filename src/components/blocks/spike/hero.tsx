import { MoveUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Hero - Renders a hero section with full-width background image, headline, and call-to-action.
 *
 * This component displays a prominent hero section typically used at the top of a page.
 * It supports a background image, subtitle, title, description text, and an optional CTA button.
 * The layout is optimized for full-screen viewport height with responsive design.
 *
 * @param {HeroProps} props - Component props
 * @param {string} props.title - Main hero title/headline
 * @param {string} [props.subtitle] - Optional subtitle text (displayed above title)
 * @param {string} [props.text] - Optional description text (displayed below title)
 * @param {string} [props.backgroundImage] - Optional background image URL
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Hero
 *   title="Designing Distinctive Spaces with Cutting-Edge Architectural Innovations"
 *   subtitle="#WORLDS NUMBER ONE"
 *   text="Harnessing the power of architecture to reshape lives and uplift communities."
 * />
 * ```
 */
export interface HeroProps {
  /** Main hero title/headline */
  title: string
  /** Optional subtitle text (displayed above title) */
  subtitle?: string
  /** Optional description text (displayed below title) */
  text?: string
  /** Optional background image URL */
  backgroundImage?: string
  /** Additional CSS classes */
  className?: string
}

const DEFAULT_BACKGROUND_IMAGE =
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/andrew-kliatskyi-MaVm_A0xhKk-unsplash.jpg"

export function Hero({
  title,
  subtitle,
  text,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "dark font-poppins relative h-svh max-h-[1400px] w-full overflow-hidden bg-cover bg-center bg-no-repeat py-12 after:absolute after:top-0 after:left-0 after:block after:h-full after:w-full after:bg-black/65 after:content-[''] md:py-20",
        className
      )}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="relative z-20 container h-full w-full max-w-[85rem]">
        <div className="flex h-full w-full flex-col justify-end gap-12">
          <div className="flex max-w-[61.375rem] flex-col gap-1">
            {subtitle && (
              <p className="text-muted-foreground text-sm leading-none uppercase">
                {subtitle}
              </p>
            )}
            <h1 className="text-foreground text-3xl leading-snug! md:text-4xl lg:text-6xl">
              {title}
            </h1>
          </div>
          <div className="flex w-full flex-col justify-between gap-5 sm:flex-row sm:items-center">
            {text && (
              <p className="border-muted-foreground text-muted-foreground max-w-[20.25rem] border-l pl-6 text-base">
                {text}
              </p>
            )}
            <div className="shrink-0">
              <Button
                asChild
                variant="outline"
                className="group border-muted-foreground/40 text-foreground flex h-fit w-fit items-center gap-3 rounded-full border bg-transparent px-6 py-4 text-sm uppercase hover:bg-transparent"
              >
                <a href="#">
                  <p className="group-hover:underline">Our projects</p>
                  <MoveUpRight className="fill-foreground h-4! w-4! transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
