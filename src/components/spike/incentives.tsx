"use client"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

/**
 * Incentives - Renders an incentives section with a carousel of benefit cards.
 *
 * This component displays a section highlighting company benefits or incentives with
 * a title, description, call-to-action button, and a carousel of incentive cards.
 * Each card includes an icon, title, and description. The layout is responsive with
 * mobile carousel and desktop grid views.
 *
 * @param {IncentivesProps} props - Component props
 * @param {Incentive[]} [props.list] - Array of incentive items to display
 * @param {string} [props.overline] - Overline text displayed above the main content
 * @param {object} [props.text] - Text object with strong and regular text
 * @param {object} [props.cta] - Call-to-action object with link and text
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <Incentives />
 * ```
 */

type Incentive = {
  title: string
  icon?: string
  text: string
}

type IncentivesSection = {
  list: Incentive[]
  overline: string
  text: {
    strong: string
    regular: string
  }
  cta: {
    link: string
    text: string
  }
}

export interface IncentivesProps extends IncentivesSection {
  /** Additional CSS classes */
  className?: string
}

const INCENTIVES_SECTION: IncentivesSection = {
  overline: "About",
  text: {
    strong:
      "Engineered for performance, crafted for comfort, and built to endure—",
    regular:
      "our apparel moves with every stride, lift, and rest day. No shortcuts, just advanced fabrics and an exceptional fit.",
  },
  cta: {
    link: "#",
    text: "More About Us",
  },
  list: [
    {
      icon: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
      title: "Eco-Driven Design",
      text: "Created with eco-conscious textiles for top performance and reduced environmental impact.",
    },
    {
      icon: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-2.svg",
      title: "Trusted Checkout",
      text: "Your information stays protected with encrypted checkout for reliable, worry-free transactions.",
    },
    {
      icon: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-3.svg",
      title: "Hassle-Free Returns",
      text: "Not the right feel? Exchange or return your purchase at no cost within 30 days.",
    },
    {
      icon: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-4.svg",
      title: "Global Delivery",
      text: "Wherever you train, we’ll deliver premium activewear right to your doorstep.",
    },
  ],
}

export function Incentives({
  list = INCENTIVES_SECTION.list,
  overline = INCENTIVES_SECTION.overline,
  text = INCENTIVES_SECTION.text,
  cta = INCENTIVES_SECTION.cta,
  className,
}: IncentivesProps) {
  const [current, setCurrent] = useState(0)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return

    const updateCurrent = (api: CarouselApi) => {
      setCurrent(api?.selectedScrollSnap() ?? 0)
    }

    updateCurrent(api)

    api.on("reInit", updateCurrent).on("select", updateCurrent)

    return () => {
      api.off("reInit", updateCurrent).off("select", updateCurrent)
    }
  }, [api])

  return (
    <section className={cn("overflow-hidden py-32", className)}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 justify-between gap-16 lg:grid-cols-2">
          <div className="flex h-full flex-col justify-between gap-8">
            <div className="space-y-4">
              <h2 className="leading-normal font-medium">{overline}</h2>
              <p className="text-xl font-medium sm:text-2xl xl:text-3xl">
                <strong>{text.strong}</strong>
                {text.regular}
              </p>
            </div>
            <div>
              <Button size="lg" className="max-sm:w-full" asChild>
                <a href={cta.link}>{cta.text}</a>
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <Carousel
              opts={{
                breakpoints: {
                  "(min-width: 640px)": {
                    active: false,
                  },
                },
              }}
              setApi={setApi}
              className="[&>div]:overflow-visible"
            >
              <CarouselContent className="sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16">
                {list.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-muted sm:bg-background border-none p-5 shadow-none sm:p-0">
                      <CardContent className="space-y-10 p-0">
                        <img className="size-11" src={item.icon} alt="icon" />
                        <div className="max-w-110 space-y-1">
                          <CardTitle className="text-lg font-medium xl:text-xl">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-balance xl:text-base">
                            {item.text}
                          </CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="bg-primary/30 relative h-px w-full overflow-hidden sm:hidden">
              <div
                style={{
                  width: `${100 / list.length}%`,
                  transform: `translateX(${current * 100}%)`,
                }}
                className="bg-primary absolute z-10 h-full transition-transform duration-300"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
