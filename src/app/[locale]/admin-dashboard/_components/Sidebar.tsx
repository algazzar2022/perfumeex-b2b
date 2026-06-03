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
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
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
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#111] shrink-0">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          لوحة التحكم
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-white">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 ${locale === 'ar' ? 'right-0 border-l' : 'left-0 border-r'} z-50 
        w-64 bg-[#111] border-white/10 
        transform transition-transform duration-300 ease-in-out flex flex-col shrink-0
        ${isSidebarOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}
      `}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            لوحة تحكم الإدارة
          </h2>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${locale}/admin-dashboard` && pathname.startsWith(item.href));
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

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/admin-login` })}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
