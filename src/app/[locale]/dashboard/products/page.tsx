"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, MoreVertical, Edit2, Trash2, Loader2, CheckCircle2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ProductsManagementPage() {
  const t = useTranslations("Dashboard.products");
  const tCompany = useTranslations("Dashboard.companyProfile");
  const locale = useParams().locale as string;

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    price: "",
    stockStatus: "IN_STOCK",
    salesType: "WHOLESALE",
    image: "",
    categoryId: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/company/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nameEn: product.nameEn || "",
        nameAr: product.nameAr || "",
        descriptionEn: product.descriptionEn || "",
        descriptionAr: product.descriptionAr || "",
        price: product.price?.toString() || "",
        stockStatus: product.stockStatus || "IN_STOCK",
        salesType: product.salesType || "WHOLESALE",
        image: product.image || "",
        categoryId: product.categoryId || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nameEn: "", nameAr: "", descriptionEn: "", descriptionAr: "", price: "", stockStatus: "IN_STOCK", salesType: "WHOLESALE", image: "", categoryId: ""
      });
    }
    setIsFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be smaller than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setFormData(prev => ({ ...prev, image: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingProduct ? `/api/company/products/${editingProduct.id}` : "/api/company/products";
      const method = editingProduct ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        await fetchProducts();
        setIsFormOpen(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Failed to save product.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'ar' ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/company/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStockColor = (status: string) => {
    if (status === 'IN_STOCK') return 'bg-emerald-500/80';
    if (status === 'LOW_STOCK') return 'bg-amber-500/80';
    return 'bg-red-500/80';
  };

  const getStockLabel = (status: string) => {
    if (status === 'IN_STOCK') return t("status.inStock");
    if (status === 'LOW_STOCK') return t("status.lowStock");
    return t("status.outOfStock");
  };

  const getSalesTypeLabel = (type: string) => {
    if (type === 'WHOLESALE') return t("type.wholesale");
    return t("type.retail");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {locale === 'ar' ? "تم حفظ المنتج بنجاح" : "Product saved successfully"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        {!isFormOpen && (
          <button onClick={() => handleOpenForm()} className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Plus className="w-5 h-5" /> {t("add")}
          </button>
        )}
      </div>

      {isFormOpen ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{editingProduct ? t("add") : t("add")}</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.nameEn")}</label>
                <input type="text" value={formData.nameEn} onChange={(e) => setFormData({...formData, nameEn: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.nameAr")}</label>
                <input type="text" value={formData.nameAr} onChange={(e) => setFormData({...formData, nameAr: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.descriptionEn")}</label>
                <textarea value={formData.descriptionEn} onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})} rows={3} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.descriptionAr")}</label>
                <textarea value={formData.descriptionAr} onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})} rows={3} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors resize-none" dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{locale === 'ar' ? 'التصنيف' : 'Category'}</label>
                <select value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                  <option value="">{locale === 'ar' ? 'اختر تصنيفاً' : 'Select a category'}</option>
                  {[
                    { id: "perfumeClones", label: tCompany("general.categoryOptions.perfumeClones") },
                    { id: "readyPerfumes", label: tCompany("general.categoryOptions.readyPerfumes") },
                    { id: "glass", label: tCompany("general.categoryOptions.glass") },
                    { id: "bakhoor", label: tCompany("general.categoryOptions.bakhoor") },
                    { id: "airFresheners", label: tCompany("general.categoryOptions.airFresheners") },
                    { id: "packaging", label: tCompany("general.categoryOptions.packaging") },
                    { id: "bottlesAndEmpties", label: tCompany("general.categoryOptions.bottlesAndEmpties") },
                    { id: "others", label: tCompany("general.categoryOptions.others") }
                  ].map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.price")}</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.stockStatus")}</label>
                <select value={formData.stockStatus} onChange={(e) => setFormData({...formData, stockStatus: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                  <option value="IN_STOCK">{t("status.inStock")}</option>
                  <option value="LOW_STOCK">{t("status.lowStock")}</option>
                  <option value="OUT_OF_STOCK">{t("status.outOfStock")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.salesType")}</label>
                <select value={formData.salesType} onChange={(e) => setFormData({...formData, salesType: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                  <option value="WHOLESALE">{t("type.wholesale")}</option>
                  <option value="RETAIL">{t("type.retail")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.image")}</label>
              <div className="flex items-center gap-6">
                {formData.image && (
                  <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative shadow-xl">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <UploadCloud className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors mb-2" />
                  <p className="text-sm text-zinc-300 font-medium">{t("form.uploadHint")}</p>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                {t("form.cancel")}
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {t("form.save")}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
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
              {[
                { id: "perfumeClones", label: tCompany("general.categoryOptions.perfumeClones") },
                { id: "readyPerfumes", label: tCompany("general.categoryOptions.readyPerfumes") },
                { id: "glass", label: tCompany("general.categoryOptions.glass") },
                { id: "bakhoor", label: tCompany("general.categoryOptions.bakhoor") },
                { id: "airFresheners", label: tCompany("general.categoryOptions.airFresheners") },
                { id: "packaging", label: tCompany("general.categoryOptions.packaging") },
                { id: "bottlesAndEmpties", label: tCompany("general.categoryOptions.bottlesAndEmpties") },
                { id: "others", label: tCompany("general.categoryOptions.others") }
              ].map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
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
                  {product.image ? (
                    <Image src={product.image} alt={product.nameEn} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                  )}
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute top-2 ltr:right-2 rtl:left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenForm(product)} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500 hover:text-black transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute bottom-2 ltr:left-2 rtl:right-2">
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${getStockColor(product.stockStatus)} text-black`}>
                      {getStockLabel(product.stockStatus)}
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
                    {product.categoryId ? tCompany(`general.categoryOptions.${product.categoryId}`) : ''}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{locale === 'ar' ? product.nameAr : product.nameEn}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-emerald-400 font-bold text-sm">
                      {product.price ? `${product.price} ${locale === 'ar' ? 'ج.م' : 'EGP'}` : getSalesTypeLabel(product.salesType)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add New Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => handleOpenForm()}
              className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center h-[320px] bg-zinc-950/50 hover:bg-zinc-900 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors">
                <Plus className="w-8 h-8 text-zinc-500 group-hover:text-black transition-colors" />
              </div>
              <div className="text-white font-bold">{t("add")}</div>
              <div className="text-zinc-500 text-sm mt-1">{locale === 'ar' ? 'رفع صور وتفاصيل المنتجات' : 'Upload images & details'}</div>
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
