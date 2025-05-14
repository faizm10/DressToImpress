import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, Clock, Package, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <Image
              src="/logos/logo4.png"
              alt="Dress for Success Logo"
              width={200}
              height={30}
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              Women
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              Men
            </Link>

            <Link
              href="#"
              className="text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              About Us
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#000000] py-12 md:py-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Left side - Content */}
              <div className="md:w-1/2 text-white md:py-20">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Dress to Impress, Without the Stress
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Rent premium attire for any occasion. Look your best without
                  the investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-[#E51937] hover:bg-[#E51937]/80 text-white"
                  >
                    Explore Collection
                  </Button>
                  <Button
                    size="lg"
                    className="bg-[#FFC429] text-[#000000] hover:bg-[#FFC429]/80"
                  >
                    How It Works
                  </Button>
                </div>
              </div>

              {/* Right side - Image */}
              <div className="md:w-1/2 mt-8 md:mt-0 h-[50vh] md:h-[70vh] relative">
                <Image
                  src="/hero.svg"
                  alt="Elegant attire for professional occasions"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Renting with Dress for Success is simple, affordable, and
              convenient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
                <p className="text-gray-600">
                  Explore our extensive collection and find the perfect outfit
                  for your occasion.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Your Dates</h3>
                <p className="text-gray-600">
                  Choose your rental period, from 4 to 14 days based on your
                  needs.
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wear & Return</h3>
                <p className="text-gray-600">
                  Receive your outfit, look amazing, then return it using our
                  prepaid packaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#E51937] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Dress for Success?
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/80">
              Join thousands of professionals who rent instead of buy. Save
              money, reduce waste, and always look your best.
            </p>
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-[#FFC429] text-[#000000] hover:bg-[#FFC429]/80"
              >
                Start Browsing Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
