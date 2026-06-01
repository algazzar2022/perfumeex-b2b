"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Plus, Edit2, Trash2, MapPin, Phone, Loader2, CheckCircle2, Save } from "lucide-react";

type Branch = {
  id: string;
  nameEn: string;
  nameAr: string;
  country: string;
  governorate: string;
  city: string;
  addressEn: string;
  addressAr: string;
  phone: string;
};

export default function BranchesPage() {
  const t = useTranslations("Dashboard.branches");
  const params = useParams();
  const locale = params?.locale as string || "ar";
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    country: "",
    governorate: "",
    city: "",
    addressEn: "",
    addressAr: "",
    phone: ""
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/company/branches");
      if (res.ok) {
        const data = await res.json();
        setBranches(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        nameEn: branch.nameEn || "",
        nameAr: branch.nameAr || "",
        country: branch.country || "",
        governorate: branch.governorate || "",
        city: branch.city || "",
        addressEn: branch.addressEn || "",
        addressAr: branch.addressAr || "",
        phone: branch.phone || ""
      });
    } else {
      setEditingBranch(null);
      setFormData({
        nameEn: "", nameAr: "", country: "", governorate: "", city: "", addressEn: "", addressAr: "", phone: ""
      });
    }
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingBranch ? `/api/company/branches/${editingBranch.id}` : "/api/company/branches";
      const method = editingBranch ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        await fetchBranches();
        setIsFormOpen(false);
        showSuccessToast(t("saveSuccess"));
      } else {
        alert("Failed to save branch");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    
    try {
      const res = await fetch(`/api/company/branches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBranches(prev => prev.filter(b => b.id !== id));
        showSuccessToast(t("deleteSuccess"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showSuccessToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(""), 3000);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Plus className="w-4 h-4" /> {t("addBranch")}
          </button>
        )}
      </div>

      {isFormOpen ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6">{editingBranch ? t("editBranch") : t("addBranch")}</h2>
          
          <div className="space-y-5">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.country")}</label>
                <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.governorate")}</label>
                <input type="text" value={formData.governorate} onChange={(e) => setFormData({...formData, governorate: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.city")}</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.addressEn")}</label>
                <input type="text" value={formData.addressEn} onChange={(e) => setFormData({...formData, addressEn: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.addressAr")}</label>
                <input type="text" value={formData.addressAr} onChange={(e) => setFormData({...formData, addressAr: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="rtl" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.phone")}</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="ltr" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                {t("form.cancel")}
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t("form.save")}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl bg-zinc-900/20">
              <p className="text-zinc-500">{t("noBranches")}</p>
            </div>
          ) : (
            branches.map((branch) => (
              <div key={branch.id} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-colors relative group">
                <div className="absolute top-6 ltr:right-6 rtl:left-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenForm(branch)} className="p-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 rounded-lg text-zinc-400 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(branch.id)} className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-zinc-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {locale === 'ar' ? (branch.nameAr || branch.nameEn) : (branch.nameEn || branch.nameAr)}
                </h3>
                <p className="text-sm text-zinc-500 mb-4">
                  {locale === 'ar' ? branch.nameEn : branch.nameAr}
                </p>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-start gap-2 text-sm text-zinc-400">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                    <span>{[branch.addressAr || branch.addressEn, branch.city, branch.governorate, branch.country].filter(Boolean).join("، ")}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span dir="ltr">{branch.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
