"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, ShieldCheck, Globe, Mail, Phone, ExternalLink, Download, FileText, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CompanyProfile({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const company = {
    name: "Luxe Fragrance Co.",
    slug: params.slug || "luxe-fragrance",
    category: "Ready Perfumes",
    location: "Dubai, United Arab Emirates",
    rating: 4.9,
    verified: true,
    website: "https://luxefragrance.com",
    email: "contact@luxefragrance.com",
    phone: "+971 50 123 4567",
    coverImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600",
    logo: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200",
    about: "Luxe Fragrance Co. is a premier perfume manufacturer based in Dubai, specializing in the creation of authentic oriental and modern French perfumes. With over 20 years of experience, we provide end-to-end fragrance development, from scent creation to final packaging. Our state-of-the-art facility can produce up to 50,000 bottles daily, ensuring we meet the demands of our global B2B partners.",
    products: [
      { id: 1, name: "Oud Royale Extrait", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400&h=400", price: "Wholesale Only" },
      { id: 2, name: "Midnight Rose", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=400&h=400", price: "Wholesale Only" },
      { id: 3, name: "Desert Amber", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400&h=400", price: "Wholesale Only" },
      { id: 4, name: "Crystal Musk", image: "https://images.unsplash.com/photo-1595532542520-50c184000305?auto=format&fit=crop&q=80&w=400&h=400", price: "Wholesale Only" },
    ]
  };

  return (
    <main className="min-h-screen bg-black text-white font-cairo">
      {/* 🖼️ Cover Image Hero */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={company.coverImage}
          alt={`${company.name} cover`}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 -mt-32 md:-mt-40 mb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* 🏢 Company Identity Card (Left) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-1/3 lg:w-1/4"
          >
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
              
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-4 border-black shadow-2xl relative z-10 mb-6 bg-zinc-900">
                <Image src={company.logo} alt="Logo" fill className="object-cover" />
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">{company.name}</h1>
                <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {company.location}
                </div>
                
                {company.verified && (
                  <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Supplier
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5">
                  <Globe className="w-4 h-4 text-emerald-500" /> Website
                </a>
                <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5">
                  <Mail className="w-4 h-4 text-emerald-500" /> Contact Email
                </a>
                <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5">
                  <Phone className="w-4 h-4 text-emerald-500" /> Phone Number
                </a>
              </div>

              <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-emerald-50 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> Message Supplier
              </button>
            </div>
          </motion.div>

          {/* 📄 Company Content (Right) */}
          <div className="w-full md:w-2/3 lg:w-3/4 md:pt-32">
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="flex-1 min-w-[150px] bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                </div>
                <div>
                  <div className="text-zinc-500 text-sm">Rating</div>
                  <div className="text-white font-bold text-xl">{company.rating} / 5.0</div>
                </div>
              </div>
              <div className="flex-1 min-w-[150px] bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-zinc-500 text-sm">Category</div>
                  <div className="text-white font-bold text-lg">{company.category}</div>
                </div>
              </div>
              <div className="flex-1 min-w-[150px] bg-zinc-950 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-zinc-500 text-sm">Company Profile</div>
                  <button className="text-purple-400 font-bold text-sm flex items-center gap-1 hover:text-purple-300">
                    <Download className="w-4 h-4" /> PDF Catalog
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 border-b border-white/10 pb-4">
              {['overview', 'products', 'branches'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${
                    activeTab === tab 
                    ? "bg-white text-black shadow-lg" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">About the Company</h3>
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <p className="text-zinc-400 text-lg leading-relaxed font-light">
                      {company.about}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PRODUCTS TAB */}
              {activeTab === 'products' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white">Product Catalog</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.products.map((product) => (
                      <div key={product.id} className="group bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                        <div className="relative h-48 w-full bg-zinc-900">
                          <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{product.name}</h4>
                          <div className="text-emerald-500 text-sm font-bold">{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* BRANCHES TAB */}
              {activeTab === 'branches' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold text-white mb-6">Our Branches</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-zinc-950 border border-white/5 p-6 rounded-2xl">
                      <div className="text-emerald-500 text-sm font-bold mb-2 uppercase">Headquarters</div>
                      <h4 className="text-xl font-bold text-white mb-3">Dubai Branch</h4>
                      <p className="text-zinc-400 text-sm flex items-start gap-2 mb-2">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        Business Bay, Churchill Executive Tower, Office 404, Dubai, UAE
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
