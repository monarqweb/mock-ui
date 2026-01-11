import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * ContactInfo - Represents contact information item.
 */
export interface ContactInfo {
  /** Contact method label (e.g., "Email", "Phone") */
  label: string
  /** Contact value (e.g., "contact@example.com") */
  value: string
  /** Optional icon component */
  icon?: React.ReactNode
  /** Optional link URL */
  href?: string
}

/**
 * ContactForm - Renders a contact section with contact form and/or contact information.
 *
 * This component displays a contact form for users to send messages, along with optional
 * contact information (email, phone, address, etc.). The form includes fields for name,
 * email, subject, and message. Contact info items are displayed as an array.
 *
 * @param {ContactFormProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {boolean} [props.showForm] - Whether to show the contact form (default: true)
 * @param {ContactInfo[]} [props.contactInfo] - Array of contact information items
 * @param {string} [props.formAction] - Form submission action URL
 * @param {string} [props.formMethod] - Form submission method (default: "post")
 * @param {Function} [props.onSubmit] - Optional form submit handler
 * @param {string} [props.submitLabel] - Submit button label (default: "Send Message")
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <ContactForm
 *   title="Get in Touch"
 *   showForm={true}
 *   contactInfo={[
 *     { label: "Email", value: "contact@example.com", href: "mailto:contact@example.com" },
 *     { label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" }
 *   ]}
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */
export interface ContactFormProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Whether to show the contact form (default: true) */
  showForm?: boolean
  /** Array of contact information items */
  contactInfo?: ContactInfo[]
  /** Form submission action URL */
  formAction?: string
  /** Form submission method (default: "post") */
  formMethod?: "get" | "post"
  /** Optional form submit handler */
  onSubmit?: (data: FormData) => void
  /** Submit button label (default: "Send Message") */
  submitLabel?: string
  /** Additional CSS classes */
  className?: string
}

export function ContactForm({
  title,
  description,
  showForm = true,
  contactInfo = [],
  formAction,
  formMethod = "post",
  onSubmit,
  submitLabel = "Send Message",
  className,
}: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      const formData = new FormData(e.currentTarget)
      onSubmit(formData)
    } else if (formAction) {
      e.currentTarget.submit()
    }
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
        <div className="grid gap-8 lg:grid-cols-2">
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <form
                  action={formAction}
                  method={formMethod}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" name="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" rows={6} required />
                  </div>
                  <Button type="submit" className="w-full">
                    {submitLabel}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {contactInfo.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    {info.icon && <div className="mt-1">{info.icon}</div>}
                    <div>
                      <div className="font-semibold">{info.label}</div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-muted-foreground">
                          {info.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
