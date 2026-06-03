'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { 
  Building2, 
  Tags, 
  PackageSearch, 
  Star, 
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();

  const navigation = [
    { name: 'الرئيسية', href: `/${locale}/admin-dashboard`, icon: LayoutDashboard },
    { name: 'الشركات', href: `/${locale}/admin-dashboard/companies`, icon: Building2 },
    { name: 'الأقسام', href: `/${locale}/admin-dashboard/categories`, icon: Tags },
    { name: 'الرعاة', href: `/${locale}/admin-dashboard/sponsors`, icon: Star },
    { name: 'المنتجات', href: `/${locale}/admin-dashboard/products`, icon: PackageSearch },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#111]">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          لوحة التحكم
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 ${locale === 'ar' ? 'right-0' : 'left-0'} z-50 
        w-64 bg-[#111] border-${locale === 'ar' ? 'l' : 'r'} border-white/10 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
      `}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            لوحة تحكم الإدارة
          </h2>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
