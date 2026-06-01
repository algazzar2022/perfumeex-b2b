"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, MapPin, Building2, Droplet, Star, TrendingUp, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations('Index');
  
  // Luxury Parallax
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "150px"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Subtle mouse tracking for the premium spotlight effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const categories = [
    { name: t('categories.items.perfumeClones'), icon: <Droplet strokeWidth={1.5} className="w-8 h-8" />, count: 120 },
    { name: t('categories.items.readyPerfumes'), icon: <Star strokeWidth={1.5} className="w-8 h-8" />, count: 450 },
    { name: t('categories.items.bakhoor'), icon: <TrendingUp strokeWidth={1.5} className="w-8 h-8" />, count: 85 },
    { name: t('categories.items.airFresheners'), icon: <Sparkles strokeWidth={1.5} className="w-8 h-8" />, count: 210 },
    { name: t('categories.items.packaging'), icon: <Building2 strokeWidth={1.5} className="w-8 h-8" />, count: 320 },
    { name: t('categories.items.glassBottles'), icon: <MapPin strokeWidth={1.5} className="w-8 h-8" />, count: 150 },
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden selection:bg-emerald-500/30 font-cairo">
      
      {/* 👑 LUXURY HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-24 pb-32 px-4 overflow-hidden border-b border-white/5">
        
        {/* Deep Luxury Background with Spotlight */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)]" />
          
          {/* Mouse Spotlight */}
          <motion.div 
            className="pointer-events-none absolute inset-0 z-0"
            animate={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(62, 180, 137, 0.08), transparent 40%)`
            }}
          />

          {/* Elegant Orbs */}
          <div className="absolute top-[0%] left-[30%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-mint/5 blur-[100px] mix-blend-screen" />
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: yText, opacity: opacityHero }}
          className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center mt-12"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-zinc-300 text-sm font-semibold tracking-widest uppercase shadow-2xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('badge')}
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-white mb-8 leading-[1.05]"
          >
            {t.rich('title', {
              br: () => <br className="hidden lg:block" />,
              gradient: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-emerald-600">{chunks}</span>
            })}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-14 font-light leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* Premium Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 via-white/10 to-emerald-500/30 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000" />
            
            <div className="relative bg-black/60 backdrop-blur-3xl p-2.5 rounded-3xl flex flex-col md:flex-row items-center gap-3 border border-white/10 shadow-2xl">
              <div className="flex-1 w-full flex items-center px-6 py-4">
                <Search className="w-6 h-6 text-zinc-500 group-focus-within:text-emerald-400 transition-colors mr-4 rtl:ml-4 rtl:mr-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-600 text-xl font-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="w-full md:w-auto px-10 py-5 bg-white hover:bg-emerald-50 text-black font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                {t('searchButton')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[t('tags.dubai'), t('tags.perfumeClones'), t('tags.glassBottles'), t('tags.riyadh')].map((tag) => (
                <button 
                  key={tag} 
                  className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 💼 TRUSTED BY LOGOS - Luxury Style */}
      <section className="py-16 border-b border-white/5 relative bg-black/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-0">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-700 mb-16 uppercase tracking-wide leading-tight">{t('sponsorsTitle')}</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-2xl font-light tracking-widest text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center bg-zinc-900">
                  <Droplet className="w-4 h-4 text-emerald-500" />
                </span> 
                BRAND {i}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ ULTRA-PREMIUM CATEGORIES */}
      <section className="py-32 relative bg-black">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              >
                {t.rich('categories.title', {
                  gradient: (chunks) => <span className="text-white">{chunks}</span>
                })}
              </motion.h2>
              <p className="text-zinc-500 text-lg font-light leading-relaxed">{t('categories.subtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className="group relative p-10 rounded-[2rem] bg-zinc-950 border border-white/5 hover:bg-zinc-900 transition-colors duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500 mb-8">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{category.name}</h3>
                  
                  <div className="flex items-center gap-3 text-zinc-500 font-light text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/70" />
                    <span>{category.count} {t('categories.verifiedSuppliers')}</span>
                  </div>
                </div>

                <div className="absolute bottom-10 ltr:right-10 rtl:left-10 opacity-0 group-hover:opacity-100 ltr:group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-all duration-500 text-emerald-500">
                  <ArrowRight className="w-6 h-6 rtl:rotate-180" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✨ ELEGANT CTA */}
      <section className="py-32 relative overflow-hidden bg-black border-t border-white/5">
        {/* Abstract Background for CTA */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="p-12 md:p-24 rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-zinc-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-emerald-50 hover:scale-[1.02] transition-all duration-300">
                {t('cta.register')}
              </button>
              <button className="px-10 py-5 bg-transparent text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300">
                {t('cta.contact')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 🖤 MINIMALIST FOOTER */}
      <footer className="bg-black pt-12 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black">P</span>
            Perfume<span className="text-emerald-500 font-light">Ex</span>
          </div>
          <div className="text-zinc-600 font-light text-sm">
            {t('footer.rights')}
          </div>
        </div>
      </footer>
    </main>
  );
}
