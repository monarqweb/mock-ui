import { cn } from "@/lib/utils"
import {
  TeamMemberCard,
  type TeamMemberCardProps,
} from "./utils/team-member-card"

/**
 * TeamMember - Represents a team member configuration.
 */
export type TeamMember = TeamMemberCardProps

/**
 * TeamGrid - Renders a team section with a grid of team member cards.
 *
 * This component displays a title, description, and a grid of team member cards.
 * The number of team member cards is determined by the length of the `members` array.
 * Card rendering uses the TeamMemberCard sub-component from the utils directory.
 *
 * @param {TeamGridProps} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.description] - Section description
 * @param {TeamMember[]} props.members - Array of team member objects
 * @param {number} [props.columns] - Number of columns in the grid (default: 3)
 * @param {string} [props.className] - Additional CSS classes
 *
 * @example
 * ```tsx
 * <TeamGrid
 *   title="Our Team"
 *   members={[
 *     {
 *       name: "John Doe",
 *       title: "CEO",
 *       bio: "10+ years of experience",
 *       avatarUrl: "/team/john.jpg",
 *       socialLinks: [{ name: "LinkedIn", href: "https://linkedin.com/in/johndoe" }]
 *     }
 *   ]}
 * />
 * ```
 */
export interface TeamGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of team member objects */
  members: TeamMember[]
  /** Number of columns in the grid (default: 3) */
  columns?: number
  /** Additional CSS classes */
  className?: string
}

export function TeamGrid({
  title,
  description,
  members,
  columns = 3,
  className,
}: TeamGridProps) {
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
          {members.map((member) => (
            <TeamMemberCard
              key={`${member.name}-${member.title}`}
              {...member}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
