"use client";

import { motion } from "framer-motion";
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ProductsManagementPage() {
  const t = useTranslations("Dashboard.products");
  const locale = useParams().locale as string;

  const products = [
    { 
      id: 1, 
      nameEn: "Oud Royale Extrait", nameAr: "عود رويال اكستريت", 
      categoryEn: "Oriental", categoryAr: "شرقي", 
      priceEn: "Wholesale Only", priceAr: "جملة فقط", 
      stockEn: "In Stock", stockAr: "متوفر",
      stockColor: "bg-emerald-500/80", 
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 2, 
      nameEn: "Midnight Rose", nameAr: "ميدنايت روز", 
      categoryEn: "French", categoryAr: "فرنسي", 
      priceEn: "Wholesale Only", priceAr: "جملة فقط", 
      stockEn: "In Stock", stockAr: "متوفر",
      stockColor: "bg-emerald-500/80",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 3, 
      nameEn: "Desert Amber", nameAr: "ديزرت عنبر", 
      categoryEn: "Oriental", categoryAr: "شرقي", 
      priceEn: "Wholesale Only", priceAr: "جملة فقط", 
      stockEn: "Low Stock", stockAr: "مخزون منخفض",
      stockColor: "bg-amber-500/80",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400&h=400" 
    },
    { 
      id: 4, 
      nameEn: "Crystal Musk", nameAr: "كريستال مسك", 
      categoryEn: "Musk", categoryAr: "مسك", 
      priceEn: "Wholesale Only", priceAr: "جملة فقط", 
      stockEn: "In Stock", stockAr: "متوفر",
      stockColor: "bg-emerald-500/80",
      image: "https://images.unsplash.com/photo-1595532542520-50c184000305?auto=format&fit=crop&q=80&w=400&h=400" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        <button className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Plus className="w-5 h-5" /> {t("add")}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-zinc-950 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-zinc-500 absolute top-3 ltr:left-3 rtl:right-3" />
          <input 
            type="text" 
            placeholder={t("search")} 
            className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors" 
          />
        </div>
        <select className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none w-full sm:w-48 appearance-none">
          <option>{t("allCategories")}</option>
          <option>{locale === 'ar' ? 'شرقي' : 'Oriental'}</option>
          <option>{locale === 'ar' ? 'فرنسي' : 'French'}</option>
          <option>{locale === 'ar' ? 'مسك' : 'Musk'}</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl"
          >
            <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
              <Image src={product.image} alt={product.nameEn} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              
              {/* Quick Actions Overlay */}
              <div className="absolute top-2 ltr:right-2 rtl:left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stock Badge */}
              <div className="absolute bottom-2 ltr:left-2 rtl:right-2">
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${product.stockColor} text-black`}>
                  {locale === 'ar' ? product.stockAr : product.stockEn}
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{locale === 'ar' ? product.categoryAr : product.categoryEn}</div>
              <h3 className="text-lg font-bold text-white mb-2">{locale === 'ar' ? product.nameAr : product.nameEn}</h3>
              <div className="flex items-center justify-between mt-4">
                <div className="text-emerald-400 font-bold text-sm">{locale === 'ar' ? product.priceAr : product.priceEn}</div>
                <button className="text-zinc-500 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center h-[320px] bg-zinc-950/50 hover:bg-zinc-900 hover:border-emerald-500/50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors">
            <Plus className="w-8 h-8 text-zinc-500 group-hover:text-black transition-colors" />
          </div>
          <div className="text-white font-bold">{t("add")}</div>
          <div className="text-zinc-500 text-sm mt-1">{locale === 'ar' ? 'رفع صور وتفاصيل المنتجات' : 'Upload images & details'}</div>
        </motion.button>
      </div>

    </div>
  );
}
