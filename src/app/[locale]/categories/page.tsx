"use client";
import { useState, useEffect } from 'react';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Droplet, Star, MapPin, TrendingUp, Sparkles, Building2, Package, MoreHorizontal, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from 'next/link';

export default function CategoriesPage() {
  const t = useTranslations('Index');
  const params = useParams();
  const locale = params.locale as string;
  const isAr = locale === 'ar';
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(setDbCategories)
      .catch(console.error);
  }, []);

  const getIconForCategory = (slug: string) => {
    switch (slug) {
      case 'perfumeClones': return <Droplet strokeWidth={1.5} className="w-8 h-8" />;
      case 'readyPerfumes': return <Star strokeWidth={1.5} className="w-8 h-8" />;
      case 'glass': return <MapPin strokeWidth={1.5} className="w-8 h-8" />;
      case 'bakhoor': return <TrendingUp strokeWidth={1.5} className="w-8 h-8" />;
      case 'airFresheners': return <Sparkles strokeWidth={1.5} className="w-8 h-8" />;
      case 'packaging': return <Building2 strokeWidth={1.5} className="w-8 h-8" />;
      case 'bottlesAndEmpties': return <Package strokeWidth={1.5} className="w-8 h-8" />;
      default: return <MoreHorizontal strokeWidth={1.5} className="w-8 h-8" />;
    }
  };

  const categories = dbCategories.map(cat => ({
    id: cat.slug,
    name: isAr ? cat.nameAr : cat.nameEn,
    icon: getIconForCategory(cat.slug),
    count: cat.count || 0,
    image: cat.image
  }));

  // Fallback while loading
  if (categories.length === 0) {
    categories.push(
      { id: "perfumeClones", name: t('categories.items.perfumeClones'), icon: <Droplet strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "readyPerfumes", name: t('categories.items.readyPerfumes'), icon: <Star strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "glass", name: t('categories.items.glass'), icon: <MapPin strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "bakhoor", name: t('categories.items.bakhoor'), icon: <TrendingUp strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "airFresheners", name: t('categories.items.airFresheners'), icon: <Sparkles strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "packaging", name: t('categories.items.packaging'), icon: <Building2 strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "bottlesAndEmpties", name: t('categories.items.bottlesAndEmpties'), icon: <Package strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null },
      { id: "others", name: t('categories.items.others'), icon: <MoreHorizontal strokeWidth={1.5} className="w-8 h-8" />, count: 0, image: null }
    );
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 font-cairo selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-black to-black pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              {t.rich('categories.title', {
                gradient: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600">{chunks}</span>
              })}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 text-lg font-light leading-relaxed"
            >
              {t('categories.subtitle')}
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link key={category.id} href={`/${locale}/category/${category.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative h-[350px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-500"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${category.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=800'})`
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 group-hover:from-black transition-colors duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6 group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-500 transition-all duration-500 shadow-lg">
                    {category.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{category.count} {t('categories.verifiedSuppliers')}</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-8 ltr:right-8 rtl:left-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 ltr:translate-x-4 rtl:-translate-x-4 ltr:group-hover:translate-x-0 rtl:group-hover:translate-x-0 transition-all duration-500 text-white group-hover:bg-emerald-500 group-hover:text-black">
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
