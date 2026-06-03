'use client';

import { useState, useTransition, useEffect } from 'react';
import { updateCompanyStatus, deleteCompany, updateCompanyPassword, updateCompany } from '../actions';
import { Edit2, Trash2, CheckCircle, XCircle, Key, Loader2, Search, Filter, UploadCloud } from 'lucide-react';

export default function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  
  // Modals state
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [passwordModal, setPasswordModal] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setDbCategories(data))
      .catch(console.error);
  }, []);

  const filteredCompanies = companies.filter(c => 
    c.nameAr.includes(search) || 
    c.nameEn.includes(search) || 
    c.user.email.includes(search)
  );

  const handleStatusChange = (id: string, status: any) => {
    startTransition(async () => {
      await updateCompanyStatus(id, status);
      setCompanies(companies.map(c => c.id === id ? { ...c, status } : c));
    });
  };

  const handleDelete = (id: string, userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشركة وحساب المستخدم الخاص بها نهائياً؟')) return;
    startTransition(async () => {
      await deleteCompany(id, userId);
      setCompanies(companies.filter(c => c.id !== id));
    });
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) return alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    startTransition(async () => {
      await updateCompanyPassword(passwordModal.userId, newPassword);
      alert('تم تغيير كلمة المرور بنجاح!');
      setPasswordModal(null);
      setNewPassword('');
    });
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

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateCompany(editingCompany.id, {
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
        isSponsor: editingCompany.isSponsor
      });
      setCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
      setEditingCompany(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold mb-1">إدارة الشركات</h2>
          <p className="text-gray-400 text-sm">عرض وتعديل والتحكم في ظهور الشركات المسجلة</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو البريد..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-black/50 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-right whitespace-nowrap">
          <thead className="bg-white/5 text-gray-400 text-sm border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">الشركة</th>
              <th className="px-6 py-4 font-medium">الحساب (البريد)</th>
              <th className="px-6 py-4 font-medium text-center">الحالة</th>
              <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
              <th className="px-6 py-4 font-medium text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {company.logo ? (
                      <img src={company.logo} alt="" className="w-10 h-10 rounded-lg object-cover bg-white/10" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        {company.nameAr[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {company.nameAr}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {company.nameEn} • الترتيب: {company.order || 0}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium" dir="ltr">{company.user.email}</div>
                  <div className="text-xs text-gray-400">{company.whatsapp || 'لا يوجد واتساب'}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  {company.status === 'APPROVED' && <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">مقبول</span>}
                  {company.status === 'PENDING' && <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold">معلق</span>}
                  {company.status === 'REJECTED' && <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">مرفوض</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(company.createdAt).toLocaleDateString('ar-EG')}
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-end gap-2">
                    {company.status !== 'APPROVED' && (
                      <button onClick={() => handleStatusChange(company.id, 'APPROVED')} disabled={isPending} title="موافقة وظهور" className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {company.status !== 'REJECTED' && (
                      <button onClick={() => handleStatusChange(company.id, 'REJECTED')} disabled={isPending} title="رفض وإخفاء" className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                        <XCircle size={18} />
                      </button>
                    )}
                    <div className="w-px h-6 bg-white/10 mx-1"></div>
                    <button onClick={() => setPasswordModal(company)} title="تغيير كلمة المرور" className="p-2 text-amber-400 hover:bg-amber-400/20 rounded-lg transition-colors">
                      <Key size={18} />
                    </button>
                    <button onClick={() => setEditingCompany({...company})} title="تعديل البيانات" className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(company.id, company.userId)} disabled={isPending} title="حذف نهائي" className="p-2 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">لا توجد شركات مطابقة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Company Modal */}
      {editingCompany && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setEditingCompany(null)}
        >
          <div 
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">تعديل بيانات: {editingCompany.nameAr}</h3>
            <form onSubmit={handleSaveCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Info */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">البيانات الأساسية</h4></div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالعربية</label>
                <input type="text" value={editingCompany.nameAr} onChange={e => setEditingCompany({...editingCompany, nameAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالإنجليزية</label>
                <input type="text" value={editingCompany.nameEn} onChange={e => setEditingCompany({...editingCompany, nameEn: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">رابط الشركة (Slug - إنجليزي فقط)</label>
                  <input type="text" value={editingCompany.slug} onChange={e => setEditingCompany({...editingCompany, slug: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">ترتيب الظهور (رقم 1 يظهر أولاً، والافتراضي 0 يظهر في النهاية)</label>
                  <input type="number" value={editingCompany.order || 0} onChange={e => setEditingCompany({...editingCompany, order: parseInt(e.target.value) || 0})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
                </div>
              </div>

              {/* Descriptions */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">الوصف والروابط</h4></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">وصف الشركة (عربي)</label>
                <textarea rows={3} value={editingCompany.descriptionAr || ''} onChange={e => setEditingCompany({...editingCompany, descriptionAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">وصف الشركة (إنجليزي)</label>
                <textarea rows={3} value={editingCompany.descriptionEn || ''} onChange={e => setEditingCompany({...editingCompany, descriptionEn: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>

              {/* Media Uploads */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">شعار وغلاف الشركة</h4></div>
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">لوجو الشركة</label>
                  <div className="flex items-center gap-4">
                    {editingCompany.logo ? (
                      <img src={editingCompany.logo} alt="Logo" className="w-16 h-16 rounded-xl object-cover bg-white/10" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">لا يوجد</div>
                    )}
                    <label className="flex-1 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 cursor-pointer transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'logo')} 
                      />
                      <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 mb-1 transition-colors" />
                      <span className="text-xs text-gray-400">تغيير اللوجو</span>
                    </label>
                  </div>
                </div>

                {/* Cover Upload */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">غلاف الشركة (Cover)</label>
                  <div className="flex items-center gap-4">
                    {editingCompany.coverImage ? (
                      <img src={editingCompany.coverImage} alt="Cover" className="w-24 h-16 rounded-xl object-cover bg-white/10" />
                    ) : (
                      <div className="w-24 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">لا يوجد</div>
                    )}
                    <label className="flex-1 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 cursor-pointer transition-colors group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, 'coverImage')} 
                      />
                      <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 mb-1 transition-colors" />
                      <span className="text-xs text-gray-400">تغيير الغلاف</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">بيانات التواصل</h4></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">البريد الإلكتروني للشركة</label>
                <input type="email" value={editingCompany.email || ''} onChange={e => setEditingCompany({...editingCompany, email: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">رقم الواتساب</label>
                <input type="text" value={editingCompany.whatsapp || ''} onChange={e => setEditingCompany({...editingCompany, whatsapp: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الموقع الإلكتروني</label>
                <input type="text" value={editingCompany.website || ''} onChange={e => setEditingCompany({...editingCompany, website: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">أقسام الشركة (التصنيفات)</label>
                <div className="flex flex-wrap gap-3">
                  {dbCategories.map(cat => {
                    const selectedCategories = editingCompany.category ? editingCompany.category.split(',') : [];
                    const isSelected = selectedCategories.includes(cat.slug);
                    return (
                      <label 
                        key={cat.slug} 
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all ${
                          isSelected 
                          ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                          : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isSelected} 
                          onChange={() => {
                            let newCats = [...selectedCategories];
                            if (isSelected) {
                              newCats = newCats.filter((c: string) => c !== cat.slug);
                            } else {
                              newCats.push(cat.slug);
                            }
                            setEditingCompany({...editingCompany, category: newCats.join(',')});
                          }} 
                        />
                        <span className="text-sm font-bold">{cat.nameAr}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">الموقع الجغرافي</h4></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الدولة (عربي)</label>
                <input type="text" value={editingCompany.countryAr || ''} onChange={e => setEditingCompany({...editingCompany, countryAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">المحافظة (عربي)</label>
                <input type="text" value={editingCompany.governorateAr || ''} onChange={e => setEditingCompany({...editingCompany, governorateAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">المدينة (عربي)</label>
                <input type="text" value={editingCompany.cityAr || ''} onChange={e => setEditingCompany({...editingCompany, cityAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
                <input type="text" value={editingCompany.addressAr || ''} onChange={e => setEditingCompany({...editingCompany, addressAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" />
              </div>

              {/* Socials */}
              <div className="md:col-span-2"><h4 className="font-bold text-emerald-400 mt-2 border-b border-white/10 pb-2">منصات التواصل</h4></div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">فيسبوك</label>
                <input type="text" value={editingCompany.facebook || ''} onChange={e => setEditingCompany({...editingCompany, facebook: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">انستجرام</label>
                <input type="text" value={editingCompany.instagram || ''} onChange={e => setEditingCompany({...editingCompany, instagram: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">تويتر (X)</label>
                <input type="text" value={editingCompany.twitter || ''} onChange={e => setEditingCompany({...editingCompany, twitter: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-purple-500 text-white" dir="ltr" />
              </div>
              
              <div className="md:col-span-2 pt-4 flex flex-col md:flex-row gap-4">
              </div>

              <div className="md:col-span-2 flex items-center gap-3 mt-6">
                <button type="submit" disabled={isPending} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                  {isPending ? <Loader2 className="animate-spin" /> : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => setEditingCompany(null)} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setPasswordModal(null)}
        >
          <div 
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">تغيير كلمة المرور</h3>
            <p className="text-sm text-gray-400 mb-6">تغيير الباسورد لحساب: {passwordModal.user.email}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">كلمة المرور الجديدة</label>
                <input 
                  type="text" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-500 text-white" 
                  dir="ltr"
                  placeholder="********"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button onClick={handlePasswordChange} disabled={isPending} className="flex-1 bg-amber-500 text-black font-bold py-2 rounded-xl hover:bg-amber-400 flex items-center justify-center disabled:opacity-50">
                  {isPending ? <Loader2 className="animate-spin" /> : 'تغيير'}
                </button>
                <button onClick={() => setPasswordModal(null)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl hover:bg-white/20 transition-colors">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
