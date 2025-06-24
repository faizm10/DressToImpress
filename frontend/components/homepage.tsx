"use client"

import { useEffect, useState } from "react"
import { Mail, Loader2, ArrowRight, CheckCircle } from "lucide-react"
import type { HomePageContent } from "@/types/content"
import * as LucideIcons from "lucide-react"
import { Header } from "./header"
import { Button } from "./ui/button"

// Helper function to get Lucide icon by name
function getIconComponent(iconName: string) {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent || LucideIcons.HelpCircle
}

export function HomePage() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

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
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    loadContent()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#CC0633]/20 rounded-full animate-pulse"></div>
            <Loader2 className="h-8 w-8 animate-spin text-[#CC0633] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="text-gray-700 font-medium animate-pulse">Loading your experience...</span>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <span className="text-gray-700 text-lg">Unable to load content</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Clean Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section - Enhanced with animations */}
        <section className="relative bg-gradient-to-br from-[#CC0633] via-[#B8002F] to-[#A50028] text-white py-24 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse hidden lg:block"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#FFCC00]/10 rounded-full blur-lg animate-pulse hidden lg:block"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div
              className={`max-w-5xl transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
          

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-tight">
                <span className="block font-medium ">{content.hero.title}:</span>
                <span className="block" >{content.hero.highlightWord}</span>
              </h1>

              
              <p className="mt-4 max-w-4xl text-white leading-relaxed text-lg text-left">
              {content.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a href="/browse" className="group">
                  <Button className="bg-[#FFCC00] hover:bg-[#FFD700] text-gray-900 px-8 py-6 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl group-hover:shadow-[#FFCC00]/25">
                    Browse Now
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Centered Hero Description Section */}
        <section className="flex flex-col items-center justify-center min-h-screen">
           <div
                className={`text-center transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Overview</h2>
                <div className="w-24 h-1 bg-[#FFCC00] mx-auto rounded-full mb-6"></div>
              </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 max-w-3xl w-full">
            <p className="text-gray-700 leading-relaxed  text-lg text-center">
              {content.hero.description}
            </p>
          </div>
        </section>


       

        {/* How It Works Section - Enhanced */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div
                className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">{content.howItWorks.title}</h2>
                <div className="w-24 h-1 bg-[#FFCC00] mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{content.howItWorks.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.howItWorks.steps.map((step, index) => {
                  const IconComponent = getIconComponent(step.icon)
                  return (
                    <div
                      key={step.id}
                      className={`group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${400 + index * 100}ms` }}
                    >
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#CC0633]/10 to-[#CC0633]/5 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-[#CC0633]" />
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FFCC00] to-[#FFD700] text-gray-900 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-[#CC0633] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines Section - Enhanced */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div
                className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">{content.rentalGuidelines.title}</h2>
                <div className="w-24 h-1 bg-[#FFCC00] mx-auto rounded-full mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {content.rentalGuidelines.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {content.rentalGuidelines.rules.map((rule, index) => {
                  const IconComponent = getIconComponent(rule.icon)
                  return (
                    <div
                      key={rule.id}
                      className={`group border-2 border-gray-100 hover:border-[#CC0633]/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#CC0633]/10 to-[#CC0633]/5 rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-[#CC0633]" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-[#CC0633] transition-colors duration-300">
                          {rule.title}
                        </h3>
                      </div>
                      <ul className="space-y-4">
                        {rule.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start group/item">
                            <div className="w-2 h-2 bg-[#CC0633] rounded-full mr-4 mt-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                            <span className="text-gray-700 text-lg leading-relaxed">{item}</span>
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

        {/* CTA Section - Enhanced */}
        <section className="py-20 bg-gradient-to-br from-[#CC0633] via-[#B8002F] to-[#A50028] text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#FFCC00] rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div
              className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-12 leading-tight">{content.cta.title}</h2>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 inline-block">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-medium mb-1">{content.cta.emailLabel}</p>
                      <a
                        href={`mailto:${content.cta.email}`}
                        className="text-[#FFCC00] hover:text-[#FFD700] transition-colors font-semibold text-lg underline decoration-2 underline-offset-4"
                      >
                        {content.cta.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
