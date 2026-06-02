"use client";

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
  
  const categories = [
    { id: "perfumeClones", name: t('categories.items.perfumeClones'), icon: <Droplet strokeWidth={1.5} className="w-8 h-8" />, count: 120 },
    { id: "readyPerfumes", name: t('categories.items.readyPerfumes'), icon: <Star strokeWidth={1.5} className="w-8 h-8" />, count: 450 },
    { id: "glass", name: t('categories.items.glass'), icon: <MapPin strokeWidth={1.5} className="w-8 h-8" />, count: 150 },
    { id: "bakhoor", name: t('categories.items.bakhoor'), icon: <TrendingUp strokeWidth={1.5} className="w-8 h-8" />, count: 85 },
    { id: "airFresheners", name: t('categories.items.airFresheners'), icon: <Sparkles strokeWidth={1.5} className="w-8 h-8" />, count: 210 },
    { id: "packaging", name: t('categories.items.packaging'), icon: <Building2 strokeWidth={1.5} className="w-8 h-8" />, count: 320 },
    { id: "bottlesAndEmpties", name: t('categories.items.bottlesAndEmpties'), icon: <Package strokeWidth={1.5} className="w-8 h-8" />, count: 280 },
    { id: "others", name: t('categories.items.others'), icon: <MoreHorizontal strokeWidth={1.5} className="w-8 h-8" />, count: 50 },
  ];

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
                whileHover={{ y: -5 }}
                className="group relative p-10 rounded-[2rem] bg-zinc-950/80 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl backdrop-blur-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500 mb-8 shadow-inner">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-emerald-300 transition-colors">{category.name}</h3>
                  
                  <div className="flex items-center gap-3 text-zinc-500 font-light text-sm group-hover:text-zinc-400 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                    <span>{category.count} {t('categories.verifiedSuppliers')}</span>
                  </div>
                </div>

                <div className="absolute bottom-10 ltr:right-10 rtl:left-10 opacity-0 group-hover:opacity-100 ltr:group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-all duration-500 text-emerald-500">
                  <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
