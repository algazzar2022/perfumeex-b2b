"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  MapPin, 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  ExternalLink,
  Loader2
} from "lucide-react";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const { data: session, status } = useSession();
  const locale = pathname.split('/')[1] || 'en';

  useEffect(() => {
    fetch('/api/company/profile')
      .then(res => {
        if (res.ok) return res.json();
        return {};
      })
      .then((data: any) => {
        if (data?.slug) setSlug(data.slug);
      })
      .catch(console.error);
  }, []);

  const companyName = session?.user?.name || "Company Name";
  const initial = companyName.charAt(0).toUpperCase();

  const navItems = [
    { name: t("sidebar.overview"), href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: t("sidebar.companyProfile"), href: "/dashboard/company", icon: <Building2 className="w-5 h-5" /> },
    { name: t("sidebar.branches"), href: "/dashboard/branches", icon: <MapPin className="w-5 h-5" /> },
    { name: t("sidebar.products"), href: "/dashboard/products", icon: <Package className="w-5 h-5" /> },
    { name: t("sidebar.mediaGallery"), href: "/dashboard/gallery", icon: <ImageIcon className="w-5 h-5" /> },
    { name: t("sidebar.messages"), href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  if (slug) {
    navItems.push({
      name: locale === 'ar' ? 'عرض صفحة الشركة' : 'View Profile',
      href: `/${slug}`,
      icon: <ExternalLink className="w-5 h-5" />,
      external: true,
    } as any);
  }

  // Helper to check if a route is active (ignoring locale prefix)
  const isActive = (href: string) => {
    // Exact match for overview
    if (href === "/dashboard") {
      return pathname.endsWith("/dashboard");
    }
    return pathname.includes(href);
  };

  return (
    <div className="min-h-screen bg-black text-white font-cairo flex">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 ltr:left-0 rtl:right-0 z-50 w-72 bg-zinc-950 border-r rtl:border-l rtl:border-r-0 border-white/5 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0 lg:ltr:translate-x-0"}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-white flex items-center justify-center text-black text-sm">P</span>
              Perfume<span className="text-emerald-500 font-light">Ex</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">{t("sidebar.menu")}</div>
            
            {navItems.map((item: any) => {
              const active = isActive(item.href);
              const href = `/${locale}${item.href}`;
              
              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active 
                    ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black uppercase">
                {initial}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold text-white truncate">{companyName}</div>
                <div className="text-xs text-zinc-400 truncate">{t("sidebar.premiumAccount")}</div>
              </div>
            </div>
            
            <button 
              onClick={async () => {
                setIsLoggingOut(true);
                await signOut({ callbackUrl: '/' });
              }} 
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
              <span className="font-bold">{isLoggingOut ? (locale === 'ar' ? 'جاري تسجيل الخروج...' : 'Logging out...') : t("sidebar.logout")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ltr:pl-72 lg:rtl:pr-72 transition-all duration-300">
        
        {/* Top Header */}
        <header className="h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white hidden sm:block">{t("header.title")}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Locale comes from pathname or you can get it from context, here we extract it */}
            <LanguageSwitcher currentLocale={pathname.split('/')[1] || 'en'} />
            
            <Link href={`/${pathname.split('/')[1] || 'en'}/companies/preview`} className="hidden sm:flex text-sm font-bold text-zinc-400 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all">
              {t("header.viewProfile")}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
