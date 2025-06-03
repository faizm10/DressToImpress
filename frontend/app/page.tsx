import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, Clock, Package, ArrowRight, Mail, Calendar, Clock4, MapPin, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
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
                  <p className="text-[#E51937] font-medium">Exclusive for Lang Students</p>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Dress for <span className="text-[#E51937]">Impress</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed">
                  Elevate your professional presence with our sustainable fashion program. 
                  Perfect for interviews, presentations, and career events.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <Button
                    size="lg"
                    className="bg-[#E51937] hover:bg-[#E51937]/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Browse Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  {/* <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Sparkles className="h-5 w-5 text-[#FFC429]" />
                    <span>Free for Lang students</span>
                  </div> */}
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
              <h2 className="text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                A simple three-step process to get you looking your best for any professional occasion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#E51937]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E51937]/20 transition-colors">
                  <Search className="h-8 w-8 text-[#E51937]" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Browse & Select</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Explore our curated collection of professional attire available for your selected dates
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#E51937]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E51937]/20 transition-colors">
                  <Clock className="h-8 w-8 text-[#E51937]" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Pick Up</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Collect your items from the Business Career Development Centre (MACS 101)
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#E51937]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#E51937]/20 transition-colors">
                  <Package className="h-8 w-8 text-[#E51937]" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Return</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Simply return your items - we handle the cleaning for the next student
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Rules Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6">Rental Guidelines</h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Simple rules to ensure everyone has access to professional attire
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#E51937]/10 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-[#E51937]" />
                    </div>
                    <h3 className="text-2xl font-semibold">Rental Period</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Two-week rental period from pickup date</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Extensions available with BCDC approval</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#E51937]/10 rounded-xl flex items-center justify-center">
                      <Clock4 className="h-6 w-6 text-[#E51937]" />
                    </div>
                    <h3 className="text-2xl font-semibold">Operating Hours</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Monday to Friday: 8:30 AM - 4:30 PM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Closed on weekends and holidays</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#E51937]/10 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#E51937]" />
                    </div>
                    <h3 className="text-2xl font-semibold">Location</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Business Career Development Centre (MACS 101)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>All pickups and returns must be done in person</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#E51937]/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[#E51937]" />
                    </div>
                    <h3 className="text-2xl font-semibold">Additional Info</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>No cleaning required - we handle all dry cleaning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#E51937] mt-1">•</span>
                      <span>Items must be returned in good condition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[#E51937] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8">Contribute to the Program</h2>
              <p className="text-xl mb-12 text-white/90">
                Help fellow Lang students succeed by donating your professional attire
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block">
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6" />
                  <p className="text-lg">
                    Email us at{" "}
                    <a 
                      href="mailto:langcareers@uoguelph.ca" 
                      className="underline hover:text-[#FFC429] transition-colors"
                    >
                      langcareers@uoguelph.ca
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
