"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Basic implementation for changing the locale in the pathname
    // e.g., /en/about -> /ar/about
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    
    // If the path was just /en, it replaces with /ar
    router.push(newPath === pathname ? `/${newLocale}` : newPath);
  };

  return (
    <div className="flex bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-700 p-1 shadow-lg">
      <button
        onClick={() => switchLocale('en')}
        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
          currentLocale === 'en' 
            ? 'bg-emerald-500 text-zinc-950' 
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Globe className="w-4 h-4" /> EN
      </button>
      <button
        onClick={() => switchLocale('ar')}
        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${
          currentLocale === 'ar' 
            ? 'bg-emerald-500 text-zinc-950' 
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Globe className="w-4 h-4" /> AR
      </button>
    </div>
  );
}
