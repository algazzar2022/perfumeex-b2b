"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LayoutDashboard, LogOut, Bell } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const { data: session, status } = useSession();

  const locale = pathname.split('/')[1] || 'en';
  const isAr = locale === 'ar';

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/messages')
        .then(res => res.ok ? res.json() : { messages: [] })
        .then(data => {
          if (data.messages) {
            setUnreadMessages(data.messages.filter((m: any) => !m.isRead));
          }
        })
        .catch(console.error);
    }
  }, [status, pathname]); // Re-fetch when pathname changes just in case

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
        <Link href={`/${locale}`} className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2 group shrink-0">
          <Image 
            src="/logo.png" 
            alt="PerfumeEx Logo" 
            width={40} 
            height={40} 
            unoptimized
            className="group-hover:scale-110 transition-transform duration-300 object-contain w-8 h-8 md:w-10 md:h-10" 
          />
          <span className="tracking-widest">PERFUME<span className="text-emerald-500">EX</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={`/${locale}${link.href === '/' ? '' : link.href}`}
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
          <LanguageSwitcher currentLocale={locale} />
          
          {status === 'authenticated' ? (
            <div className="flex items-center gap-3 ml-2 relative">
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadMessages.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-950/50">
                        <h3 className="font-bold text-white">{isAr ? "الإشعارات" : "Notifications"}</h3>
                        {unreadMessages.length > 0 && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold">
                            {unreadMessages.length} {isAr ? "جديدة" : "new"}
                          </span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {unreadMessages.length === 0 ? (
                          <div className="p-8 text-center text-zinc-500 text-sm">
                            {isAr ? "لا توجد إشعارات جديدة" : "No new notifications"}
                          </div>
                        ) : (
                          unreadMessages.map((msg: any) => (
                            <Link 
                              key={msg.id} 
                              href={`/${locale}/dashboard/messages`}
                              onClick={() => setNotificationsOpen(false)}
                              className="block p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <div className="text-sm font-bold text-white mb-1">
                                {isAr ? "رسالة جديدة من:" : "New message from:"} {isAr ? msg.sender?.nameAr || 'Admin' : msg.sender?.nameEn || 'Admin'}
                              </div>
                              <div className="text-xs text-zinc-400 line-clamp-1">{msg.content}</div>
                            </Link>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href={`/${locale}/dashboard`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hover:bg-emerald-500 hover:text-black transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                {isAr ? "لوحة التحكم" : "Dashboard"}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 group"
                title={isAr ? "تسجيل الخروج" : "Logout"}
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <>
              <Link href={`/${locale}/login`} className="text-sm font-medium text-white hover:text-emerald-400 transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("login")}
              </Link>
              
              <Link
                href={`/${locale}/register`}
                className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-emerald-50 transition-colors hover:scale-105 active:scale-95"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="md:hidden fixed inset-x-0 top-[72px] bottom-0 bg-black/95 backdrop-blur-3xl z-40 border-t border-white/10 overflow-y-auto"
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-zinc-400 font-bold">{isAr ? 'لغة الموقع' : 'Language'}</span>
                <LanguageSwitcher currentLocale={locale} />
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={`/${locale}${link.href === '/' ? '' : link.href}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xl font-bold p-4 rounded-2xl transition-colors flex items-center justify-between ${
                      isActive(link.href) ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {link.name}
                    <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 data-[active=true]:opacity-100 transition-opacity" data-active={isActive(link.href)} />
                  </Link>
                ))}
              </nav>

              <div className="h-px bg-white/10 my-2" />
              
              {status === 'authenticated' ? (
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 text-lg font-bold text-black bg-emerald-500 rounded-2xl py-4 hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {isAr ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center justify-center gap-3 text-lg font-bold text-red-400 border border-red-500/20 rounded-2xl py-4 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    {isAr ? "تسجيل الخروج" : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-base font-bold text-white border border-white/20 rounded-2xl py-4 hover:bg-white/5 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    {t("login")}
                  </Link>
                  <Link
                    href={`/${locale}/register`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-base font-bold text-black bg-white rounded-2xl py-4 hover:bg-emerald-50 transition-colors"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
