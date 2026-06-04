"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Building2, ArrowRight, Loader2, Image as ImageIcon, MapPin, Phone, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ARAB_COUNTRIES, GOVERNORATES, CITIES } from "@/lib/locations";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  const t = useTranslations("Auth.register");
  const isAr = locale === "ar";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    email: "",
    password: "",
    whatsapp: "",
    category: "readyPerfumes",
    countryId: "EG",
    countryAr: "مصر",
    countryEn: "Egypt",
    governorateId: "",
    governorateAr: "",
    governorateEn: "",
    cityId: "",
    cityAr: "",
    cityEn: "",
    logo: "",
    coverImage: "",
    descriptionAr: "",
    descriptionEn: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 4 * 1024 * 1024) {
      alert(isAr ? "الصورة يجب أن تكون أقل من 4 ميجابايت" : "Image must be smaller than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setFormData(prev => ({...prev, [field]: base64Str}));
    };
    reader.readAsDataURL(file);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cId = e.target.value;
    const cObj = ARAB_COUNTRIES.find(c => c.id === cId);
    setFormData(prev => ({
      ...prev,
      countryId: cId,
      countryAr: cObj ? cObj.nameAr : "",
      countryEn: cObj ? cObj.nameEn : "",
      governorateId: "", governorateAr: "", governorateEn: "",
      cityId: "", cityAr: "", cityEn: ""
    }));
  };

  const handleGovChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const govId = e.target.value;
    const govList = GOVERNORATES[formData.countryId] || [];
    const govObj = govList.find(g => g.id === govId);
    setFormData(prev => ({
      ...prev, 
      governorateId: govId,
      governorateAr: govObj ? govObj.nameAr : "",
      governorateEn: govObj ? govObj.nameEn : "",
      cityId: "", cityAr: "", cityEn: ""
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cId = e.target.value;
    const cityList = CITIES[formData.governorateId] || [];
    const cityObj = cityList.find(c => c.id === cId);
    setFormData(prev => ({
      ...prev,
      cityId: cId,
      cityAr: cityObj ? cityObj.nameAr : "",
      cityEn: cityObj ? cityObj.nameEn : ""
    }));
  };

  const nextStep = () => {
    if (step === 1 && (!formData.nameEn || !formData.nameAr || !formData.email || !formData.password)) {
      setError(t("error"));
      return;
    }
    setError("");
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      router.push(`/${locale}/login`);
    } catch (err) {
      setError(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 font-cairo">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-950 border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
              <p className="text-zinc-400">{isAr ? "أكمل بيانات شركتك للبدء" : "Complete your company details to start"}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-500' : 'bg-white/10'}`} />
              <div className={`w-3 h-3 rounded-full transition-colors ${step >= 3 ? 'bg-emerald-500' : 'bg-white/10'}`} />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("nameArLabel")}</label>
                      <div className="relative">
                        <Building2 className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                        <input 
                          type="text" required dir="rtl"
                          value={formData.nameAr}
                          onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors font-cairo" 
                          placeholder="لوكس للعطور"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{t("nameEnLabel")}</label>
                      <div className="relative">
                        <Building2 className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                        <input 
                          type="text" required dir="ltr"
                          value={formData.nameEn}
                          onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                          placeholder="Luxe Perfumes"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("emailLabel")}</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                      <input 
                        type="email" required dir="ltr"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("passwordLabel")}</label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                      <input 
                        type="password" required dir="ltr"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button type="button" onClick={nextStep} className="w-full py-3.5 mt-4 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex justify-center items-center gap-2">
                    {isAr ? "التالي" : "Next"} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "التصنيف" : "Category"}</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="perfumeClones">{isAr ? "بدائل عطور" : "Perfume Clones"}</option>
                        <option value="readyPerfumes">{isAr ? "عطور جاهزة" : "Ready Perfumes"}</option>
                        <option value="glass">{isAr ? "زجاج" : "Glass"}</option>
                        <option value="bakhoor">{isAr ? "بخور" : "Bakhoor"}</option>
                        <option value="airFresheners">{isAr ? "معطرات جو" : "Air Fresheners"}</option>
                        <option value="packaging">{isAr ? "تعبئة وتغليف" : "Packaging"}</option>
                        <option value="bottlesAndEmpties">{isAr ? "فوارغ" : "Bottles & Empties"}</option>
                        <option value="others">{isAr ? "أخرى" : "Others"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "رقم الواتساب" : "WhatsApp Number"}</label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                        <input 
                          type="text" dir="ltr"
                          value={formData.whatsapp}
                          onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none" 
                          placeholder="+201234567890"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "الدولة" : "Country"}</label>
                      <select 
                        value={formData.countryId}
                        onChange={handleCountryChange}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                      >
                        <option value="">{isAr ? "اختر الدولة" : "Select Country"}</option>
                        {ARAB_COUNTRIES.map(c => (
                          <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "المحافظة" : "Governorate"}</label>
                      <select 
                        value={formData.governorateId}
                        onChange={handleGovChange}
                        disabled={!formData.countryId}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none disabled:opacity-50"
                      >
                        <option value="">{isAr ? "اختر المحافظة" : "Select Governorate"}</option>
                        {(GOVERNORATES[formData.countryId] || []).map(g => (
                          <option key={g.id} value={g.id}>{isAr ? g.nameAr : g.nameEn}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "المدينة" : "City"}</label>
                      <select 
                        value={formData.cityId}
                        onChange={handleCityChange}
                        disabled={!formData.governorateId}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none disabled:opacity-50"
                      >
                        <option value="">{isAr ? "اختر المدينة" : "Select City"}</option>
                        {(CITIES[formData.governorateId] || []).map(c => (
                          <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameEn}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "نبذة عن الشركة" : "About Company"}</label>
                    <textarea 
                      rows={3}
                      value={isAr ? formData.descriptionAr : formData.descriptionEn}
                      onChange={e => isAr ? setFormData({...formData, descriptionAr: e.target.value}) : setFormData({...formData, descriptionEn: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none resize-none" 
                      placeholder={isAr ? "اكتب نبذة مختصرة عن نشاط الشركة..." : "Write a brief description of your company..."}
                    />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={prevStep} className="px-6 py-3.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                      {isAr ? "السابق" : "Back"}
                    </button>
                    <button type="button" onClick={nextStep} className="flex-1 py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex justify-center items-center gap-2">
                      {isAr ? "التالي" : "Next"} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "شعار الشركة (Logo)" : "Company Logo"}</label>
                      <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/50 transition-all group overflow-hidden h-40">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        {formData.logo ? (
                          <Image src={formData.logo} alt="Logo" fill className="object-contain p-2 z-10" />
                        ) : (
                          <div className="text-center z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform group-hover:bg-emerald-500/20 group-hover:text-emerald-500">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-zinc-400">{isAr ? "اختر صورة الشعار" : "Choose Logo"}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">{isAr ? "غلاف الشركة (Cover)" : "Company Cover"}</label>
                      <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/50 transition-all group overflow-hidden h-40">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'coverImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        {formData.coverImage ? (
                          <Image src={formData.coverImage} alt="Cover" fill className="object-cover z-10" />
                        ) : (
                          <div className="text-center z-10">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform group-hover:bg-emerald-500/20 group-hover:text-emerald-500">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-zinc-400">{isAr ? "اختر صورة الغلاف" : "Choose Cover"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button type="button" onClick={prevStep} disabled={isLoading} className="px-6 py-3.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50">
                      {isAr ? "السابق" : "Back"}
                    </button>
                    <button type="submit" disabled={isLoading} className="flex-1 py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("submit")} <ArrowRight className="w-5 h-5 rtl:rotate-180" /></>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            {t("hasAccount")}{' '}
            <Link href={`/${locale}/login`} className="text-emerald-500 hover:text-emerald-400 font-bold">
              {t("loginLink")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
