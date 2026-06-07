"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, MapPin, Building2, Droplet, Star, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Share2, MessageCircle, Package, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dbSponsors, setDbSponsors] = useState<any[]>([]);
  const t = useTranslations('Index');
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  
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

  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setDbCategories(data))
      .catch(console.error);
      
    fetch('/api/sponsors')
      .then(res => res.json())
      .then(data => setDbSponsors(data))
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
    name: pathname.includes('/ar') ? cat.nameAr : cat.nameEn,
    icon: getIconForCategory(cat.slug),
    count: cat.count || 0,
    image: cat.image
  }));

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
            className="text-3xl min-[375px]:text-4xl md:text-8xl lg:text-[7rem] whitespace-nowrap md:whitespace-normal font-bold tracking-tighter text-white mb-8 leading-[1.05]"
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
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  const locale = pathname.split('/')[1] || 'en';
                  router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative bg-black/60 backdrop-blur-3xl p-2.5 rounded-3xl flex flex-col md:flex-row items-center gap-3 border border-white/10 shadow-2xl"
            >
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
              <button type="submit" className="w-full md:w-auto px-10 py-5 bg-white hover:bg-emerald-50 text-black font-bold text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3">
                {t('searchButton')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </form>
            
            {/* Quick Filters - Desktop */}
            <div className="hidden md:flex md:flex-wrap md:justify-center gap-3 w-full mt-8 pb-4">
              {[t('tags.dubai'), t('tags.perfumeClones'), t('tags.glassBottles'), t('tags.riyadh')].map((tag) => (
                <button 
                  key={tag} 
                  className="px-6 py-2 whitespace-nowrap rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Filters - Mobile (Infinite Marquee) */}
            <div className="flex md:hidden overflow-hidden w-full mt-8 pb-4 relative" dir="ltr">
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
              
              <motion.div 
                animate={{ x: ["-50%", "0%"] }} 
                transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
                className="flex items-center w-max"
              >
                {[...Array(2)].map((_, arrayIndex) => (
                  <div key={arrayIndex} className="flex gap-3 px-1.5" dir={pathname.includes('/ar') ? 'rtl' : 'ltr'}>
                    {[t('tags.dubai'), t('tags.perfumeClones'), t('tags.glassBottles'), t('tags.riyadh')].map((tag) => (
                      <button 
                        key={`${arrayIndex}-${tag}`} 
                        className="px-6 py-2 whitespace-nowrap rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 💼 TRUSTED BY LOGOS - Luxury Style */}
      <section className="py-16 border-b border-white/5 relative bg-black/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
        <div className="w-full relative z-0">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-300 to-zinc-700 mb-16 uppercase tracking-wide leading-tight px-4">
            <span className="md:hidden">
              {pathname.includes('/ar') ? (
                <>الرعاه الرسميون<br />لدليل بورصة العطور</>
              ) : (
                <>Official Sponsors<br />of PerfumeEx</>
              )}
            </span>
            <span className="hidden md:inline">
              {t('sponsorsTitle')}
            </span>
          </h2>
          
          <div className="flex w-full overflow-hidden">
            <motion.div 
              animate={{ x: pathname.includes('/ar') ? ["0%", "50%"] : ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: Math.max((dbSponsors.length || 1) * 15 * 25, 200) }}
              className="flex items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 w-max"
            >
              {[...Array(2)].map((_, arrayIndex) => (
                <div key={arrayIndex} className="flex items-center gap-12 md:gap-20 px-6 md:px-10">
                  {[...Array(15)].flatMap((_, repeatIndex) => 
                    dbSponsors.map((sponsor, i) => (
                      <div key={`${arrayIndex}-${repeatIndex}-${i}`} className="w-24 md:w-32 h-16 relative shrink-0">
                        <Image
                          src={sponsor.logo}
                          alt={`Sponsor ${sponsor.nameEn}`}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                    ))
                  )}
                </div>
              ))}
            </motion.div>
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
              <Link key={category.id} href={`/${pathname.split('/')[1] || 'en'}/category/${category.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
            {session ? (
              <>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  {pathname.includes('/ar') ? 'شارك منصة بورصة العطور' : 'Share PerfumeEx'}
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                  {pathname.includes('/ar') 
                    ? 'ساعدنا في بناء أكبر مجتمع لشركات العطور في مصر. شارك المنصة مع زملائك في المجال لتعزيز التواصل وعقد صفقات أكثر.' 
                    : 'Help us build the largest perfume companies community in Egypt. Share the platform with your colleagues in the industry.'}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://perfumeex.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 bg-[#1877F2] text-white font-bold text-lg rounded-full hover:bg-[#1877F2]/90 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Share2 className="w-5 h-5" />
                    {pathname.includes('/ar') ? 'شارك على فيسبوك' : 'Share on Facebook'}
                  </a>
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent('انضم إلى منصة بورصة العطور، الشبكة الأولى لشركات العطور في مصر! https://perfumeex.app')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-5 bg-[#25D366] text-white font-bold text-lg rounded-full hover:bg-[#25D366]/90 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {pathname.includes('/ar') ? 'شارك عبر واتساب' : 'Share via WhatsApp'}
                  </a>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-[1.3] md:leading-[1.4]">
                  {t('cta.title')}
                </h2>
                <p className="text-xl text-zinc-400 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
                  {t('cta.subtitle')}
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={() => router.push(`/${pathname.split('/')[1] || 'en'}/register`)} className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-emerald-50 hover:scale-[1.02] transition-all duration-300">
                    {t('cta.register')}
                  </button>
                  <a href="tel:01014228118" className="px-10 py-5 bg-transparent text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 text-center">
                    {t('cta.contact')}
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* 🖤 MINIMALIST FOOTER */}
      <footer className="bg-black pt-12 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="PerfumeEx Logo" 
              width={40} 
              height={40} 
              unoptimized
              className="object-contain" 
            />
            <span className="tracking-widest">PERFUME<span className="text-emerald-500">EX</span></span>
          </div>
          <div className="text-zinc-600 font-light text-sm">
            {t('footer.rights')}
          </div>
        </div>
      </footer>
    </main>
  );
}
