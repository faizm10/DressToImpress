import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, Clock, Package, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <Image src="/logos/logo4.png" alt="Dress for Success Logo" width={200} height={30} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:text-[#E51937] transition-colors">
              Women
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#E51937] transition-colors">
              Men
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#E51937] transition-colors">
              Occasions
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#E51937] transition-colors">
              How It Works
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-[#E51937] transition-colors">
              About Us
            </Link>
          </nav>

          {/* <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" className="hidden sm:flex">
              Sign In
            </Button>
            <Button className="bg-[#E51937] hover:bg-[#E51937]/80 text-white">Get Started</Button>
          </div> */}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          <div className="relative h-[70vh]">
            <Image
              src="/hero.svg"
              alt="Elegant attire for professional occasions"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Dress to Impress, Without the Stress
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Rent premium attire for any occasion. Look your best without the investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-[#E51937] hover:bg-[#E51937]/80 text-white">
                    Explore Collection
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-[#FFC429] hover:bg-[#FFC429]/20">
                    How It Works
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

       
        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Renting with Dress for Success is simple, affordable, and convenient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
                <p className="text-gray-600">
                  Explore our extensive collection and find the perfect outfit for your occasion.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Your Dates</h3>
                <p className="text-gray-600">Choose your rental period, from 4 to 14 days based on your needs.</p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wear & Return</h3>
                <p className="text-gray-600">
                  Receive your outfit, look amazing, then return it using our prepaid packaging.
                </p>
              </div>
            </div>
          </div>
        </section>

      
        {/* CTA Section */}
        <section className="py-16 bg-[#E51937] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Dress for Success?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join thousands of professionals who rent instead of buy. Save money, reduce waste, and always look your
              best.
            </p>
            <Button size="lg" className="bg-[#FFC429] text-[#000000] hover:bg-[#FFC429]/80">
              Start Browsing Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#000000] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">Dress for Success</h3>
              <p className="text-gray-400 mb-4">
                Premium attire rental for every occasion. Look your best without the investment.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-white hover:text-[#FFC429]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#FFC429]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:text-[#FFC429]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Women's Dresses
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Men's Suits
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Formal Attire
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Business Casual
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Dress for Success. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}