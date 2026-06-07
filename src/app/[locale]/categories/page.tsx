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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setDbCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="relative h-[420px] rounded-[2.5rem] bg-zinc-900/40 border border-white/5 animate-pulse overflow-hidden">
                 <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-zinc-800/50">
                   <div className="h-6 bg-zinc-700/80 rounded-md w-1/2 mb-5" />
                   <div className="flex justify-between items-center">
                     <div className="h-4 bg-zinc-700/80 rounded-md w-1/3" />
                     <div className="h-10 w-10 bg-zinc-700/80 rounded-full" />
                   </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <Link key={category.id} href={`/${locale}/category/${category.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 hover:border-emerald-500/30 transition-all duration-500"
                >
                  {/* Full Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${category.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=800'})`
                    }}
                  />
                  
                  {/* Deep Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Top Floating Icon (Glassmorphism) */}
                  <div className="absolute top-6 ltr:right-6 rtl:left-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all shadow-lg z-10">
                    {category.icon}
                  </div>

                  {/* Content Section (Bottom Glass Panel) */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-black/30 backdrop-blur-xl border border-white/10 group-hover:border-emerald-500/30 transition-colors z-10 flex flex-col justify-end shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span>{category.count} {t('categories.verifiedSuppliers')}</span>
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-emerald-500 text-white group-hover:text-black transition-all">
                        <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
