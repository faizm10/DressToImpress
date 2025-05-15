"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./theme-switcher";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/data";
import { Button } from "./ui/button";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleDropdown = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-zinc-900/90 shadow-sm backdrop-blur-sm"
          : "bg-white dark:bg-zinc-900"
      } border-b border-zinc-200 dark:border-zinc-800`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/logo4.png"
              alt="Dress for Success Logo"
              width={150}
              height={24}
              className="dark:invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <div className="relative group">
              <button
                onClick={() => handleDropdown("men")}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-[#E51937] transition-colors"
                aria-expanded={activeDropdown === "men"}
              >
                Men
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "men" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "men" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-48 bg-white dark:bg-zinc-900 shadow-lg rounded-md border border-zinc-200 dark:border-zinc-800 py-2"
                  >
                    {categories.men.map((item) => (
                      <Link
                        key={item}
                        href={`/category/men/${item.toLowerCase()}`}
                        className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#E51937]"
                      >
                        {item}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative group">
                <a href="/browse">
                Browse
                </a>
            </div>
            <div className="relative group">
              <button
                onClick={() => handleDropdown("women")}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-[#E51937] transition-colors"
                aria-expanded={activeDropdown === "women"}
              >
                Women
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeDropdown === "women" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeDropdown === "women" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-48 bg-white dark:bg-zinc-900 shadow-lg rounded-md border border-zinc-200 dark:border-zinc-800 py-2"
                  >
                    {categories.women.map((item) => (
                      <Link
                        key={item}
                        href={`/category/women/${item.toLowerCase()}`}
                        className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-[#E51937]"
                      >
                        {item}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* <Link
              href="/how-it-works"
              className="px-3 py-2 text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium hover:text-[#E51937] transition-colors"
            >
              About Us
            </Link> */}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-5">
            {/* <ModeToggle /> */}
            <Link href="/auth/login">
              <Button className="bg-[#E51937]">Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div className="space-y-1">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <button
                    onClick={() => handleDropdown("mobile-women")}
                    className="flex items-center justify-between w-full py-2 text-sm font-medium"
                  >
                    Women
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        activeDropdown === "mobile-women" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === "mobile-women" && (
                    <div className="pl-4 space-y-2 mt-2">
                      {categories.women.map((item) => (
                        <Link
                          key={item}
                          href={`/category/women/${item.toLowerCase()}`}
                          className="block py-1 text-sm hover:text-[#E51937]"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <button
                    onClick={() => handleDropdown("mobile-men")}
                    className="flex items-center justify-between w-full py-2 text-sm font-medium"
                  >
                    Men
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        activeDropdown === "mobile-men" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {activeDropdown === "mobile-men" && (
                    <div className="pl-4 space-y-2 mt-2">
                      {categories.men.map((item) => (
                        <Link
                          key={item}
                          href={`/category/men/${item.toLowerCase()}`}
                          className="block py-1 text-sm hover:text-[#E51937]"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* <Link
                  href="/how-it-works"
                  className="block py-2 text-sm font-medium border-b border-zinc-200 dark:border-zinc-800"
                >
                  How It Works
                </Link>
                <Link href="/about" className="block py-2 text-sm font-medium">
                  About Us
                </Link> */}
              </div>

              {/* <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 p-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-l-md focus:outline-none"
                  />
                  <button className="p-2 bg-[#E51937] text-white rounded-r-md">
                    <Search size={18} />
                  </button>
                </div>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
