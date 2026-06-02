"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Star, ShieldCheck, Globe, Mail, Phone, 
  ExternalLink, Download, FileText, Package, 
  Store, Building, Calendar, Image as ImageIcon,
  CheckCircle2, Box, ChevronRight, X, Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

export default function ProfileClient({ company, locale }: { company: any, locale: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [senderCompany, setSenderCompany] = useState<any>(null);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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
    ? Array.from(new Set(company.category.split(',').filter(Boolean).map((c: string) => {
        try { 
          const tr = t(c as any);
          return tr.includes('Dashboard.companyProfile') ? c : tr;
        } catch(e) { return c }
      }))).join(' • ') 
    : (isAr ? "عطور جاهزة" : "Ready Perfumes");
  
  const coverImage = company.coverImage || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600";
  const logoImage = company.logo || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200";

  const tabs = [
    { id: "overview", label: isAr ? "عن الشركة" : "Overview", icon: Building },
    { id: "products", label: isAr ? "المنتجات" : "Products", icon: Package },
    { id: "branches", label: isAr ? "الفروع" : "Branches", icon: Store },
    { id: "gallery", label: isAr ? "معرض الصور" : "Gallery", icon: ImageIcon }
  ];

  const handleContactClick = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    fetch('/api/company/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: company.id, type: 'contact' })
    }).catch(() => {});

    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!senderCompany) {
      try {
        const res = await fetch('/api/company/profile');
        if (res.ok) {
          const data = await res.json();
          setSenderCompany(data.company);
        }
      } catch (err) {}
    }
    setIsMessageModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    setIsSending(true);
    setSendStatus("idle");
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: company.id,
          content: messageContent
        })
      });
      
      if (res.ok) {
        setSendStatus("success");
        setTimeout(() => {
          setIsMessageModalOpen(false);
          setMessageContent("");
          setSendStatus("idle");
        }, 2000);
      } else {
        setSendStatus("error");
      }
    } catch (err) {
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
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
            <button onClick={handleContactClick} className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-3 group active:scale-95">
              <Mail className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              {isAr ? "مراسلة الشركة" : "Message Supplier"}
            </button>
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
                            onClick={() => setSelectedProduct(product)}
                            className="group cursor-pointer bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-emerald-500/10"
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

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
            >
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-center text-white mb-2">
                {isAr ? "تسجيل الدخول مطلوب" : "Login Required"}
              </h3>
              <p className="text-zinc-400 text-center mb-8">
                {isAr ? "يجب عليك تسجيل الدخول أو إنشاء حساب شركة لتتمكن من مراسلة الشركات الأخرى." : "You must log in or create a company account to message other suppliers."}
              </p>
              <div className="flex flex-col gap-3">
                <Link href={`/${locale}/login`} className="w-full py-3 bg-emerald-500 text-black font-bold rounded-xl text-center hover:bg-emerald-400 transition-colors">
                  {isAr ? "تسجيل الدخول" : "Login"}
                </Link>
                <Link href={`/${locale}/register`} className="w-full py-3 bg-white/5 text-white font-bold rounded-xl text-center hover:bg-white/10 transition-colors border border-white/10">
                  {isAr ? "إنشاء حساب جديد" : "Create Account"}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {isMessageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full relative"
            >
              <button onClick={() => setIsMessageModalOpen(false)} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-2xl font-bold text-white mb-6">
                {isAr ? `إرسال رسالة إلى ${displayName}` : `Message ${displayName}`}
              </h3>
              
              {senderCompany && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                  <div className="text-xs text-emerald-500 font-bold mb-2 uppercase tracking-wider">
                    {isAr ? "يتم الإرسال باسم:" : "Sending as:"}
                  </div>
                  <div className="text-white font-bold text-lg mb-1">{isAr ? senderCompany.nameAr : senderCompany.nameEn}</div>
                  <div className="text-zinc-400 text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {senderCompany.whatsapp || senderCompany.email || (isAr ? "لا يوجد رقم مسجل" : "No contact registered")}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-bold text-zinc-400 mb-2">
                  {isAr ? "محتوى الرسالة" : "Message Content"}
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={isAr ? "اكتب رسالتك هنا... (مثال: نود الاستفسار عن أسعار الجملة لمنتجاتكم)" : "Type your message here..."}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white min-h-[150px] outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              {sendStatus === "error" && (
                <div className="text-red-400 text-sm mb-4 text-center">
                  {isAr ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التأكد من إكمال بيانات شركتك." : "Error sending message. Please try again or ensure your company profile is complete."}
                </div>
              )}
              {sendStatus === "success" && (
                <div className="text-emerald-400 text-sm mb-4 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {isAr ? "تم إرسال الرسالة بنجاح!" : "Message sent successfully!"}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsMessageModalOpen(false)} 
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={handleSendMessage}
                  disabled={isSending || !messageContent.trim() || sendStatus === "success"}
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? "إرسال الرسالة" : "Send Message")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col md:flex-row relative shadow-2xl"
            >
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-lg">
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-5/12 relative aspect-square md:aspect-auto md:h-auto bg-zinc-950 shrink-0">
                <Image 
                  src={selectedProduct.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600&h=800"} 
                  alt={isAr ? selectedProduct.nameAr : selectedProduct.nameEn} 
                  fill 
                  className="object-cover" 
                />
              </div>

              <div className="w-full md:w-7/12 p-5 md:p-6 flex flex-col max-h-[90vh]">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-400 w-fit shrink-0">
                  <Box className="w-3 h-3" />
                  {selectedProduct.stockStatus === 'IN_STOCK' ? (isAr ? "متوفر بالمخزون" : "In Stock") : (isAr ? "كمية محدودة" : "Low Stock")}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 shrink-0">
                  {isAr ? selectedProduct.nameAr : selectedProduct.nameEn}
                </h3>
                
                <div className="text-emerald-500 font-extrabold text-xl md:text-2xl mb-6 shrink-0">
                  {selectedProduct.price ? `${selectedProduct.price} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? "تواصل لمعرفة السعر" : "Contact for Price")}
                </div>
                
                <div className="prose prose-invert prose-sm mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <h4 className="text-zinc-400 uppercase tracking-wider text-xs font-bold mb-2 sticky top-0 bg-zinc-900 py-1">
                    {isAr ? "وصف المنتج" : "Product Description"}
                  </h4>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {isAr ? selectedProduct.descriptionAr : selectedProduct.descriptionEn}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mt-auto pt-6 border-t border-white/10">
                  <button onClick={() => { setSelectedProduct(null); handleContactClick(); }} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3">
                    <Mail className="w-5 h-5" />
                    {isAr ? "مراسلة الشركة لطلب المنتج" : "Message Supplier to Order"}
                  </button>
                  {company.whatsapp && (
                    <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isAr ? `مرحباً، أود الاستفسار عن المنتج: ${selectedProduct.nameAr}` : `Hello, I'd like to inquire about the product: ${selectedProduct.nameEn}`)}`} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold rounded-xl transition-all flex items-center justify-center gap-3">
                      <Phone className="w-5 h-5" />
                      {isAr ? "تواصل عبر واتساب" : "Contact via WhatsApp"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
