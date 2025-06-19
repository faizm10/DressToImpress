"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import type { HomePageContent } from "@/types/content"
import * as LucideIcons from "lucide-react"

// Helper function to get Lucide icon by name
function getIconComponent(iconName: string) {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent || LucideIcons.HelpCircle
}

export function HomePage() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/content")
        if (response.ok) {
          const data = await response.json()
          setContent(data.content)
        } else {
          console.error("Failed to load content")
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!content) {
    return <div className="flex items-center justify-center min-h-screen">Failed to load content</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#E51937]/5 via-white to-[#FFC429]/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2 text-black dark:text-white">
                <div className="inline-block px-4 py-2 bg-[#E51937]/10 rounded-full mb-6">
                  <p className="text-[#E51937] font-medium">{content.hero.badge}</p>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {content.hero.title} <span className="text-[#E51937]">{content.hero.highlightWord}</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {content.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <a href={content.hero.buttonLink}>
                    <Button
                      size="lg"
                      className="bg-[#E51937] hover:bg-[#E51937]/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {content.hero.buttonText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 h-[60vh] md:h-[80vh] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E51937]/20 to-[#FFC429]/20 rounded-3xl transform rotate-3"></div>
                <Image
                  src="/hero.svg"
                  alt="Business attire for Lang students"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-6">{content.howItWorks.title}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{content.howItWorks.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.howItWorks.steps.map((step) => {
                const IconComponent = getIconComponent(step.icon)
                return (
                  <div
                    key={step.id}
                    className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-[#E51937]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E51937]/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-[#E51937]" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Rental Rules Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">{content.rentalGuidelines.title}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">{content.rentalGuidelines.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {content.rentalGuidelines.rules.map((rule) => {
                  const IconComponent = getIconComponent(rule.icon)
                  return (
                    <div key={rule.id} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#E51937]/10 rounded-xl flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-[#E51937]" />
                        </div>
                        <h3 className="text-2xl font-semibold">{rule.title}</h3>
                      </div>
                      <ul className="space-y-4">
                        {rule.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-[#E51937] mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#E51937] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">{content.cta.title}</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6" />
                  <p className="text-lg">
                    {content.cta.emailLabel}{" "}
                    <a
                      href={`mailto:${content.cta.email}`}
                      className="underline hover:text-[#FFC429] transition-colors"
                    >
                      {content.cta.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
