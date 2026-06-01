"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search as SearchIcon, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("search"), href: "/search" },
    { name: t("companies"), href: "/companies" },
    { name: t("categories"), href: "/categories" },
  ];

  // Helper to remove locale from pathname for comparison
  const isActive = (href: string) => {
    if (href === "/") return pathname.endsWith("/en") || pathname.endsWith("/ar");
    return pathname.includes(href);
  };

  if (pathname.includes('/dashboard') || pathname.includes('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-white/10 py-4 shadow-2xl"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${pathname.split('/')[1] || 'en'}`} className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300">
            P
          </span>
          Perfume<span className="text-emerald-500 font-light group-hover:text-emerald-400 transition-colors">Ex</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={`/${pathname.split('/')[1] || 'en'}${link.href === '/' ? '' : link.href}`}
              className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                isActive(link.href) ? "text-emerald-500" : "text-zinc-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher currentLocale={pathname.split('/')[1] || 'en'} />
          
          <Link href={`/${pathname.split('/')[1] || 'en'}/login`} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors flex items-center gap-2">
            <User className="w-4 h-4" />
            {t("login")}
          </Link>
          
          <Link
            href={`/${pathname.split('/')[1] || 'en'}/register`}
            className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-emerald-50 transition-colors hover:scale-105 active:scale-95"
          >
            {t("register")}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher currentLocale={pathname.split('/')[1] || 'en'} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={`/${pathname.split('/')[1] || 'en'}${link.href === '/' ? '' : link.href}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium py-2 transition-colors ${
                    isActive(link.href) ? "text-emerald-500" : "text-zinc-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <Link
                href={`/${pathname.split('/')[1] || 'en'}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-white py-2 flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                {t("login")}
              </Link>
              <Link
                href={`/${pathname.split('/')[1] || 'en'}/register`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-center w-full py-3 mt-2 rounded-xl bg-white text-black font-bold"
              >
                {t("register")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
