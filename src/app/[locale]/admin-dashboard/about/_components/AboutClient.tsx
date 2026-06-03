'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAboutContent } from '../actions';
import { Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';

const defaultContent = {
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

export default function AboutClient({ initialContent }: { initialContent: any }) {
  const [data, setData] = useState(initialContent || defaultContent);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateAboutContent(data);
      showToast('تم حفظ التعديلات بنجاح', 'success');
      router.refresh();
    } catch (error) {
      showToast('حدث خطأ أثناء الحفظ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHero = (field: string, value: string) => setData({ ...data, hero: { ...data.hero, [field]: value } });
  const updateStory = (field: string, value: string) => setData({ ...data, story: { ...data.story, [field]: value } });
  
  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...data.stats];
    newStats[index][field] = value;
    setData({ ...data, stats: newStats });
  };
  const addStat = () => setData({ ...data, stats: [...data.stats, { num: '', textAr: '', textEn: '' }] });
  const removeStat = (index: number) => setData({ ...data, stats: data.stats.filter((_: any, i: number) => i !== index) });

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...data.values];
    newValues[index][field] = value;
    setData({ ...data, values: newValues });
  };
  const addValue = () => setData({ ...data, values: [...data.values, { titleAr: '', titleEn: '', descAr: '', descEn: '' }] });
  const removeValue = (index: number) => setData({ ...data, values: data.values.filter((_: any, i: number) => i !== index) });

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-2 rounded-lg ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            <span className="font-bold text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
          </div>
          <p className="font-medium text-white">{toast.message}</p>
        </div>
      )}

      <div className="space-y-8 pb-20">
        
        {/* Hero Section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-emerald-400">القسم الأول: الترويسة (Hero)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان الرئيسي (عربي)</label>
              <input value={data.hero.titleAr} onChange={e => updateHero('titleAr', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان الرئيسي (إنجليزي)</label>
              <input value={data.hero.titleEn} onChange={e => updateHero('titleEn', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الوصف الفرعي (عربي)</label>
              <textarea value={data.hero.subtitleAr} onChange={e => updateHero('subtitleAr', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none h-24" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الوصف الفرعي (إنجليزي)</label>
              <textarea value={data.hero.subtitleEn} onChange={e => updateHero('subtitleEn', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none h-24" />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 text-emerald-400">القسم الثاني: القصة (Story)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
              <input value={data.story.titleAr} onChange={e => updateStory('titleAr', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">العنوان (إنجليزي)</label>
              <input value={data.story.titleEn} onChange={e => updateStory('titleEn', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">القصة والتفاصيل (عربي)</label>
              <textarea value={data.story.descAr} onChange={e => updateStory('descAr', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none h-48" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">القصة والتفاصيل (إنجليزي)</label>
              <textarea value={data.story.descEn} onChange={e => updateStory('descEn', e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none h-48" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">الصورة المرفقة</label>
            <div className="flex items-center gap-4">
              {data.story?.image && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img src={data.story.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        showToast('حجم الصورة يجب أن لا يتعدى 2 ميجابايت', 'error');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updateStory('image', reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" 
                />
                <p className="text-sm text-gray-500 mt-2">يمكنك رفع صورة من جهازك مباشرة (الحد الأقصى 2 ميجا)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-emerald-400">القسم الثالث: الإحصائيات (Stats)</h2>
            <button onClick={addStat} className="bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-600/30">
              <Plus size={16} /> إضافة
            </button>
          </div>
          <div className="space-y-4">
            {data.stats.map((stat: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5 relative group">
                <input placeholder="الرقم (مثل 10K+)" value={stat.num} onChange={e => updateStat(idx, 'num', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-1/4" />
                <input placeholder="النص بالعربية" value={stat.textAr} onChange={e => updateStat(idx, 'textAr', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full" />
                <input placeholder="النص بالإنجليزية" value={stat.textEn} onChange={e => updateStat(idx, 'textEn', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full" />
                <button onClick={() => removeStat(idx)} className="text-red-400 opacity-50 hover:opacity-100 p-2"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-emerald-400">القسم الرابع: المبادئ والقيم (Values)</h2>
            <button onClick={addValue} className="bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-600/30">
              <Plus size={16} /> إضافة
            </button>
          </div>
          <div className="space-y-4">
            {data.values.map((val: any, idx: number) => (
              <div key={idx} className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input placeholder="العنوان بالعربية" value={val.titleAr} onChange={e => updateValue(idx, 'titleAr', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full" />
                  <input placeholder="العنوان بالإنجليزية" value={val.titleEn} onChange={e => updateValue(idx, 'titleEn', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea placeholder="الوصف بالعربية" value={val.descAr} onChange={e => updateValue(idx, 'descAr', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full h-20" />
                  <textarea placeholder="الوصف بالإنجليزية" value={val.descEn} onChange={e => updateValue(idx, 'descEn', e.target.value)} className="bg-transparent border-b border-white/20 px-2 py-1 focus:border-emerald-500 outline-none w-full h-20" />
                </div>
                <button onClick={() => removeValue(idx)} className="absolute top-4 left-4 text-red-400 opacity-50 hover:opacity-100 p-2 rtl:left-auto rtl:right-4"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111] border-t border-white/10 md:pl-64 flex justify-end z-40">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
          حفظ التعديلات ونشرها
        </button>
      </div>
    </>
  );
}
