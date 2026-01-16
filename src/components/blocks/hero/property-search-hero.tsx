import * as React from "react"
import { MoveUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Property Search Hero
 *
 * A full-bleed hero section for real estate platforms that combines a strong
 * aspirational headline with an inline property search experience. Designed
 * to help users quickly discover listings that match their preferences while
 * reinforcing trust and sophistication.
 *
 * @category hero
 *
 * @industry real_estate
 *
 * @intent conversion_push
 * @intent route_user
 * @intent introduce_brand
 *
 * @tone premium
 * @tone confident
 * @tone modern
 *
 */

export interface FormField {
  /** Unique identifier for the field */
  id: string
  /** Label text displayed above the input */
  label: string
  /** Placeholder text for the input */
  placeholder: string
  /** Current value of the field */
  value: string
  /**
   * Emitted when the field value changes
   *
   * @event formField:change
   * @when User types in a text input or selects an option from a dropdown
   * @payload { value: string }
   */
  onChange: (value: string) => void
  /** Field type (default 'text', 'select' shows dropdown chevron) */
  type?: "text" | "select"
  /** Options for select type fields */
  options?: { value: string; label: string }[]
}

export interface PropertySearchHeroProps {
  /** Main hero title/headline (supports HTML/JSX for bold, italics, etc.) */
  title: string | React.ReactNode
  /** Optional description text (displayed below title) */
  text?: string
  /** Optional background image URL */
  backgroundImage?: string
  /** Optional search form configuration */
  form?: PropertySearchHeroForm
  /** Additional CSS classes */
  className?: string
}

export interface PropertySearchHeroForm {
  /** Array of form fields */
  fields: FormField[]

  /** Search button text (defaults to "Search") */
  buttonText?: string

  /**
   * Called when the search form is submitted
   *
   * @event search
   * @when User clicks the search button or submits the form
   * @payload Record<string, FormField>
   */
  onSearch?: (fields: Record<string, FormField>) => void
}

const DEFAULT_BACKGROUND_IMAGE =
  "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/full-width-backgrounds/andrew-kliatskyi-MaVm_A0xhKk-unsplash.jpg"

export function PropertySearchHero({
  title,
  text,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
  form,
  className,
}: PropertySearchHeroProps) {
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
            <h1 className="text-foreground text-3xl leading-snug! md:text-4xl lg:text-6xl">
              {title}
            </h1>
          </div>
          {form && form.fields.length > 0 && (
            <div className="w-full max-w-[61.375rem]">
              <form
                className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:gap-3"
                onSubmit={(e) => {
                  e.preventDefault()
                  const fieldsRecord = form.fields.reduce(
                    (acc, field) => {
                      acc[field.id] = field
                      return acc
                    },
                    {} as Record<string, FormField>
                  )
                  form.onSearch?.(fieldsRecord)
                }}
              >
                {form.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex flex-1 flex-col gap-2 sm:flex-initial"
                  >
                    <Label
                      htmlFor={field.id}
                      className="text-foreground text-sm font-medium"
                    >
                      {field.label}
                    </Label>
                    {field.type === "select" ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id={field.id}
                          className="text-foreground h-12 w-full rounded-lg border-0 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-white/50"
                        >
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="text-foreground placeholder:text-muted-foreground h-12 w-full rounded-lg border-0 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-white/50"
                      />
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 sm:flex-initial">
                  <Label className="text-foreground text-sm font-medium opacity-0">
                    Search
                  </Label>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-lg bg-gradient-to-r from-red-600 to-red-800 px-6 font-medium text-white shadow-sm transition-all hover:from-red-700 hover:to-red-900 sm:w-auto"
                  >
                    {form.buttonText || "Search"}
                  </Button>
                </div>
              </form>
            </div>
          )}
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
