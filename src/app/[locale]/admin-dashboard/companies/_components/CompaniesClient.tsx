'use client';

import { useState, useTransition, useEffect } from 'react';
import { updateCompanyStatus, deleteCompany, updateCompanyPassword, updateCompany, createCompany } from '../actions';
import { Edit2, Trash2, CheckCircle, XCircle, Key, Loader2, Search, Filter, UploadCloud, Plus } from 'lucide-react';
import Link from 'next/link';

export default function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modals state
  const [passwordModal, setPasswordModal] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setDbCategories(data))
      .catch(console.error);
  }, []);

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.nameAr.includes(search) || c.nameEn.includes(search) || c.user.email.includes(search);
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage, filterStatus]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage) || 1;
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    if (!editingCompany.nameAr || !editingCompany.email || !editingCompany.slug || (!editingCompany.id && !editingCompany.password)) {
      showToast("يرجى إدخال البيانات الأساسية (الاسم، البريد، الرابط، وكلمة المرور للشركات الجديدة)", 'error');
      return;
    }

    startTransition(async () => {
      try {
        if (editingCompany.id) {
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
            isSponsor: editingCompany.isSponsor,
            order: editingCompany.order
          });
          setCompanies(companies.map(c => c.id === editingCompany.id ? editingCompany : c));
          showToast("تم تحديث بيانات الشركة بنجاح", 'success');
        } else {
          const newCompany = await createCompany({
            ...editingCompany
          });
          setCompanies([newCompany, ...companies]);
          showToast("تم إضافة الشركة الجديدة بنجاح", 'success');
        }
        setEditingCompany(null);
      } catch (error: any) {
        showToast(error.message || "حدث خطأ غير متوقع", 'error');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          <div>
            <h2 className="text-2xl font-bold mb-1">إدارة الشركات</h2>
            <p className="text-gray-400 text-sm">عرض وتعديل والتحكم في ظهور الشركات المسجلة</p>
          </div>
          <Link 
            href="/ar/admin-dashboard/companies/new"
            className="md:hidden bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <Plus size={20} /> إضافة
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px] md:w-80">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="بحث بالاسم أو البريد..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-black/50 border border-white/10 rounded-xl px-3 py-3 focus:border-purple-500 outline-none text-white h-full shrink-0"
          title="تصفية حسب الحالة"
        >
          <option value="ALL">الجميع</option>
          <option value="APPROVED">المقبولة فقط</option>
          <option value="PENDING">المعلقة فقط</option>
        </select>
        <select 
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="bg-black/50 border border-white/10 rounded-xl px-3 py-3 focus:border-purple-500 outline-none text-white h-full shrink-0"
          title="عدد النتائج في الصفحة"
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={500}>500</option>
        </select>
        <Link 
          href="/ar/admin-dashboard/companies/new"
          className="hidden md:flex bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Plus size={20} /> إضافة شركة جديدة
        </Link>
        </div>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full text-right whitespace-nowrap">
          <thead className="bg-white/5 text-gray-400 text-sm border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium w-16">#</th>
              <th className="px-6 py-4 font-medium">الشركة</th>
              <th className="px-6 py-4 font-medium">الحساب (البريد)</th>
              <th className="px-6 py-4 font-medium text-center">الحالة</th>
              <th className="px-6 py-4 font-medium">تاريخ التسجيل</th>
              <th className="px-6 py-4 font-medium text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedCompanies.map((company, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
              <tr key={company.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-zinc-500">{globalIndex + 1}</td>
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
                    <Link 
                      href={`/ar/admin-dashboard/companies/${company.id}`} 
                      onClick={() => setNavigatingId(company.id)} 
                      title="تعديل بيانات الشركة والفروع" 
                      className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors flex items-center justify-center w-[34px] h-[34px]"
                    >
                      {navigatingId === company.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                    </Link>
                    <button onClick={() => handleDelete(company.id, company.userId)} disabled={isPending} title="حذف نهائي" className="p-2 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )})}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">لا توجد شركات مطابقة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCompanies.length > 0 && (
        <div className="p-4 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111]">
          <div className="text-gray-400 text-sm">
            إجمالي: {filteredCompanies.length} | صفحة {currentPage} من {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href={`?page=${Math.max(1, currentPage - 1)}`}
              className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
            >
              السابق
            </Link>
            <Link 
              href={`?page=${Math.min(totalPages, currentPage + 1)}`}
              className="px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white disabled:opacity-50 transition-colors"
            >
              التالي
            </Link>
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

      {/* Toast Notification */}
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
