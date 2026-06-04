"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Plus, Edit2, Trash2, MapPin, Phone, Loader2, CheckCircle2, Save } from "lucide-react";
import { ARAB_COUNTRIES, GOVERNORATES, CITIES } from "@/lib/locations";

type Branch = {
  id: string;
  nameEn: string;
  nameAr: string;
  countryAr: string;
  countryEn: string;
  governorateAr: string;
  governorateEn: string;
  cityAr: string;
  cityEn: string;
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
    countryAr: "",
    countryEn: "",
    governorateAr: "",
    governorateEn: "",
    cityAr: "",
    cityEn: "",
    addressEn: "",
    addressAr: "",
    phone: ""
  });

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

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleOpenForm = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        nameEn: branch.nameEn || "",
        nameAr: branch.nameAr || "",
        countryAr: branch.countryAr || "",
        countryEn: branch.countryEn || "",
        governorateAr: branch.governorateAr || "",
        governorateEn: branch.governorateEn || "",
        cityAr: branch.cityAr || "",
        cityEn: branch.cityEn || "",
        addressEn: branch.addressEn || "",
        addressAr: branch.addressAr || "",
        phone: branch.phone || ""
      });
    } else {
      setEditingBranch(null);
      setFormData({
        nameEn: "", nameAr: "", countryAr: "", countryEn: "", governorateAr: "", governorateEn: "", cityAr: "", cityEn: "", addressEn: "", addressAr: "", phone: ""
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

            {/* Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Country Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.country")}</label>
                <select
                  value={(() => {
                    const isCustom = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    return isCustom ? "أخرى" : formData.countryAr;
                  })()}
                  onChange={(e) => {
                    const val = e.target.value;
                    const selected = ARAB_COUNTRIES.find(c => c.nameAr === val);
                    if (selected && selected.id !== "OTHER") {
                      setFormData(prev => ({ ...prev, countryAr: selected.nameAr, countryEn: selected.nameEn, governorateAr: "", governorateEn: "", cityAr: "", cityEn: "" }));
                    } else if (selected && selected.id === "OTHER") {
                      setFormData(prev => ({ ...prev, countryAr: "أخرى", countryEn: "Other", governorateAr: "", governorateEn: "", cityAr: "", cityEn: "" }));
                    } else {
                      setFormData(prev => ({ ...prev, countryAr: "", countryEn: "", governorateAr: "", governorateEn: "", cityAr: "", cityEn: "" }));
                    }
                  }}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                >
                  <option value="">{locale === "ar" ? "اختر الدولة" : "Select Country"}</option>
                  {ARAB_COUNTRIES.map(c => <option key={c.id} value={c.nameAr}>{locale === "ar" ? c.nameAr : c.nameEn}</option>)}
                </select>
              </div>

              {/* Governorate Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.governorate")}</label>
                <select
                  value={(() => {
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                    return isCustomGov ? "أخرى" : formData.governorateAr;
                  })()}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    const selected = govs.find(g => g.nameAr === val);
                    if (selected && selected.id !== "OTHER") {
                      setFormData(prev => ({ ...prev, governorateAr: selected.nameAr, governorateEn: selected.nameEn, cityAr: "", cityEn: "" }));
                    } else if (selected && selected.id === "OTHER") {
                      setFormData(prev => ({ ...prev, governorateAr: "أخرى", governorateEn: "Other", cityAr: "", cityEn: "" }));
                    } else {
                      setFormData(prev => ({ ...prev, governorateAr: "", governorateEn: "", cityAr: "", cityEn: "" }));
                    }
                  }}
                  disabled={!formData.countryAr}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none disabled:opacity-50"
                >
                  <option value="">{locale === "ar" ? "اختر المحافظة" : "Select Governorate"}</option>
                  {(() => {
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    return govs.map(g => <option key={g.id} value={g.nameAr}>{locale === "ar" ? g.nameAr : g.nameEn}</option>);
                  })()}
                </select>
              </div>

              {/* City Select */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">{t("form.city")}</label>
                <select
                  value={(() => {
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                    const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (isCustomGov ? "OTHER" : null);
                    const cities = gId ? (CITIES[gId] || []) : [];
                    const isCustomCity = formData.cityAr && !cities.find(c => c.nameAr === formData.cityAr && c.id !== "OTHER");
                    return isCustomCity ? "أخرى" : formData.cityAr;
                  })()}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                    const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (isCustomGov ? "OTHER" : null);
                    const cities = gId ? (CITIES[gId] || []) : [];
                    const selected = cities.find(c => c.nameAr === val);
                    if (selected && selected.id !== "OTHER") {
                      setFormData(prev => ({ ...prev, cityAr: selected.nameAr, cityEn: selected.nameEn }));
                    } else if (selected && selected.id === "OTHER") {
                      setFormData(prev => ({ ...prev, cityAr: "أخرى", cityEn: "Other" }));
                    } else {
                      setFormData(prev => ({ ...prev, cityAr: "", cityEn: "" }));
                    }
                  }}
                  disabled={!formData.governorateAr}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none disabled:opacity-50"
                >
                  <option value="">{locale === "ar" ? "اختر المدينة" : "Select City"}</option>
                  {(() => {
                    const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                    const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                    const govs = cId ? (GOVERNORATES[cId] || []) : [];
                    const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                    const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (isCustomGov ? "OTHER" : null);
                    const cities = gId ? (CITIES[gId] || []) : [];
                    return cities.map(c => <option key={c.id} value={c.nameAr}>{locale === "ar" ? c.nameAr : c.nameEn}</option>);
                  })()}
                </select>
              </div>
            </div>

            {/* Custom Inputs Rendering */}
            <div className="space-y-4">
              {formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER") && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم الدولة (بالإنجليزية)" : "Write Country Name (English)"}</label>
                    <input type="text" value={formData.countryEn === "Other" ? "" : formData.countryEn} onChange={(e) => setFormData({...formData, countryEn: e.target.value})} placeholder="ex: France" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم الدولة (بالعربية)" : "Write Country Name (Arabic)"}</label>
                    <input type="text" value={formData.countryAr === "أخرى" ? "" : formData.countryAr} onChange={(e) => setFormData({...formData, countryAr: e.target.value})} placeholder="مثال: فرنسا" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="rtl" />
                  </div>
                </div>
              )}

              {(() => {
                const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (!ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER") ? "OTHER" : null);
                const govs = cId ? (GOVERNORATES[cId] || []) : [];
                const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                if (!isCustomGov) return null;
                return (
                  <div className="bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم المحافظة (بالإنجليزية)" : "Write Governorate Name (English)"}</label>
                      <input type="text" value={formData.governorateEn === "Other" ? "" : formData.governorateEn} onChange={(e) => setFormData({...formData, governorateEn: e.target.value})} placeholder="ex: Paris" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم المحافظة (بالعربية)" : "Write Governorate Name (Arabic)"}</label>
                      <input type="text" value={formData.governorateAr === "أخرى" ? "" : formData.governorateAr} onChange={(e) => setFormData({...formData, governorateAr: e.target.value})} placeholder="مثال: باريس" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="rtl" />
                    </div>
                  </div>
                );
              })()}

              {(() => {
                const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (!ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER") ? "OTHER" : null);
                const govs = cId ? (GOVERNORATES[cId] || []) : [];
                const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (!govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER") ? "OTHER" : null);
                const cities = gId ? (CITIES[gId] || []) : [];
                const isCustomCity = formData.cityAr && !cities.find(c => c.nameAr === formData.cityAr && c.id !== "OTHER");
                if (!isCustomCity) return null;
                return (
                  <div className="bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم المدينة (بالإنجليزية)" : "Write City Name (English)"}</label>
                      <input type="text" value={formData.cityEn === "Other" ? "" : formData.cityEn} onChange={(e) => setFormData({...formData, cityEn: e.target.value})} placeholder="ex: Lyon" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-emerald-400 mb-2">{locale === "ar" ? "اكتب اسم المدينة (بالعربية)" : "Write City Name (Arabic)"}</label>
                      <input type="text" value={formData.cityAr === "أخرى" ? "" : formData.cityAr} onChange={(e) => setFormData({...formData, cityAr: e.target.value})} placeholder="مثال: ليون" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" dir="rtl" />
                    </div>
                  </div>
                );
              })()}
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
                <div className="absolute top-6 ltr:right-6 rtl:left-6 flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
                    <span>
                      {[
                        locale === 'ar' ? (branch.addressAr || branch.addressEn) : (branch.addressEn || branch.addressAr),
                        locale === 'ar' ? (branch.cityAr || branch.cityEn) : (branch.cityEn || branch.cityAr),
                        locale === 'ar' ? (branch.governorateAr || branch.governorateEn) : (branch.governorateEn || branch.governorateAr),
                        locale === 'ar' ? (branch.countryAr || branch.countryEn) : (branch.countryEn || branch.countryAr)
                      ].filter(Boolean).join("، ")}
                    </span>
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
