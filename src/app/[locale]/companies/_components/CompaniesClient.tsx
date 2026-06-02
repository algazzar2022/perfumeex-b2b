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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="group relative rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-2xl border border-white/10 hover:border-emerald-500/40 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col"
                >
                  {/* Subtle Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />

                  {/* Image Section */}
                  <div className="relative h-60 w-full overflow-hidden shrink-0">
                    <Image
                      src={company.coverImage || company.logo || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=400"}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-5 ltr:right-5 rtl:left-5 flex flex-col gap-2 z-10">
                      <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold border border-white/10 shadow-lg">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        5.0
                      </div>
                    </div>

                    {company.isVerified && (
                      <div className="absolute top-5 ltr:left-5 rtl:right-5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] z-10">
                        <ShieldCheck className="w-4 h-4" />
                        {t("verified")}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-8 relative flex-1 flex flex-col z-10">
                    {/* Logo (Floating) */}
                    {company.logo && (
                      <div className="absolute -top-14 ltr:left-8 rtl:right-8 w-24 h-24 rounded-2xl overflow-hidden border-4 border-zinc-950 bg-white shadow-2xl z-20 group-hover:-translate-y-2 transition-transform duration-500">
                        <Image src={company.logo} alt="Logo" fill className="object-contain p-2" />
                      </div>
                    )}

                    <div className={`${company.logo ? 'mt-12' : ''} flex flex-col flex-1`}>
                      <div className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2 truncate">
                        {translatedCategory || "\u00A0"}
                      </div>
                      <h2 className="text-3xl font-extrabold text-white mb-3 group-hover:text-emerald-300 transition-colors line-clamp-1 tracking-tight">
                        {name}
                      </h2>
                      
                      {location && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-5 truncate font-medium">
                          <MapPin className="w-4 h-4 shrink-0 text-emerald-500" />
                          {location}
                        </div>
                      )}
                      
                      <p className="text-zinc-400 text-sm line-clamp-2 mb-8 font-light leading-relaxed flex-1">
                        {desc || ""}
                      </p>

                      <Link
                        href={`/${locale}/${company.slug}`}
                        className="block w-full text-center py-4 rounded-xl bg-white/5 hover:bg-emerald-500 border border-white/10 hover:border-emerald-400 text-white hover:text-black font-bold transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98]"
                      >
                        {t("viewProfile")}
                      </Link>
                    </div>
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
