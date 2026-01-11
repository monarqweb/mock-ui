// Hero sections
export { HeroCentered } from "./hero/hero-centered"
export type { HeroCenteredProps, CTAButton } from "./hero/hero-centered"

// About sections
export { AboutUsDefault } from "./about-us/about-us-default"
export type {
  AboutUsDefaultProps,
  Feature as AboutFeature,
} from "./about-us/about-us-default"

// Footer sections
export { FooterDefault } from "./footer/footer-default"
export type {
  FooterDefaultProps,
  FooterColumn,
  FooterLink,
  SocialLink as FooterSocialLink,
} from "./footer/footer-default"

// Pricing sections
export { PricingGrid } from "./pricing/pricing-grid"
export type { PricingGridProps, PricingPlan } from "./pricing/pricing-grid"
export { PricingCard } from "./pricing/utils/pricing-card"
export type {
  PricingCardProps,
  PricingFeature,
} from "./pricing/utils/pricing-card"

// Features sections
export { FeaturesGrid } from "./features/features-grid"
export type { FeaturesGridProps, Feature } from "./features/features-grid"

// Testimonials sections
export { TestimonialsGrid } from "./testimonials/testimonials-grid"
export type {
  TestimonialsGridProps,
  Testimonial,
} from "./testimonials/testimonials-grid"
export { TestimonialCard } from "./testimonials/utils/testimonial-card"
export type { TestimonialCardProps } from "./testimonials/utils/testimonial-card"

// Contact sections
export { ContactForm } from "./contact/contact-form"
export type { ContactFormProps, ContactInfo } from "./contact/contact-form"

// Services sections
export { ServicesGrid } from "./services/services-grid"
export type { ServicesGridProps, Service } from "./services/services-grid"

// Team sections
export { TeamGrid } from "./team/team-grid"
export type { TeamGridProps, TeamMember } from "./team/team-grid"
export { TeamMemberCard } from "./team/utils/team-member-card"
export type {
  TeamMemberCardProps,
  SocialLink as TeamSocialLink,
} from "./team/utils/team-member-card"

// FAQ sections
export { FAQAccordion } from "./faq/faq-accordion"
export type { FAQAccordionProps, FAQItem } from "./faq/faq-accordion"

// Stats sections
export { StatsGrid } from "./stats/stats-grid"
export type { StatsGridProps, Stat } from "./stats/stats-grid"

// CTA sections
export { CTADefault } from "./cta/cta-default"
export type {
  CTADefaultProps,
  CTAButton as CTASectionButton,
} from "./cta/cta-default"

// Navigation sections
export { NavigationDefault } from "./navigation/navigation-default"
export type {
  NavigationDefaultProps,
  NavigationLink,
} from "./navigation/navigation-default"

// Gallery sections
export { GalleryGrid } from "./gallery/gallery-grid"
export type { GalleryGridProps, GalleryImage } from "./gallery/gallery-grid"

// Blog sections
export { BlogGrid } from "./blog/blog-grid"
export type { BlogGridProps, BlogPost } from "./blog/blog-grid"
export { BlogCard } from "./blog/utils/blog-card"
export type { BlogCardProps } from "./blog/utils/blog-card"
