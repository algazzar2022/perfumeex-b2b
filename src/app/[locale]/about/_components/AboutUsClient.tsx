'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Target, Shield, Globe2, Users2, Award, Zap, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useRef } from 'react';

// Fallback data
const defaultData = {
  hero: {
    titleAr: 'قصة PerfumeEx',
    titleEn: 'The Story of PerfumeEx',
    subtitleAr: 'الشبكة الأولى من نوعها في العالم العربي لربط صُناع وتجار العطور والتغليف.',
    subtitleEn: 'The first network of its kind in the Arab world connecting perfume and packaging manufacturers and traders.'
  },
  story: {
    titleAr: 'من نحن؟',
    titleEn: 'Who Are We?',
    descAr: 'بدأت منصة PerfumeEx كفكرة بسيطة لحل مشكلة التشتت في سوق العطور وتصنيع العبوات والتغليف. لاحظنا أن العديد من أصحاب المصانع والمستوردين يواجهون صعوبة في الوصول للموردين الموثوقين، والعكس صحيح.\n\nلذلك، قمنا ببناء هذه المنصة لتكون دليلاً شاملاً يجمع كل أطراف الصناعة في مكان واحد. من مصانع الزيوت العطرية والمحاكاة، إلى مصانع الزجاجات، والطباعة، والتغليف، وحتى مصانع البخور والعود.',
    descEn: 'The PerfumeEx platform started as a simple idea to solve the fragmentation in the perfume and packaging market. We noticed many factory owners and importers struggling to find reliable suppliers, and vice versa.\n\nTherefore, we built this platform to be a comprehensive directory gathering all industry parties in one place. From essential oil and clone factories, to glass bottle factories, printing, packaging, and even incense and oud factories.',
    image: 'https://images.unsplash.com/photo-1615486171448-4fd677e20300?q=80&w=2070&auto=format&fit=crop'
  },
  stats: [
    { num: '10,000+', textAr: 'شركة موثقة', textEn: 'Verified Companies' },
    { num: '50+', textAr: 'دولة حول العالم', textEn: 'Countries Worldwide' },
    { num: '1M+', textAr: 'عملية بحث شهرياً', textEn: 'Monthly Searches' },
    { num: '100%', textAr: 'دعم فني متواصل', textEn: 'Continuous Support' }
  ],
  values: [
    {
      titleAr: 'رؤيتنا',
      titleEn: 'Our Vision',
      descAr: 'أن نكون المنصة العالمية الأولى التي تجمع صُناع وموردي العطور في منصة رقمية واحدة تسهل الأعمال وتعزز نمو الصناعة.',
      descEn: 'To be the premier global platform connecting perfume manufacturers and suppliers in one digital ecosystem that facilitates business and boosts industry growth.'
    },
    {
      titleAr: 'المصداقية',
      titleEn: 'Trust & Credibility',
      descAr: 'نضمن توثيق جميع الشركات والموردين لضمان بيئة تجارية آمنة وموثوقة لجميع مستخدمي المنصة.',
      descEn: 'We verify all companies and suppliers to ensure a safe and reliable business environment for all platform users.'
    },
    {
      titleAr: 'انتشار عالمي',
      titleEn: 'Global Reach',
      descAr: 'نربط الشركات المصنعة في الشرق الأوسط بالمشترين والموزعين في جميع أنحاء العالم بلا حدود.',
      descEn: 'We connect Middle Eastern manufacturers with buyers and distributors worldwide without borders.'
    }
  ]
};

const valueIcons = [Target, Shield, Globe2, Users2, Award, Zap];

export default function AboutUsClient({ content, isAr }: { content: any, isAr: boolean }) {
  const data = content || defaultData;
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-cairo overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* Hero Section */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 mb-24 relative pt-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-bold tracking-wider mb-8">
              {isAr ? 'منصة متخصصة بامتياز' : 'Premium Specialized Platform'}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
              <span className="text-white block">{isAr ? data.hero.titleAr.split(' ')[0] : data.hero.titleEn.split(' ').slice(0,2).join(' ')}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-200 to-cyan-400">
                {isAr ? data.hero.titleAr.split(' ').slice(1).join(' ') : data.hero.titleEn.split(' ').slice(2).join(' ')}
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
              {isAr ? data.hero.subtitleAr : data.hero.subtitleEn}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-24 flex flex-col items-center gap-2"
          >
            <span className="text-sm text-gray-500 uppercase tracking-widest">{isAr ? 'اكتشف المزيد' : 'Discover More'}</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-emerald-500 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-32 relative">
          <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
            {data.stats.map((stat: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl text-center hover:border-emerald-500/30 transition-colors group"
              >
                <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all mb-2">
                  {stat.num}
                </div>
                <div className="text-sm md:text-lg text-gray-400 font-medium">
                  {isAr ? stat.textAr : stat.textEn}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden p-8 md:p-16 relative"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/10 to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8 order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px bg-emerald-500 w-12" />
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">{isAr ? 'القصة' : 'The Story'}</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black">
                  {isAr ? data.story.titleAr : data.story.titleEn}
                </h2>
                
                <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                  {(isAr ? data.story.descAr : data.story.descEn).split('\n\n').map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <ul className="space-y-4 pt-6">
                  {['شراكات استراتيجية موثوقة', 'دعم فني متواصل للعملاء', 'بيئة تجارية آمنة 100%'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="order-1 lg:order-2 relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-[400px] lg:h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                >
                  <Image 
                    src={data.story?.image || "https://images.unsplash.com/photo-1615486171448-4fd677e20300?q=80&w=2070&auto=format&fit=crop"} 
                    alt="Story" 
                    fill 
                    unoptimized={true}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-80" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {isAr ? 'قيمنا ومبادئنا' : 'Our Core Values'}
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {isAr ? 'الأسس التي نبني عليها نجاحنا وشراكاتنا' : 'The foundation upon which we build our success and partnerships'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.values.map((value: any, idx: number) => {
              const Icon = valueIcons[idx % valueIcons.length];
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/5 hover:border-emerald-500/50 p-8 rounded-3xl transition-all group"
                >
                  <div className="w-16 h-16 bg-[#1a1a1a] group-hover:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 transition-colors border border-white/5">
                    <Icon className="text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                    {isAr ? value.titleAr : value.titleEn}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    {isAr ? value.descAr : value.descEn}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
