import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Clock, Package, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-0">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Left side - Content */}
              <div className="md:w-1/2 text-black md:py-20 dark:text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Dress to Impress Program
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Have an interview or presentation coming up but nothing to
                  wear? The Business Career Development Centre has you covered!
                  The Dress to Impress program allows Lang students to borrow
                  business casual attire for all of their academic and job
                  search needs.
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
                  alt="Business attire for Lang students"
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
              Borrowing business attire with the Dress to Impress program is
              simple and convenient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Select</h3>
                <p className="text-gray-600">
                  Browse our catalogue to view which items are available for
                  your selected date(s).
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pick Up</h3>
                <p className="text-gray-600">
                  We'll notify you when your items are ready for pickup at the
                  Business Career Development Centre (MACS 101).
                </p>
              </div>

              <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#FFC429]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-[#E51937]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Return</h3>
                <p className="text-gray-600">
                  Return items to the BCDC - no need to worry about cleaning, as
                  we'll handle the dry cleaning for future students.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Rules Section */}
        <section className="py-12 ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Rental Rules
            </h2>
            <div className="max-w-3xl mx-auto p-6">
              <Alert>
                <AlertTitle>Rental Rules</AlertTitle>
                <AlertDescription>
                  All items must be returned within two weeks of the rental
                  date.
                </AlertDescription>

                <AlertDescription>
                  All items must be returned within two weeks of the rental
                  date.
                </AlertDescription>
                <AlertDescription>
                  Rentals may be extended with permission from the BCDC.
                </AlertDescription>
                <AlertDescription>
                  All pick ups and drop offs must be completed at the Business
                  Career Development Centre (MACS 101) within our hours of
                  operation (Monday - Friday, 8:30 - 4:30).
                </AlertDescription>
                <AlertDescription>
                  No cleaning necessary - we'll handle the dry cleaning so other
                  Lang students can benefit from the program.
                </AlertDescription>
              </Alert>
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
              This sustainable initiative helps B.Comm students put their best
              foot forward, thanks to generous clothing donations from the Lang
              community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-[#FFC429] text-[#000000] hover:bg-[#FFC429]/80"
                >
                  Start Browsing Now
                </Button>
              </Link>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-lg inline-block">
              <p className="text-white font-medium">
                Looking to donate clothes to the program? Email{" "}
                <a href="mailto:langcareers@uoguelph.ca" className="underline">
                  langcareers@uoguelph.ca
                </a>
                !
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
