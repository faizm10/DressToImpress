"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./theme-switcher";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
// import { categories } from "@/lib/data";
import { Button } from "./ui/button";
import { LOGO } from "@/lib/data";
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
        <div className="flex items-center justify-between h-20">
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
              src={LOGO}
              alt="Dress for Success Logo"
              width={200}
              height={30}
              className="dark:invert"
            />
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center gap-1">
            <div className="relative group ß">
              <a href="/browse">Browse</a>
            </div>
          </nav> */}

          {/* Right side actions */}
          <div className="flex items-center gap-5">
            <a href="#how-it-works" className="group">
              How It Works
            </a>
            <a href="#rental-guidelines" className="group">
              Rental Guidelines
            </a>
            <a href="/browse" className="group">
              Clothing Catelogue
            </a>
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
                <Link
                  href="/explore"
                  className="block py-2 text-sm font-medium"
                >
                  Explore
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
