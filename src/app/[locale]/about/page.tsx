import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { Target, Shield, Globe2, Users2, Award, Zap } from 'lucide-react';

export default function AboutPage({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';

  const values = [
    {
      icon: <Target className="text-emerald-400" size={32} />,
      titleAr: 'رؤيتنا',
      titleEn: 'Our Vision',
      descAr: 'أن نكون المنصة العالمية الأولى التي تجمع صُناع وموردي العطور في منصة رقمية واحدة تسهل الأعمال وتعزز نمو الصناعة.',
      descEn: 'To be the premier global platform connecting perfume manufacturers and suppliers in one digital ecosystem that facilitates business and boosts industry growth.'
    },
    {
      icon: <Shield className="text-emerald-400" size={32} />,
      titleAr: 'المصداقية',
      titleEn: 'Trust & Credibility',
      descAr: 'نضمن توثيق جميع الشركات والموردين لضمان بيئة تجارية آمنة وموثوقة لجميع مستخدمي المنصة.',
      descEn: 'We verify all companies and suppliers to ensure a safe and reliable business environment for all platform users.'
    },
    {
      icon: <Globe2 className="text-emerald-400" size={32} />,
      titleAr: 'انتشار عالمي',
      titleEn: 'Global Reach',
      descAr: 'نربط الشركات المصنعة في الشرق الأوسط بالمشترين والموزعين في جميع أنحاء العالم بلا حدود.',
      descEn: 'We connect Middle Eastern manufacturers with buyers and distributors worldwide without borders.'
    }
  ];

  const stats = [
    { num: '10,000+', textAr: 'شركة موثقة', textEn: 'Verified Companies' },
    { num: '50+', textAr: 'دولة حول العالم', textEn: 'Countries Worldwide' },
    { num: '1M+', textAr: 'عملية بحث شهرياً', textEn: 'Monthly Searches' },
    { num: '100%', textAr: 'دعم فني متواصل', textEn: 'Continuous Support' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 font-cairo">
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {isAr ? 'قصة ' : 'The Story of '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                PerfumeEx
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isAr 
                ? 'الشبكة الأولى من نوعها في العالم العربي لربط صُناع وتجار العطور والتغليف.'
                : 'The first network of its kind in the Arab world connecting perfume and packaging manufacturers and traders.'}
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent z-10" />
              <Image 
                src="https://images.unsplash.com/photo-1615486171448-4fd677e20300?q=80&w=2070&auto=format&fit=crop" 
                alt="Perfume Manufacturing" 
                fill 
                className="object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {isAr ? 'من نحن؟' : 'Who Are We?'}
              </h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <p>
                  {isAr 
                    ? 'بدأت منصة PerfumeEx كفكرة بسيطة لحل مشكلة التشتت في سوق العطور وتصنيع العبوات والتغليف. لاحظنا أن العديد من أصحاب المصانع والمستوردين يواجهون صعوبة في الوصول للموردين الموثوقين، والعكس صحيح.'
                    : 'The PerfumeEx platform started as a simple idea to solve the fragmentation in the perfume and packaging market. We noticed many factory owners and importers struggling to find reliable suppliers, and vice versa.'}
                </p>
                <p>
                  {isAr
                    ? 'لذلك، قمنا ببناء هذه المنصة لتكون دليلاً شاملاً يجمع كل أطراف الصناعة في مكان واحد. من مصانع الزيوت العطرية والمحاكاة، إلى مصانع الزجاجات، والطباعة، والتغليف، وحتى مصانع البخور والعود.'
                    : 'Therefore, we built this platform to be a comprehensive directory gathering all industry parties in one place. From essential oil and clone factories, to glass bottle factories, printing, packaging, and even incense and oud factories.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-white/10 bg-[#111] mb-24 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-white/10">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">{stat.num}</div>
                  <div className="text-gray-400 text-lg">{isAr ? stat.textAr : stat.textEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {isAr ? 'قيمنا ومبادئنا' : 'Our Core Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{isAr ? value.titleAr : value.titleEn}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {isAr ? value.descAr : value.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

      </main>
      
    </div>
  );
}
