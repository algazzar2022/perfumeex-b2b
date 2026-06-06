"use client";

import { useState, useTransition } from "react";
import { updateCompany, createCompany, createBranch, updateBranch, deleteBranch, addGalleryImage, deleteGalleryImage } from "../../actions";
import { CheckCircle, XCircle, Loader2, UploadCloud, Plus, Trash2, Edit2, Image as ImageIcon, Building2, FileText, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ARAB_COUNTRIES, GOVERNORATES, CITIES } from "@/lib/locations";

export default function EditCompanyClient({ initialCompany, dbCategories, isNew = false }: { initialCompany: any, dbCategories: any[], isNew?: boolean }) {
  const [activeTab, setActiveTab] = useState<'basic' | 'branches' | 'gallery'>('basic');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [company, setCompany] = useState(initialCompany);
  
  // Basic info state
  const [editingCompany, setEditingCompany] = useState(initialCompany);

  // Branches state
  const [editingBranch, setEditingBranch] = useState<any>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 4 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setEditingCompany((prev: any) => ({ ...prev, [field]: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const payload: any = {
          nameAr: editingCompany.nameAr,
          nameEn: editingCompany.nameEn,
          slug: editingCompany.slug,
          descriptionAr: editingCompany.descriptionAr,
          descriptionEn: editingCompany.descriptionEn,
          logo: editingCompany.logo,
          coverImage: editingCompany.coverImage,
          category: editingCompany.category,
          countryAr: editingCompany.countryAr,
          countryEn: editingCompany.countryEn,
          governorateAr: editingCompany.governorateAr,
          governorateEn: editingCompany.governorateEn,
          cityAr: editingCompany.cityAr,
          cityEn: editingCompany.cityEn,
          addressAr: editingCompany.addressAr,
          addressEn: editingCompany.addressEn,
          email: editingCompany.email,
          whatsapp: editingCompany.whatsapp,
          website: editingCompany.website,
          facebook: editingCompany.facebook,
          instagram: editingCompany.instagram,
          twitter: editingCompany.twitter,
          isFeatured: editingCompany.isFeatured,
          isSponsor: editingCompany.isSponsor,
          order: editingCompany.order
        };

        if (editingCompany.customCity !== undefined && editingCompany.customCity.trim() !== '') {
          payload.cityAr = editingCompany.customCity;
        } else if (payload.cityAr === 'أخرى') {
          throw new Error("يرجى إدخال اسم المدينة");
        }

        if (isNew) {
          const newCompany = await createCompany({
            ...payload,
            password: editingCompany.password
          });
          showToast("تم إضافة الشركة بنجاح");
          router.push(`/ar/admin-dashboard/companies/${newCompany.id}`);
        } else {
          await updateCompany(company.id, payload);
          setCompany({ ...company, ...editingCompany });
          showToast("تم حفظ البيانات الأساسية بنجاح");
        }
      } catch (error: any) {
        showToast(error.message || "حدث خطأ غير متوقع", 'error');
      }
    });
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch.nameAr || !editingBranch.nameEn) {
      showToast("يرجى إدخال اسم الفرع باللغتين", 'error');
      return;
    }

    startTransition(async () => {
      try {
        const { id, customCity, ...branchData } = editingBranch;
        
        if (customCity !== undefined && customCity.trim() !== '') {
          branchData.cityAr = customCity;
        } else if (branchData.cityAr === 'أخرى') {
          showToast("يرجى إدخال اسم المدينة", 'error');
          return;
        }

        if (id) {
          await updateBranch(id, branchData);
          setCompany({
            ...company,
            branches: company.branches.map((b: any) => b.id === id ? { id, ...branchData } : b)
          });
          showToast("تم تحديث الفرع بنجاح");
        } else {
          await createBranch(company.id, branchData);
          showToast("تم إضافة الفرع بنجاح. قم بتحديث الصفحة لرؤيته.");
        }
        setEditingBranch(null);
      } catch (error) {
        showToast("حدث خطأ أثناء حفظ الفرع", 'error');
      }
    });
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الفرع؟")) return;
    startTransition(async () => {
      try {
        await deleteBranch(id);
        setCompany({ ...company, branches: company.branches.filter((b: any) => b.id !== id) });
        showToast("تم حذف الفرع بنجاح");
      } catch (error) {
        showToast("حدث خطأ أثناء الحذف", 'error');
      }
    });
  };

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 4 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = event.target?.result as string;
      startTransition(async () => {
        try {
          await addGalleryImage(company.id, base64Str, 'IMAGE');
          showToast("تم رفع الصورة بنجاح. قم بتحديث الصفحة لرؤيتها.");
        } catch (error) {
          showToast("حدث خطأ أثناء الرفع", 'error');
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
    startTransition(async () => {
      try {
        await deleteGalleryImage(id);
        setCompany({ ...company, galleries: company.galleries.filter((g: any) => g.id !== id) });
        showToast("تم حذف الصورة بنجاح");
      } catch (error) {
        showToast("حدث خطأ أثناء الحذف", 'error');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/10">
        <Link href="/ar/admin-dashboard/companies" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold mb-1">{isNew ? 'إضافة شركة جديدة' : `تعديل شركة: ${company.nameAr}`}</h1>
          <p className="text-gray-400 text-sm">تعديل البيانات الأساسية، الفروع، ومعرض الصور</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setActiveTab('basic')}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors ${activeTab === 'basic' ? 'bg-emerald-500 text-black' : 'bg-[#111] border border-white/10 hover:bg-white/5'}`}
        >
          <FileText size={18} /> البيانات الأساسية
        </button>
        <button 
          onClick={() => setActiveTab('branches')}
          disabled={isNew}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'branches' ? 'bg-emerald-500 text-black' : 'bg-[#111] border border-white/10 hover:bg-white/5'}`}
        >
          <Building2 size={18} /> الفروع ({company.branches?.length || 0})
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          disabled={isNew}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'gallery' ? 'bg-emerald-500 text-black' : 'bg-[#111] border border-white/10 hover:bg-white/5'}`}
        >
          <ImageIcon size={18} /> معرض الصور ({company.galleries?.length || 0})
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveBasicInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">شعار الشركة (Logo)</label>
                <div className="flex items-center gap-4">
                  {editingCompany.logo ? (
                    <img src={editingCompany.logo} alt="Logo" className="w-20 h-20 rounded-full object-cover bg-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">لا يوجد</div>
                  )}
                  <label className="border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 cursor-pointer transition-colors group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                    <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 mb-1 transition-colors" />
                    <span className="text-xs text-gray-400">تغيير الشعار</span>
                  </label>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">صورة الغلاف (Cover)</label>
                <div className="flex items-center gap-4 w-full">
                  {editingCompany.coverImage ? (
                    <img src={editingCompany.coverImage} alt="Cover" className="h-20 w-40 rounded-xl object-cover bg-white/10" />
                  ) : (
                    <div className="h-20 w-40 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">لا يوجد</div>
                  )}
                  <label className="flex-1 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 cursor-pointer transition-colors group">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'coverImage')} />
                    <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 mb-1 transition-colors" />
                    <span className="text-xs text-gray-400">تغيير الغلاف</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-4 border-b border-white/10 pb-2">البيانات الأساسية</h4></div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">الاسم بالعربية</label>
              <input type="text" value={editingCompany.nameAr || ''} onChange={e => setEditingCompany({...editingCompany, nameAr: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الاسم بالإنجليزية</label>
              <input type="text" value={editingCompany.nameEn || ''} onChange={e => {
                const newName = e.target.value;
                const newSlug = newName.trim().replace(/\s+/g, '.').toLowerCase();
                setEditingCompany(prev => ({
                  ...prev, 
                  nameEn: newName,
                  ...(isNew ? { slug: newSlug } : {})
                }));
              }} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الرابط المخصص (Slug)</label>
              <input type="text" value={editingCompany.slug || ''} onChange={e => {
                const formattedSlug = e.target.value.replace(/\s+/g, '.');
                setEditingCompany({...editingCompany, slug: formattedSlug});
              }} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">القسم</label>
              <select value={editingCompany.category || ''} onChange={e => setEditingCompany({...editingCompany, category: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white">
                <option value="">اختر القسم...</option>
                {dbCategories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.nameAr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">ترتيب الظهور (0 افتراضي)</label>
              <input type="number" value={editingCompany.order || 0} onChange={e => setEditingCompany({...editingCompany, order: parseInt(e.target.value) || 0})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">نبذة بالعربية</label>
              <textarea rows={3} value={editingCompany.descriptionAr || ''} onChange={e => setEditingCompany({...editingCompany, descriptionAr: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">نبذة بالإنجليزية</label>
              <textarea rows={3} value={editingCompany.descriptionEn || ''} onChange={e => setEditingCompany({...editingCompany, descriptionEn: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
            </div>

            <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-4 border-b border-white/10 pb-2">بيانات التواصل</h4></div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">البريد الإلكتروني للشركة</label>
              <input type="email" value={editingCompany.email || ''} onChange={e => setEditingCompany({...editingCompany, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white disabled:opacity-50" dir="ltr" disabled={!isNew} />
            </div>
            {isNew && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">كلمة المرور</label>
                <input type="password" value={editingCompany.password || ''} onChange={e => setEditingCompany({...editingCompany, password: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" required />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">رقم الواتساب</label>
              <input type="text" value={editingCompany.whatsapp || ''} onChange={e => setEditingCompany({...editingCompany, whatsapp: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">الموقع الإلكتروني</label>
              <input type="text" value={editingCompany.website || ''} onChange={e => setEditingCompany({...editingCompany, website: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">فيسبوك (Facebook)</label>
              <input type="url" value={editingCompany.facebook || ''} onChange={e => setEditingCompany({...editingCompany, facebook: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">إنستجرام (Instagram)</label>
              <input type="url" value={editingCompany.instagram || ''} onChange={e => setEditingCompany({...editingCompany, instagram: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">تويتر (X)</label>
              <input type="url" value={editingCompany.twitter || ''} onChange={e => setEditingCompany({...editingCompany, twitter: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" placeholder="https://x.com/..." />
            </div>

            <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-4 border-b border-white/10 pb-2">العنوان والموقع الجغرافي</h4></div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">الدولة</label>
              <select 
                value={ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id || ''} 
                onChange={e => {
                  const cId = e.target.value;
                  const cObj = ARAB_COUNTRIES.find(c => c.id === cId);
                  setEditingCompany({
                    ...editingCompany, 
                    countryAr: cObj ? cObj.nameAr : '',
                    governorateAr: '',
                    cityAr: ''
                  });
                }} 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
              >
                <option value="">اختر الدولة</option>
                {ARAB_COUNTRIES.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">المحافظة</label>
              <select 
                value={(() => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  return govs.find(g => g.nameAr === editingCompany.governorateAr)?.id || '';
                })()} 
                onChange={e => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  const govId = e.target.value;
                  const govObj = govs.find(g => g.id === govId);
                  setEditingCompany({
                    ...editingCompany,
                    governorateAr: govObj ? govObj.nameAr : '',
                    cityAr: ''
                  });
                }} 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
              >
                <option value="">اختر المحافظة</option>
                {(() => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  return cId ? (GOVERNORATES[cId] || []).map(g => (
                    <option key={g.id} value={g.id}>{g.nameAr}</option>
                  )) : null;
                })()}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">المدينة</label>
              <select 
                value={(() => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  const govId = govs.find(g => g.nameAr === editingCompany.governorateAr)?.id;
                  const cities = govId ? CITIES[govId] || [] : [];
                  const cityObj = cities.find(c => c.nameAr === editingCompany.cityAr);
                  if (cityObj) return cityObj.id;
                  if (editingCompany.cityAr) return "OTHER";
                  return '';
                })()} 
                onChange={e => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  const govId = govs.find(g => g.nameAr === editingCompany.governorateAr)?.id;
                  const cities = govId ? CITIES[govId] || [] : [];
                  const cityId = e.target.value;
                  const cityObj = cities.find(c => c.id === cityId);
                  setEditingCompany({
                    ...editingCompany,
                    cityAr: cityObj ? cityObj.nameAr : '',
                    customCity: ''
                  });
                }} 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
              >
                <option value="">اختر المدينة</option>
                {(() => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  const govId = govs.find(g => g.nameAr === editingCompany.governorateAr)?.id;
                  return govId ? (CITIES[govId] || []).map(c => (
                    <option key={c.id} value={c.id}>{c.nameAr}</option>
                  )) : null;
                })()}
              </select>
            </div>
            {(() => {
              const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingCompany.countryAr)?.id;
              const govs = cId ? GOVERNORATES[cId] || [] : [];
              const govId = govs.find(g => g.nameAr === editingCompany.governorateAr)?.id;
              const cities = govId ? CITIES[govId] || [] : [];
              const isOther = editingCompany.cityAr === 'أخرى' || (editingCompany.cityAr && !cities.find(c => c.nameAr === editingCompany.cityAr));
              
              if (isOther) {
                return (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">اسم المدينة (أخرى)</label>
                    <input 
                      type="text" 
                      value={editingCompany.customCity !== undefined ? editingCompany.customCity : (editingCompany.cityAr === 'أخرى' ? '' : editingCompany.cityAr)} 
                      onChange={e => setEditingCompany({...editingCompany, customCity: e.target.value})} 
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" 
                      placeholder="اكتب اسم المدينة"
                      required
                    />
                  </div>
                );
              }
              return null;
            })()}

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">العنوان بالعربية بالتفصيل</label>
              <input type="text" value={editingCompany.addressAr || ''} onChange={e => setEditingCompany({...editingCompany, addressAr: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button type="submit" disabled={isPending} className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />} حفظ التعديلات الأساسية
              </button>
            </div>
          </form>
        )}

        {activeTab === 'branches' && (
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold">فروع الشركة</h2>
              <button 
                onClick={() => setEditingBranch({ id: '', nameAr: '', nameEn: '', countryAr: '', governorateAr: '', cityAr: '', addressAr: '', phone: '' })}
                className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> إضافة فرع جديد
              </button>
            </div>

            {editingBranch && (
              <form onSubmit={handleSaveBranch} className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">اسم الفرع بالعربية</label>
                  <input type="text" value={editingBranch.nameAr} onChange={e => setEditingBranch({...editingBranch, nameAr: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">اسم الفرع بالإنجليزية</label>
                  <input type="text" value={editingBranch.nameEn} onChange={e => setEditingBranch({...editingBranch, nameEn: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">الدولة</label>
                  <select 
                    value={ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id || ''} 
                    onChange={e => {
                      const cId = e.target.value;
                      const cObj = ARAB_COUNTRIES.find(c => c.id === cId);
                      setEditingBranch({
                        ...editingBranch, 
                        countryAr: cObj ? cObj.nameAr : '',
                        governorateAr: '',
                        cityAr: ''
                      });
                    }} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
                  >
                    <option value="">اختر الدولة</option>
                    {ARAB_COUNTRIES.map(c => (
                      <option key={c.id} value={c.id}>{c.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">المحافظة</label>
                  <select 
                    value={(() => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      const govs = cId ? GOVERNORATES[cId] || [] : [];
                      return govs.find(g => g.nameAr === editingBranch.governorateAr)?.id || '';
                    })()} 
                    onChange={e => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      const govs = cId ? GOVERNORATES[cId] || [] : [];
                      const govId = e.target.value;
                      const govObj = govs.find(g => g.id === govId);
                      setEditingBranch({
                        ...editingBranch,
                        governorateAr: govObj ? govObj.nameAr : '',
                        cityAr: ''
                      });
                    }} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
                  >
                    <option value="">اختر المحافظة</option>
                    {(() => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      return cId ? (GOVERNORATES[cId] || []).map(g => (
                        <option key={g.id} value={g.id}>{g.nameAr}</option>
                      )) : null;
                    })()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">المدينة</label>
                  <select 
                    value={(() => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      const govs = cId ? GOVERNORATES[cId] || [] : [];
                      const govId = govs.find(g => g.nameAr === editingBranch.governorateAr)?.id;
                      const cities = govId ? CITIES[govId] || [] : [];
                      const cityObj = cities.find(c => c.nameAr === editingBranch.cityAr);
                      if (cityObj) return cityObj.id;
                      if (editingBranch.cityAr) return "OTHER";
                      return '';
                    })()} 
                    onChange={e => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      const govs = cId ? GOVERNORATES[cId] || [] : [];
                      const govId = govs.find(g => g.nameAr === editingBranch.governorateAr)?.id;
                      const cities = govId ? CITIES[govId] || [] : [];
                      const cityId = e.target.value;
                      const cityObj = cities.find(c => c.id === cityId);
                      setEditingBranch({
                        ...editingBranch,
                        cityAr: cityObj ? cityObj.nameAr : '',
                        customCity: ''
                      });
                    }} 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
                  >
                    <option value="">اختر المدينة</option>
                    {(() => {
                      const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                      const govs = cId ? GOVERNORATES[cId] || [] : [];
                      const govId = govs.find(g => g.nameAr === editingBranch.governorateAr)?.id;
                      return govId ? (CITIES[govId] || []).map(c => (
                        <option key={c.id} value={c.id}>{c.nameAr}</option>
                      )) : null;
                    })()}
                  </select>
                </div>
                {(() => {
                  const cId = ARAB_COUNTRIES.find(c => c.nameAr === editingBranch.countryAr)?.id;
                  const govs = cId ? GOVERNORATES[cId] || [] : [];
                  const govId = govs.find(g => g.nameAr === editingBranch.governorateAr)?.id;
                  const cities = govId ? CITIES[govId] || [] : [];
                  const isOther = editingBranch.cityAr === 'أخرى' || (editingBranch.cityAr && !cities.find(c => c.nameAr === editingBranch.cityAr));
                  
                  if (isOther) {
                    return (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">اسم المدينة (أخرى)</label>
                        <input 
                          type="text" 
                          value={editingBranch.customCity !== undefined ? editingBranch.customCity : (editingBranch.cityAr === 'أخرى' ? '' : editingBranch.cityAr)} 
                          onChange={e => setEditingBranch({...editingBranch, customCity: e.target.value})} 
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" 
                          placeholder="اكتب اسم المدينة"
                          required
                        />
                      </div>
                    );
                  }
                  return null;
                })()}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">العنوان بالتفصيل</label>
                  <input type="text" value={editingBranch.addressAr || ''} onChange={e => setEditingBranch({...editingBranch, addressAr: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">رقم الهاتف</label>
                  <input type="text" value={editingBranch.phone || ''} onChange={e => setEditingBranch({...editingBranch, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <button type="submit" disabled={isPending} className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
                    {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : 'حفظ الفرع'}
                  </button>
                  <button type="button" onClick={() => setEditingBranch(null)} className="px-6 py-2 rounded-xl font-bold flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20">
                    إلغاء
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {company.branches?.length === 0 ? (
                <p className="text-gray-400 text-center py-8">لا يوجد فروع مضافة لهذه الشركة</p>
              ) : (
                company.branches?.map((branch: any) => (
                  <div key={branch.id} className="bg-[#1a1a1a] p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div>
                      <h4 className="font-bold">{branch.nameAr} <span className="text-sm font-normal text-gray-400 mx-2">{branch.nameEn}</span></h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {[branch.countryAr, branch.governorateAr, branch.cityAr, branch.addressAr].filter(Boolean).join(' - ') || 'لا يوجد عنوان محدد'} 
                        <br/><span className="text-emerald-400 mt-1 inline-block" dir="ltr">{branch.phone}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingBranch(branch)} className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteBranch(branch.id)} disabled={isPending} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold">معرض الصور</h2>
              <label className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm cursor-pointer hover:bg-emerald-400 transition-colors">
                {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Plus size={16} /> إضافة صورة جديدة</>}
                <input type="file" accept="image/*" className="hidden" onChange={handleAddGalleryImage} disabled={isPending} />
              </label>
            </div>

            {company.galleries?.length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا يوجد صور في المعرض لهذه الشركة</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {company.galleries?.map((image: any) => (
                  <div key={image.id} className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <img src={image.url} alt="Gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={() => handleDeleteGalleryImage(image.id)}
                        disabled={isPending}
                        className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm ${
            toastMessage.type === 'success' ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {toastMessage.message}
          </div>
        </div>
      )}
    </div>
  );
}
