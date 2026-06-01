"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Building2, Filter, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // const t = useTranslations("Companies"); // Will implement translations later

  const companies = [
    { id: 1, name: "Luxe Fragrance Co.", location: "Dubai, UAE", category: "Ready Perfumes", rating: 4.9, verified: true, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=400", desc: "Leading manufacturer of luxury oriental perfumes." },
    { id: 2, name: "Oud Masters", location: "Riyadh, KSA", category: "Bakhoor", rating: 4.8, verified: true, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600&h=400", desc: "Premium suppliers of authentic aged Oud and Bakhoor." },
    { id: 3, name: "Crystal Pack", location: "Istanbul, Turkey", category: "Glass Bottles", rating: 4.7, verified: false, image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=600&h=400", desc: "Wholesale glass bottles and luxury packaging solutions." },
    { id: 4, name: "Aroma Synth", location: "Paris, France", category: "Clone Perfumes", rating: 4.6, verified: true, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=600&h=400", desc: "High-quality European fragrance oils and compounds." },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 font-cairo">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-emerald-900/20 to-black z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-mint">Companies</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Browse through thousands of verified perfume manufacturers, suppliers, and packaging companies worldwide.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center">
              <Search className="w-5 h-5 text-zinc-500 ml-3 mr-2 rtl:mr-3 rtl:ml-2" />
              <input
                type="text"
                placeholder="Search companies by name or keyword..."
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-600 px-2 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl hover:bg-zinc-800 transition-colors text-zinc-300 font-medium">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {companies.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={company.image}
                  alt={company.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 ltr:right-4 rtl:left-4 flex flex-col gap-2">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold border border-white/10">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    {company.rating}
                  </div>
                </div>

                {company.verified && (
                  <div className="absolute bottom-4 ltr:left-4 rtl:right-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Supplier
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 relative">
                <div className="text-emerald-500 text-xs font-bold tracking-wider uppercase mb-2">
                  {company.category}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {company.name}
                </h2>
                <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                </div>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-8 font-light">
                  {company.desc}
                </p>

                <Link
                  href={`/company/${company.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-white/5 hover:bg-white text-white hover:text-black font-bold transition-all duration-300"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
