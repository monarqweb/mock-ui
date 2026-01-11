import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

/**
 * FAQItem - Represents a frequently asked question item.
 */
export interface FAQItem {
  /** Question text */
  question: string
  /** Answer text */
  answer: string
  /** Optional unique ID (auto-generated if not provided) */
  id?: string
}

/**
 * FAQAccordion - Renders an FAQ section with an accordion of questions and answers.
 *
 * This component displays a title, description, and an accordion of FAQ items.
 * The number of FAQ items is determined by the length of the `items` array.
 * Each item can be expanded/collapsed to show the answer.
 *
 * @param {FAQAccordionProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {FAQItem[]} props.items - Array of FAQ item objects
 * @param {"single" | "multiple"} [props.type] - Accordion type - single or multiple items open (default: "single")
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <FAQAccordion
 *   title="Frequently Asked Questions"
 *   items={[
 *     { question: "What is this?", answer: "This is a product..." },
 *     { question: "How does it work?", answer: "It works by..." }
 *   ]}
 * />
 * ```
 */
export interface FAQAccordionProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of FAQ item objects */
  items: FAQItem[]
  /** Accordion type - single or multiple items open (default: "single") */
  type?: "single" | "multiple"
  /** Additional CSS classes */
  className?: string
}

export function FAQAccordion({
  title,
  description,
  items,
  type = "single",
  className,
}: FAQAccordionProps) {
  return (
    <section className={cn("px-4 py-16", className)}>
      <div className="mx-auto max-w-3xl">
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
        <Accordion type={type} className="w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={item.id || `faq-${index}`}
              value={item.id || `faq-${index}`}
            >
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
