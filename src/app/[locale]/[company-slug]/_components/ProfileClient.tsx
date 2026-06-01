"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, ShieldCheck, Globe, Mail, Phone, 
  ExternalLink, Download, FileText, Package, 
  Store, Building, Calendar, Image as ImageIcon,
  CheckCircle2, Box, ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProfileClient({ company, locale }: { company: any, locale: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const t = useTranslations("Dashboard.companyProfile.general.categoryOptions");

  const isAr = locale === 'ar';

  const displayName = isAr ? (company.nameAr || company.nameEn) : company.nameEn;
  const description = isAr ? (company.descriptionAr || company.descriptionEn) : company.descriptionEn;
  
  const address = isAr ? (company.addressAr || company.addressEn) : (company.addressEn || company.addressAr);
  const city = isAr ? (company.cityAr || company.cityEn) : (company.cityEn || company.cityAr);
  const governorate = isAr ? (company.governorateAr || company.governorateEn) : (company.governorateEn || company.governorateAr);
  const country = isAr ? (company.countryAr || company.countryEn) : (company.countryEn || company.countryAr);

  const locationParts = [address, city, governorate, country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : (isAr ? "الإمارات العربية المتحدة" : "United Arab Emirates");
  
  const translatedCategory = company.category 
    ? company.category.split(',').filter(Boolean).map((c: string) => {
        try { return t(c as any) } catch(e) { return c }
      }).join(' • ') 
    : (isAr ? "عطور جاهزة" : "Ready Perfumes");
  
  const coverImage = company.coverImage || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600";
  const logoImage = company.logo || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200";

  const tabs = [
    { id: "overview", label: isAr ? "عن الشركة" : "Overview", icon: Building },
    { id: "products", label: isAr ? "المنتجات" : "Products", icon: Package },
    { id: "branches", label: isAr ? "الفروع" : "Branches", icon: Store },
    { id: "gallery", label: isAr ? "معرض الصور" : "Gallery", icon: ImageIcon }
  ];

  const handleContactClick = () => {
    fetch('/api/company/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: company.id, type: 'contact' })
    }).catch(() => {});
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-cairo selection:bg-emerald-500/30">
      
      {/* 🌟 Dynamic Hero Section */}
      <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={coverImage}
            alt={`${displayName} cover`}
            fill
            className="object-cover opacity-50"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        
        {/* Floating Badges */}
        <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
          {company.isVerified && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <ShieldCheck className="w-4 h-4" />
              {isAr ? "شركة موثقة" : "Verified Supplier"}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 -mt-40 md:-mt-56 mb-20">
        
        {/* 🏢 Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-3xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-900 shadow-2xl relative group"
          >
            <Image 
              src={logoImage} 
              alt="Logo" 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: isAr ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 pb-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-zinc-300">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">{location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-white">5.0</span>
                <span className="text-sm text-zinc-400">({isAr ? "تقييم ممتاز" : "Excellent"})</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-auto pb-4"
          >
            <a href={`tel:${company.whatsapp || company.email}`} onClick={handleContactClick} className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 group active:scale-95">
              <Phone className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              {isAr ? "مراسلة الشركة" : "Message Supplier"}
            </a>
          </motion.div>
        </div>

        {/* 📋 Bento Grid & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Info (Bento Style) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> {isAr ? "معلومات سريعة" : "Quick Info"}
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="text-sm text-zinc-500 mb-1">{isAr ? "التصنيف الرئيسي" : "Main Category"}</div>
                  <div className="text-white font-bold">{translatedCategory}</div>
                </div>
                {company.yearEstablished && (
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">{isAr ? "سنة التأسيس" : "Year Established"}</div>
                    <div className="text-white font-bold">{company.yearEstablished}</div>
                  </div>
                )}
                {company.catalogPdf && (
                  <a href={company.catalogPdf} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                      <span className="font-bold">{isAr ? "تحميل الكاتالوج" : "Download Catalog"}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Contact Info Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-500" /> {isAr ? "معلومات التواصل" : "Contact Info"}
              </h3>
              <div className="space-y-3">
                {company.email && (
                  <a href={`mailto:${company.email}`} onClick={handleContactClick} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-xs text-zinc-500">{isAr ? "البريد الإلكتروني" : "Email"}</div>
                      <div className="text-sm text-zinc-300 font-medium truncate">{company.email}</div>
                    </div>
                  </a>
                )}
                {company.whatsapp && (
                  <a href={`tel:${company.whatsapp}`} onClick={handleContactClick} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-xs text-zinc-500">{isAr ? "رقم الهاتف" : "Phone"}</div>
                      <div className="text-sm text-zinc-300 font-medium dir-ltr text-left">{company.whatsapp}</div>
                    </div>
                  </a>
                )}
                {company.website && (
                  <a href={company.website} onClick={handleContactClick} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-xs text-zinc-500">{isAr ? "الموقع الإلكتروني" : "Website"}</div>
                      <div className="text-sm text-zinc-300 font-medium truncate">{company.website.replace(/^https?:\/\//, '')}</div>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>

          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* Interactive Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex overflow-x-auto gap-2 mb-8 bg-zinc-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-xl"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all duration-300 ${
                      isActive 
                      ? "bg-emerald-500 text-black shadow-lg" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </motion.div>

            {/* Tab Panels */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                    className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-md"
                  >
                    <h3 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                      <Building className="w-6 h-6 text-emerald-500" />
                      {isAr ? "عن الشركة" : "About Us"}
                    </h3>
                    <div className="prose prose-invert prose-emerald max-w-none">
                      <p className="text-zinc-300 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                        {description || (isAr ? "لا يوجد وصف حالياً." : "No description available yet.")}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* PRODUCTS */}
                {activeTab === 'products' && (
                  <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    {company.products && company.products.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {company.products.map((product: any, idx: number) => (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                            key={product.id} 
                            className="group bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-emerald-500/10"
                          >
                            <div className="relative h-56 w-full bg-zinc-950 overflow-hidden">
                              <Image 
                                src={product.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400&h=400"} 
                                alt={isAr ? product.nameAr : product.nameEn} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-700" 
                              />
                              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-1">
                                <Box className="w-3 h-3" /> {product.stockStatus === 'IN_STOCK' ? (isAr ? "متوفر" : "In Stock") : (isAr ? "كمية محدودة" : "Low Stock")}
                              </div>
                            </div>
                            <div className="p-6">
                              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                {isAr ? product.nameAr : product.nameEn}
                              </h4>
                              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">
                                {isAr ? product.descriptionAr : product.descriptionEn}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                                <div className="text-emerald-500 font-extrabold text-lg">
                                  {product.price ? `${product.price} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? "تواصل للسعر" : "Contact for Price")}
                                </div>
                                <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-colors">
                                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
                        <Package className="w-16 h-16 text-zinc-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{isAr ? "لا توجد منتجات" : "No Products Found"}</h3>
                        <p className="text-zinc-500">{isAr ? "لم تقم الشركة بإضافة منتجات حتى الآن." : "The company hasn't added any products yet."}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* BRANCHES */}
                {activeTab === 'branches' && (
                  <motion.div key="branches" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    {company.branches && company.branches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {company.branches.map((branch: any, idx: number) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                            key={branch.id} 
                            className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl hover:border-emerald-500/20 transition-colors flex gap-4"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <Store className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white mb-3">{isAr ? branch.nameAr : branch.nameEn}</h4>
                              <p className="text-zinc-400 text-sm flex items-start gap-2 mb-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" />
                                {isAr ? branch.addressAr : branch.addressEn}, {isAr ? branch.cityAr : branch.cityEn}, {isAr ? branch.governorateAr : branch.governorateEn}, {isAr ? branch.countryAr : branch.countryEn}
                              </p>
                              <p className="text-zinc-400 text-sm flex items-center gap-2">
                                <Phone className="w-4 h-4 shrink-0 text-emerald-500" />
                                <span className="dir-ltr">{branch.phone}</span>
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
                        <Store className="w-16 h-16 text-zinc-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{isAr ? "لا توجد فروع" : "No Branches"}</h3>
                        <p className="text-zinc-500">{isAr ? "لم تقم الشركة بإضافة فروع أخرى." : "The company hasn't added any branches."}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* GALLERY */}
                {activeTab === 'gallery' && (
                  <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    {company.galleries && company.galleries.length > 0 ? (
                      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                        {company.galleries.map((item: any, idx: number) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative group rounded-3xl overflow-hidden break-inside-avoid shadow-xl bg-zinc-900 border border-white/5"
                          >
                            <Image 
                              src={item.url} 
                              alt="Gallery Image" 
                              width={600} 
                              height={600} 
                              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
                        <ImageIcon className="w-16 h-16 text-zinc-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">{isAr ? "لا توجد وسائط" : "No Media Found"}</h3>
                        <p className="text-zinc-500">{isAr ? "لم تقم الشركة بإضافة صور لمعرضها." : "The company hasn't added any media to the gallery."}</p>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
