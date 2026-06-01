"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, Filter, SlidersHorizontal, MapPin, Building2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dummy Results
  const results = [
    { id: 1, name: "Luxe Fragrance Co.", location: "Dubai, UAE", category: "Ready Perfumes", rating: 4.9, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400&h=300" },
    { id: 2, name: "Oud Masters", location: "Riyadh, KSA", category: "Bakhoor", rating: 4.8, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400&h=300" },
    { id: 3, name: "Aroma Synth", location: "Paris, France", category: "Clone Perfumes", rating: 4.6, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=400&h=300" },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 font-cairo">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Search Input */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 rounded-2xl blur opacity-75" />
          <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
            <SearchIcon className="w-6 h-6 text-zinc-400 ml-4 mr-3 rtl:mr-4 rtl:ml-3" />
            <input
              type="text"
              placeholder="Search companies, categories, products..."
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-xl font-light py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-emerald-50 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-1/4">
            <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
                <SlidersHorizontal className="w-5 h-5 text-emerald-500" />
                Filters
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">Category</h3>
                <div className="space-y-3">
                  {["Clone Perfumes", "Ready Perfumes", "Bakhoor", "Packaging", "Glass Bottles"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-zinc-700 group-hover:border-emerald-500 flex items-center justify-center bg-black transition-colors" />
                      <span className="text-zinc-300 group-hover:text-white transition-colors text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-8">
                <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4">Location</h3>
                <div className="space-y-3">
                  {["United Arab Emirates", "Saudi Arabia", "Egypt", "Turkey", "France"].map((loc) => (
                    <label key={loc} className="flex items-center gap-3 group cursor-pointer">
                      <div className="w-5 h-5 rounded border border-zinc-700 group-hover:border-emerald-500 flex items-center justify-center bg-black transition-colors" />
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
              <h2 className="text-2xl font-bold text-white">
                <span className="text-emerald-500">24</span> Results Found
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 text-sm">Sort by:</span>
                <select className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none">
                  <option>Most Relevant</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {results.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col sm:flex-row"
                >
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-zinc-900 shrink-0">
                    <Image src={company.image} alt={company.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="text-emerald-500 text-xs font-bold tracking-wider uppercase mb-1">
                      {company.category}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4">
                      <MapPin className="w-4 h-4" /> {company.location}
                    </div>
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex items-center gap-1 text-sm font-bold text-white">
                        <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" /> {company.rating}
                      </div>
                      <Link href={`/company/${company.id}`} className="ml-auto text-sm font-bold text-emerald-400 hover:text-emerald-300">
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
