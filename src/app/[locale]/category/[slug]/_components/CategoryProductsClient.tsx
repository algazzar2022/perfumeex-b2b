"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Box, ChevronRight, X, Mail, Phone, ShieldCheck, MapPin } from "lucide-react";

export default function CategoryProductsClient({ 
  initialProducts, 
  locale, 
  slug 
}: { 
  initialProducts: any[]; 
  locale: string;
  slug: string;
}) {
  const t = useTranslations("Index.categories.items");
  const isAr = locale === 'ar';
  
  let categoryName = slug;
  try {
    categoryName = t(slug as any);
  } catch(e) {
    categoryName = slug;
  }

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 font-cairo">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {categoryName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg font-light"
          >
            {isAr ? `تصفح أحدث منتجات ${categoryName} من أفضل الشركات الموثوقة.` : `Browse the latest ${categoryName} products from top verified suppliers.`}
          </motion.p>
        </div>

        {initialProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-md">
            <Box className="w-16 h-16 text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{isAr ? "لا توجد منتجات" : "No Products Found"}</h3>
            <p className="text-zinc-500">{isAr ? "لم يتم إضافة منتجات في هذا التصنيف بعد." : "No products have been added to this category yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProducts.map((product, idx) => {
              const companyName = isAr ? product.company.nameAr : product.company.nameEn;
              const productName = isAr ? product.nameAr : product.nameEn;
              const productDesc = isAr ? product.descriptionAr : product.descriptionEn;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  key={product.id} 
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col"
                >
                  <div className="relative h-64 w-full bg-white/5 overflow-hidden shrink-0">
                    <Image 
                      src={product.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600&h=600"} 
                      alt={productName} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                      <Box className="w-3 h-3 text-emerald-400" /> {product.stockStatus === 'IN_STOCK' ? (isAr ? "متوفر" : "In Stock") : (isAr ? "كمية محدودة" : "Low Stock")}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Company Info */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0 relative">
                        {product.company.logo ? (
                          <Image src={product.company.logo} alt={companyName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-xs text-white">
                            {companyName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/${locale}/${product.company.slug}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-bold text-zinc-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 line-clamp-1"
                      >
                        {companyName}
                        {product.company.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </Link>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {productName}
                    </h4>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-6 font-light leading-relaxed">
                      {productDesc}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-emerald-400 font-extrabold text-lg bg-emerald-400/10 px-3 py-1 rounded-lg border border-emerald-400/20">
                        {product.price ? `${product.price} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? "تواصل للسعر" : "Contact")}
                      </div>
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                        <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Product Details Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden max-w-5xl w-full min-h-[90vh] md:min-h-[75vh] flex flex-col md:flex-row relative shadow-2xl cursor-default"
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedProduct(null); }} 
                  className="absolute top-4 end-4 z-50 w-10 h-10 bg-black/20 hover:bg-black/50 border border-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-full md:w-1/2 relative bg-white shrink-0 min-h-[300px] md:min-h-0">
                  <Image 
                    src={selectedProduct.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600&h=800"} 
                    alt={isAr ? selectedProduct.nameAr : selectedProduct.nameEn} 
                    fill 
                    className="object-contain" 
                  />
                </div>

                <div className="w-full md:w-1/2 relative flex flex-col p-6 md:p-8 max-h-[90vh] md:max-h-[75vh]">
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-400 w-fit shrink-0">
                    <Box className="w-3 h-3" />
                    {selectedProduct.stockStatus === 'IN_STOCK' ? (isAr ? "متوفر بالمخزون" : "In Stock") : (isAr ? "كمية محدودة" : "Low Stock")}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 shrink-0">
                    {isAr ? selectedProduct.nameAr : selectedProduct.nameEn}
                  </h3>

                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-zinc-500 text-sm">{isAr ? "مقدم من:" : "By:"}</span>
                    <Link 
                      href={`/${locale}/${selectedProduct.company.slug}`}
                      className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                    >
                      {isAr ? selectedProduct.company.nameAr : selectedProduct.company.nameEn}
                      {selectedProduct.company.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </Link>
                  </div>
                  
                  <div className="text-emerald-500 font-extrabold text-xl md:text-2xl mb-6 shrink-0 border-b border-white/10 pb-6">
                    {selectedProduct.price ? `${selectedProduct.price} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? "تواصل لمعرفة السعر" : "Contact for Price")}
                  </div>
                  
                  <div className="prose prose-invert prose-sm mb-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar ltr:pr-2 rtl:pl-2">
                    <h4 className="text-zinc-400 uppercase tracking-wider text-xs font-bold mb-2 sticky top-0 bg-zinc-900 py-1 z-10">
                      {isAr ? "وصف المنتج" : "Product Description"}
                    </h4>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap pt-1">
                      {isAr ? selectedProduct.descriptionAr : selectedProduct.descriptionEn}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mt-auto pt-6 border-t border-white/10 shrink-0">
                    <Link href={`/${locale}/${selectedProduct.company.slug}`} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3">
                      <Mail className="w-5 h-5" />
                      {isAr ? "مراسلة الشركة لطلب المنتج" : "Message Supplier to Order"}
                    </Link>
                    {selectedProduct.company.whatsapp && (
                      <a href={`https://wa.me/${selectedProduct.company.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(isAr ? `مرحباً، أود الاستفسار عن المنتج: ${selectedProduct.nameAr}` : `Hello, I'd like to inquire about the product: ${selectedProduct.nameEn}`)}`} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold rounded-xl transition-all flex items-center justify-center gap-3">
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
      </div>
    </main>
  );
}
