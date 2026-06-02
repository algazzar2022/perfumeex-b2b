"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, Filter, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CompaniesClient({ initialCompanies, locale }: { initialCompanies: any[], locale: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("CompaniesDirectory");
  const catT = useTranslations("Dashboard.companyProfile.general.categoryOptions");

  const isAr = locale === 'ar';

  const filteredCompanies = initialCompanies.filter((company) => {
    const q = searchQuery.toLowerCase();
    const name = isAr ? company.nameAr : company.nameEn;
    const desc = isAr ? company.descriptionAr : company.descriptionEn;
    return (
      (name && name.toLowerCase().includes(q)) ||
      (desc && desc.toLowerCase().includes(q)) ||
      (company.category && company.category.toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 font-cairo">
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-emerald-900/20 to-black z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {isAr ? "استكشف " : "Discover "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-mint">
              {isAr ? "الشركات" : "Companies"}
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center">
              <Search className="w-5 h-5 text-zinc-500 ml-3 mr-2 rtl:mr-3 rtl:ml-2" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-600 px-2 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5">
            <Building2 className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t("noCompanies")}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company, idx) => {
              const name = isAr ? company.nameAr : company.nameEn;
              const desc = isAr ? company.descriptionAr : company.descriptionEn;
              
              const address = isAr ? (company.addressAr || company.addressEn) : (company.addressEn || company.addressAr);
              const city = isAr ? (company.cityAr || company.cityEn) : (company.cityEn || company.cityAr);
              const governorate = isAr ? (company.governorateAr || company.governorateEn) : (company.governorateEn || company.governorateAr);
              const country = isAr ? (company.countryAr || company.countryEn) : (company.countryEn || company.countryAr);
              const locationParts = [city, governorate, country].filter(Boolean);
              const location = locationParts.length > 0 ? locationParts.join(', ') : "";

              const translatedCategory = company.category 
                ? Array.from(new Set(company.category.split(',').filter(Boolean).map((c: string) => {
                    try { 
                      const tr = catT(c as any);
                      return tr.includes('Dashboard.companyProfile') ? c : tr;
                    } catch(e) { return c }
                  }))).join(' • ') 
                : "";

              return (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="group bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all duration-500"
                >
                  <div className="relative h-56 overflow-hidden bg-zinc-900">
                    <Image
                      src={company.coverImage || company.logo || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=400"}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                    
                    <div className="absolute top-4 ltr:right-4 rtl:left-4 flex flex-col gap-2">
                      <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold border border-white/10">
                        <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                        5.0
                      </div>
                    </div>

                    {company.isVerified && (
                      <div className="absolute bottom-4 ltr:left-4 rtl:right-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <ShieldCheck className="w-4 h-4" />
                        {t("verified")}
                      </div>
                    )}
                  </div>

                  <div className="p-8 relative">
                    {company.logo && (
                      <div className="absolute -top-12 ltr:right-8 rtl:left-8 w-20 h-20 rounded-2xl overflow-hidden border-4 border-zinc-950 bg-white">
                        <Image src={company.logo} alt="Logo" fill className="object-cover" />
                      </div>
                    )}

                    <div className="text-emerald-500 text-xs font-bold tracking-wider uppercase mb-2 truncate max-w-[70%]">
                      {translatedCategory}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors truncate">
                      {name}
                    </h2>
                    
                    {location && (
                      <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4 truncate">
                        <MapPin className="w-4 h-4 shrink-0" />
                        {location}
                      </div>
                    )}
                    
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-8 font-light min-h-[40px]">
                      {desc || ""}
                    </p>

                    <Link
                      href={`/${locale}/${company.slug}`}
                      className="block w-full text-center py-3 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black font-bold transition-all duration-300"
                    >
                      {t("viewProfile")}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
