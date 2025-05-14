import React from "react";
import Image from "next/image";
import Link from "next/link";
export const Header = () => {
  return (
    <>
      {" "}
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
    </>
  );
};
