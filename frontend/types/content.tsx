export interface HeroContent {
  badge: string
  title: string
  highlightWord: string
  description: string
  buttonText: string
  buttonLink: string
}

export interface HowItWorksStep {
  id: string
  icon: string
  title: string
  description: string
}

export interface HowItWorksContent {
  title: string
  subtitle: string
  steps: HowItWorksStep[]
}

export interface RentalRule {
  id: string
  icon: string
  title: string
  items: string[]
}

export interface RentalGuidelinesContent {
  title: string
  subtitle: string
  rules: RentalRule[]
}

export interface CTAContent {
  title: string
  subtitle?: string
  email: string
  emailLabel: string
}

export interface HomePageContent {
  hero: HeroContent
  howItWorks: HowItWorksContent
  rentalGuidelines: RentalGuidelinesContent
  cta: CTAContent
}
