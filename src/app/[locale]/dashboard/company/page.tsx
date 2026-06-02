"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, UploadCloud, Building2, MapPin, Globe, Phone, Mail, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ARAB_COUNTRIES, GOVERNORATES, CITIES } from "@/lib/locations";

export default function CompanySettingsPage() {
  const t = useTranslations("Dashboard.companyProfile");
  const locale = useLocale();
  const isAr = locale === "ar";
  const [activeSection, setActiveSection] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    category: "readyPerfumes",
    countryAr: "",
    countryEn: "",
    governorateAr: "",
    governorateEn: "",
    cityAr: "",
    cityEn: "",
    addressAr: "",
    addressEn: "",
    whatsapp: "",
    email: "",
    facebook: "",
    descriptionEn: "",
    descriptionAr: "",
    logo: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600",
    catalogPdf: ""
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/company/profile");
      if (res.ok) {
        const data = await res.json();
        setFormData({
          nameEn: data.nameEn || "",
          nameAr: data.nameAr || "",
          category: data.category || "readyPerfumes",
          countryAr: data.countryAr || "",
          countryEn: data.countryEn || "",
          governorateAr: data.governorateAr || "",
          governorateEn: data.governorateEn || "",
          cityAr: data.cityAr || "",
          cityEn: data.cityEn || "",
          addressAr: data.addressAr || "",
          addressEn: data.addressEn || "",
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          facebook: data.facebook || "",
          descriptionEn: data.descriptionEn || "",
          descriptionAr: data.descriptionAr || "",
          logo: data.logo || "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200",
          coverImage: data.coverImage || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600",
          catalogPdf: data.catalogPdf || ""
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be smaller than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setFormData(prev => ({ ...prev, [field]: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t("title") ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors border border-white/5">
            {t("saveDraft")}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t("publish")}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 sticky top-28 space-y-2">
            {[
              { id: 'general', name: t("tabs.general"), icon: <Building2 className="w-4 h-4" /> },
              { id: 'media', name: t("tabs.media"), icon: <UploadCloud className="w-4 h-4" /> },
              { id: 'contact', name: t("tabs.contact"), icon: <Phone className="w-4 h-4" /> },
              { id: 'about', name: t("tabs.about"), icon: <FileText className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeSection === tab.id 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* GENERAL INFO SECTION */}
          {activeSection === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">{t("general.title")}</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.nameEn")}</label>
                      <input 
                        type="text" 
                        value={formData.nameEn}
                        onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.nameAr")}</label>
                      <input 
                        type="text" 
                        value={formData.nameAr}
                        onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                        dir="rtl" 
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors font-cairo" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.category")}</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { id: "perfumeClones", label: t("general.categoryOptions.perfumeClones") },
                        { id: "readyPerfumes", label: t("general.categoryOptions.readyPerfumes") },
                        { id: "glass", label: t("general.categoryOptions.glass") },
                        { id: "bakhoor", label: t("general.categoryOptions.bakhoor") },
                        { id: "airFresheners", label: t("general.categoryOptions.airFresheners") },
                        { id: "packaging", label: t("general.categoryOptions.packaging") },
                        { id: "bottlesAndEmpties", label: t("general.categoryOptions.bottlesAndEmpties") },
                        { id: "others", label: t("general.categoryOptions.others") }
                      ].map(cat => {
                        const selectedCategories = formData.category ? formData.category.split(',') : [];
                        const isSelected = selectedCategories.includes(cat.id);
                        return (
                          <label 
                            key={cat.id} 
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all ${
                              isSelected 
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                              : 'bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-300'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={isSelected} 
                              onChange={() => {
                                let newCats = [...selectedCategories];
                                if (isSelected) {
                                  newCats = newCats.filter(c => c !== cat.id);
                                } else {
                                  newCats.push(cat.id);
                                }
                                setFormData({...formData, category: newCats.join(',')});
                              }} 
                            />
                            {cat.label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6 border-b border-white/5 pb-8 mb-8">
                    {/* Country Row */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.country")}</label>
                          <select
                            value={(() => {
                              const isCustom = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                              return isCustom ? "أخرى" : formData.countryAr;
                            })()}
                            onChange={(e) => {
                              const val = e.target.value;
                              const selected = ARAB_COUNTRIES.find(c => c.nameAr === val);
                              if (selected && selected.id !== "OTHER") {
                                setFormData(prev => ({
                                  ...prev, countryAr: selected.nameAr, countryEn: selected.nameEn,
                                  governorateAr: "", governorateEn: "", cityAr: "", cityEn: ""
                                }));
                              } else if (selected && selected.id === "OTHER") {
                                setFormData(prev => ({
                                  ...prev, countryAr: "أخرى", countryEn: "Other",
                                  governorateAr: "", governorateEn: "", cityAr: "", cityEn: ""
                                }));
                              } else {
                                setFormData(prev => ({ ...prev, countryAr: "", countryEn: "", governorateAr: "", governorateEn: "", cityAr: "", cityEn: "" }));
                              }
                            }}
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                          >
                            <option value="">{isAr ? "اختر الدولة" : "Select Country"}</option>
                            {ARAB_COUNTRIES.map(c => <option key={c.id} value={c.nameAr}>{isAr ? c.nameAr : c.nameEn}</option>)}
                          </select>
                        </div>
                        {formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER") && (
                          <>
                            <div className="md:col-span-1">
                              <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.country")} (English)</label>
                              <input 
                                type="text" 
                                value={formData.countryEn === "Other" ? "" : formData.countryEn}
                                onChange={(e) => setFormData({...formData, countryEn: e.target.value})}
                                placeholder="ex: France"
                                className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                              />
                            </div>
                            <div className="md:col-span-1">
                              <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.country")} (Arabic)</label>
                              <input 
                                type="text" 
                                value={formData.countryAr === "أخرى" ? "" : formData.countryAr}
                                onChange={(e) => setFormData({...formData, countryAr: e.target.value})}
                                placeholder="مثال: فرنسا"
                                className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                                dir="rtl"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Governorate Row */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.governorate")}</label>
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
                            <option value="">{isAr ? "اختر المحافظة" : "Select Governorate"}</option>
                            {(() => {
                              const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                              const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                              const govs = cId ? (GOVERNORATES[cId] || []) : [];
                              return govs.map(g => <option key={g.id} value={g.nameAr}>{isAr ? g.nameAr : g.nameEn}</option>);
                            })()}
                          </select>
                        </div>
                        {(() => {
                          const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                          const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                          const govs = cId ? (GOVERNORATES[cId] || []) : [];
                          const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                          if (!isCustomGov) return null;
                          return (
                            <>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.governorate")} (English)</label>
                                <input 
                                  type="text" 
                                  value={formData.governorateEn === "Other" ? "" : formData.governorateEn}
                                  onChange={(e) => setFormData({...formData, governorateEn: e.target.value})}
                                  placeholder="ex: Paris"
                                  className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.governorate")} (Arabic)</label>
                                <input 
                                  type="text" 
                                  value={formData.governorateAr === "أخرى" ? "" : formData.governorateAr}
                                  onChange={(e) => setFormData({...formData, governorateAr: e.target.value})}
                                  placeholder="مثال: باريس"
                                  className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                                  dir="rtl"
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* City Row */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.city")}</label>
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
                            <option value="">{isAr ? "اختر المدينة" : "Select City"}</option>
                            {(() => {
                              const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                              const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                              const govs = cId ? (GOVERNORATES[cId] || []) : [];
                              const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                              const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (isCustomGov ? "OTHER" : null);
                              const cities = gId ? (CITIES[gId] || []) : [];
                              return cities.map(c => <option key={c.id} value={c.nameAr}>{isAr ? c.nameAr : c.nameEn}</option>);
                            })()}
                          </select>
                        </div>
                        {(() => {
                          const isCustomCountry = formData.countryAr && !ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr && c.id !== "OTHER");
                          const cId = ARAB_COUNTRIES.find(c => c.nameAr === formData.countryAr)?.id || (isCustomCountry ? "OTHER" : null);
                          const govs = cId ? (GOVERNORATES[cId] || []) : [];
                          const isCustomGov = formData.governorateAr && !govs.find(g => g.nameAr === formData.governorateAr && g.id !== "OTHER");
                          const gId = govs.find(g => g.nameAr === formData.governorateAr)?.id || (isCustomGov ? "OTHER" : null);
                          const cities = gId ? (CITIES[gId] || []) : [];
                          const isCustomCity = formData.cityAr && !cities.find(c => c.nameAr === formData.cityAr && c.id !== "OTHER");
                          if (!isCustomCity) return null;
                          return (
                            <>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.city")} (English)</label>
                                <input 
                                  type="text" 
                                  value={formData.cityEn === "Other" ? "" : formData.cityEn}
                                  onChange={(e) => setFormData({...formData, cityEn: e.target.value})}
                                  placeholder="ex: Lyon"
                                  className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-emerald-400 mb-2">{t("general.city")} (Arabic)</label>
                                <input 
                                  type="text" 
                                  value={formData.cityAr === "أخرى" ? "" : formData.cityAr}
                                  onChange={(e) => setFormData({...formData, cityAr: e.target.value})}
                                  placeholder="مثال: ليون"
                                  className="w-full bg-emerald-500/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                                  dir="rtl"
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.address")} (English)</label>
                      <input 
                        type="text" 
                        value={formData.addressEn}
                        onChange={(e) => setFormData({...formData, addressEn: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("general.address")} (Arabic)</label>
                      <input 
                        type="text" 
                        value={formData.addressAr}
                        onChange={(e) => setFormData({...formData, addressAr: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BRAND MEDIA SECTION */}
          {activeSection === "media" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">{t("media.title")}</h2>
                
                {/* Logo Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-zinc-400 mb-4">{t("media.logo")}</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative shadow-xl">
                      <Image src={formData.logo} alt="Logo Preview" fill className="object-cover" />
                    </div>
                    <label className="flex-1 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'logo')} 
                      />
                      <UploadCloud className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors mb-2" />
                      <p className="text-sm text-zinc-300 font-medium">{t("media.uploadLogoText")}</p>
                      <p className="text-xs text-zinc-500 mt-1">{t("media.uploadLogoHint")}</p>
                    </label>
                  </div>
                </div>

                {/* Cover Upload */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-4">{t("media.cover")}</label>
                  <label className="block border-2 border-dashed border-white/10 rounded-2xl p-2 relative group cursor-pointer hover:border-emerald-500/50 transition-colors bg-zinc-900/50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, 'coverImage')} 
                    />
                    <div className="relative h-48 w-full rounded-xl overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                      <Image src={formData.coverImage} alt="Cover Preview" fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 text-white font-bold text-sm border border-white/10">
                        <UploadCloud className="w-5 h-5" /> {t("media.replaceCover")}
                      </div>
                    </div>
                  </label>
                </div>

              </div>
            </motion.div>
          )}

          {/* CONTACT SECTION */}
          {activeSection === "contact" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">{t("contact.title")}</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("contact.whatsapp")}</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input 
                        type="text" 
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors dir-ltr text-left" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("contact.email")}</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("contact.facebook")}</label>
                    <div className="relative">
                      <Globe className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input 
                        type="url" 
                        value={formData.facebook}
                        onChange={(e) => setFormData({...formData, facebook: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors dir-ltr text-left" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === "about" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">{t("about.title")}</h2>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">{t("about.description")} (English)</label>
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors mb-6">
                    <textarea 
                      rows={5}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                      className="w-full bg-transparent p-4 text-white outline-none resize-y leading-relaxed font-light"
                    />
                  </div>
                  
                  <label className="block text-sm font-medium text-zinc-400 mb-2">{t("about.description")} (Arabic)</label>
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                    <textarea 
                      rows={5}
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                      className="w-full bg-transparent p-4 text-white outline-none resize-y leading-relaxed font-light"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
