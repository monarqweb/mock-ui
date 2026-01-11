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
import { CheckIcon } from "lucide-react"

/**
 * PricingFeature - Represents a feature included in a pricing plan.
 */
export interface PricingFeature {
  /** Feature text */
  text: string
  /** Whether this feature is included (true) or not (false) */
  included: boolean
}

/**
 * PricingCardProps - Props for an individual pricing card.
 */
export interface PricingCardProps {
  /** Plan name */
  name: string
  /** Plan price (number, will be formatted) */
  price: number
  /** Currency symbol (default: "$") */
  currency?: string
  /** Billing period (e.g., "month", "year") */
  period?: string
  /** Plan description */
  description?: string
  /** Array of features included in this plan */
  features?: PricingFeature[]
  /** CTA button label */
  ctaLabel?: string
  /** CTA button onClick handler */
  onCtaClick?: () => void
  /** Whether this plan is featured/highlighted */
  featured?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * PricingCard - Renders an individual pricing plan card.
 *
 * This component displays a single pricing plan with name, price, features, and CTA button.
 * Can be marked as featured to highlight a recommended plan.
 */
export function PricingCard({
  name,
  price,
  currency = "$",
  period = "month",
  description,
  features = [],
  ctaLabel = "Get Started",
  onCtaClick,
  featured = false,
  className,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col",
        featured && "border-primary shadow-lg",
        className
      )}
    >
      {featured && (
        <div className="bg-primary text-primary-foreground rounded-t-xl px-6 py-2 text-center text-sm font-semibold">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {currency}
            {price}
          </span>
          {period && (
            <span className="text-muted-foreground ml-2 text-sm">
              /{period}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature.text} className="flex items-start gap-3">
                {feature.included ? (
                  <CheckIcon className="text-primary mt-0.5 size-5 shrink-0" />
                ) : (
                  <span className="text-muted-foreground mt-0.5 size-5 shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    !feature.included && "text-muted-foreground line-through"
                  )}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={featured ? "default" : "outline"}
          onClick={onCtaClick}
        >
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
