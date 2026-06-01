"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Filter, SlidersHorizontal, MapPin, Building2, Star, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SearchClient({ 
  initialQuery, 
  initialResults, 
  locale 
}: { 
  initialQuery: string; 
  initialResults: any[]; 
  locale: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const router = useRouter();
  const t = useTranslations("Dashboard.companyProfile.general.categoryOptions");
  
  const isAr = locale === 'ar';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 font-cairo">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Search Input */}
        <form onSubmit={handleSearch} className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 rounded-2xl blur opacity-75" />
          <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
            <SearchIcon className="w-6 h-6 text-zinc-400 ml-4 mr-3 rtl:mr-4 rtl:ml-3" />
            <input
              type="text"
              placeholder={isAr ? "ابحث عن شركة، قسم، مدينة..." : "Search companies, categories, cities..."}
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-xl font-light py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-50 transition-colors shrink-0">
              {isAr ? "بحث" : "Search"}
            </button>
          </div>
        </form>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
                {isAr ? "الفلاتر" : "Filters"}
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">{isAr ? "التصنيف" : "Category"}</h3>
                <div className="space-y-3">
                  {["عطور محاكاة", "عطور جاهزة", "بخور", "زجاجات عطر", "تعبئة وتغليف"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-zinc-700 group-hover:border-emerald-500 flex items-center justify-center bg-black transition-colors" />
                      <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-8">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">{isAr ? "المحافظة" : "Governorate"}</h3>
                <div className="space-y-3 h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                  {(isAr 
                    ? ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية", "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "مطروح", "شمال سيناء", "جنوب سيناء", "المنيا", "أسيوط", "سوهاج", "قنا", "البحر الأحمر", "الأقصر", "أسوان", "الوادي الجديد"]
                    : ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "Sharqia", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai", "Sohag"]
                  ).map((loc) => (
                    <label key={loc} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-zinc-700 group-hover:border-emerald-500 flex items-center justify-center bg-black transition-colors shrink-0" />
                      <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Results Area */}
          <div className="w-full lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                <span className="text-emerald-500">{initialResults.length}</span> {isAr ? "نتيجة بحث" : "Results Found"}
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {initialResults.length > 0 ? (
                initialResults.map((company, idx) => {
                  const displayName = isAr ? (company.nameAr || company.nameEn) : company.nameEn;
                  
                  const address = isAr ? (company.addressAr || company.addressEn) : (company.addressEn || company.addressAr);
                  const city = isAr ? (company.cityAr || company.cityEn) : (company.cityEn || company.cityAr);
                  const country = isAr ? (company.countryAr || company.countryEn) : (company.countryEn || company.countryAr);
                  const locationParts = [city, country].filter(Boolean);
                  const location = locationParts.length > 0 ? locationParts.join(', ') : "";

                  const translatedCategory = company.category 
                    ? company.category.split(',').filter(Boolean).map((c: string) => {
                        try { return t(c as any) } catch(e) { return c }
                      }).join(' • ') 
                    : "";

                  const logoImage = company.logo || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200";

                  return (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col sm:flex-row"
                    >
                      <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-zinc-900 shrink-0 p-4 flex items-center justify-center border-r border-white/5 rtl:border-l rtl:border-r-0">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <Image src={logoImage} alt={displayName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="text-emerald-500 text-xs font-bold tracking-wider mb-2 line-clamp-1">
                          {translatedCategory}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          {displayName}
                          {company.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                        </h3>
                        {location && (
                          <div className="flex items-center gap-1.5 text-zinc-400 text-sm mb-4">
                            <MapPin className="w-4 h-4" /> {location}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1 text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded-lg">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 5.0
                          </div>
                          <Link href={`/${locale}/${company.slug}`} className="ml-auto rtl:ml-0 rtl:mr-auto text-sm font-bold text-black bg-emerald-500 px-5 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors">
                            {isAr ? "عرض الملف التعريفي" : "View Profile"}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-16 bg-zinc-950 border border-white/5 rounded-3xl">
                  <SearchIcon className="w-16 h-16 text-zinc-700 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{isAr ? "لم نجد أية نتائج" : "No results found"}</h3>
                  <p className="text-zinc-500 text-center max-w-md">
                    {isAr ? "جرب البحث بكلمات أخرى أو تصفح الأقسام للعثور على ما تبحث عنه." : "Try adjusting your search terms or browse categories to find what you're looking for."}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
