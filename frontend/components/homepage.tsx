"use client"

import { useEffect, useState } from "react"
import { Mail, Loader2 } from "lucide-react"
import type { HomePageContent } from "@/types/content"
import * as LucideIcons from "lucide-react"
import { Header } from "./header"

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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#CC0633]" />
          <span className="text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-gray-700">Failed to load content</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Clean Header */}
      <Header/>
      <main className="flex-1">
        {/* Hero Section - Green Background */}
        <section className="bg-gradient-to-r from-[#CC0633] to-[#B8002F] text-white py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">
                {content.hero.title}: {content.hero.highlightWord}
              </h1>
              <p className="text-xl md:text-2xl font-light mb-2 opacity-90">{content.hero.description}</p>
              <p className="text-lg opacity-80">{content.hero.badge}</p>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-normal text-gray-900 mb-8">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {content.hero.description} We acknowledge that there are many other ways to connect and engage, so we
                  invite you to share them with us when we come together!
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Are you someone who identifies as part of our community and is currently approaching the completion of
                  post-secondary education? If you answered yes to this question, then this opportunity may be just for
                  you! Our program is a tailored experience that enhances the professional development experience by
                  providing a culturally welcoming and supportive environment.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Embracing a spirit of growth and learning, our program will support you for the first two years of
                  full-time employment and offers additional one-on-one support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-normal text-gray-900 mb-4">{content.howItWorks.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.howItWorks.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.howItWorks.steps.map((step, index) => {
                  const IconComponent = getIconComponent(step.icon)
                  return (
                    <div key={step.id} className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-[#CC0633]/10 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="h-6 w-6 text-[#CC0633]" />
                        </div>
                        <div className="w-8 h-8 bg-[#FFCC00] text-gray-900 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-normal text-gray-900 mb-4">{content.rentalGuidelines.title}</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">{content.rentalGuidelines.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {content.rentalGuidelines.rules.map((rule) => {
                  const IconComponent = getIconComponent(rule.icon)
                  return (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-[#CC0633]/10 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="h-6 w-6 text-[#CC0633]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{rule.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {rule.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#CC0633] mr-3 mt-1">•</span>
                            <span className="text-gray-700">{item}</span>
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
        <section className="py-16 bg-[#CC0633] text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-light mb-8">{content.cta.title}</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 inline-block">
                <div className="flex items-center justify-center gap-4">
                  <Mail className="h-6 w-6" />
                  <p className="text-lg">
                    {content.cta.emailLabel}{" "}
                    <a
                      href={`mailto:${content.cta.email}`}
                      className="underline hover:text-white/80 transition-colors font-medium"
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
