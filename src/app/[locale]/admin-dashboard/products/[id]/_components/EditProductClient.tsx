"use client";

import { useState, useTransition } from "react";
import { updateProduct } from "../../actions";
import { CheckCircle, XCircle, Loader2, UploadCloud, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProductClient({ initialProduct, companies }: { initialProduct: any, companies: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const [editingProduct, setEditingProduct] = useState(initialProduct);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("حجم الصورة يجب أن يكون أقل من 2 ميجابايت", "error");
      return;
    }
    
    try {
      const { resizeAndCompressImage } = await import('@/lib/imageUtils');
      const base64Str = await resizeAndCompressImage(file, 800, 800, 0.7);
      setEditingProduct({ ...editingProduct, image: base64Str });
    } catch (error) {
      showToast("حدث خطأ أثناء معالجة الصورة", "error");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.nameAr || !editingProduct.nameEn || !editingProduct.companyId) {
      showToast("يرجى إكمال البيانات الأساسية واختيار الشركة", "error");
      return;
    }

    startTransition(async () => {
      try {
        await updateProduct(editingProduct.id, {
          nameAr: editingProduct.nameAr,
          nameEn: editingProduct.nameEn,
          descriptionAr: editingProduct.descriptionAr,
          descriptionEn: editingProduct.descriptionEn,
          price: editingProduct.price ? parseFloat(editingProduct.price) : null,
          salesType: editingProduct.salesType || editingProduct.saleType,
          companyId: editingProduct.companyId,
          image: editingProduct.image,
          order: editingProduct.order,
          status: editingProduct.status
        });
        showToast("تم تحديث المنتج بنجاح");
      } catch (error) {
        showToast("حدث خطأ أثناء التحديث", "error");
      }
    });
  };

  const filteredDropdownCompanies = companies.filter(c => 
    c.nameAr.toLowerCase().includes(companySearchQuery.toLowerCase()) || 
    c.nameEn.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-[#111] p-6 rounded-2xl border border-white/10">
        <Link href="/ar/admin-dashboard/products" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowRight className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold mb-1">تعديل المنتج: {initialProduct.nameAr}</h1>
          <p className="text-gray-400 text-sm">تعديل كافة تفاصيل المنتج</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 p-6">
        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 relative">
            <label className="block text-sm text-gray-400 mb-2">الشركة المالكة للمنتج</label>
            {!editingProduct.companyId ? (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="ابحث عن الشركة هنا (بالعربية أو الإنجليزية)..." 
                  value={companySearchQuery}
                  onChange={e => {
                    setCompanySearchQuery(e.target.value);
                    setShowCompanyDropdown(true);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white"
                />
                {showCompanyDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#222] border border-white/10 rounded-xl max-h-48 overflow-y-auto z-50 shadow-2xl">
                    {filteredDropdownCompanies.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          setEditingProduct({...editingProduct, companyId: c.id});
                          setShowCompanyDropdown(false);
                        }}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0"
                      >
                        <div className="font-bold">{c.nameAr}</div>
                        <div className="text-xs text-gray-400">{c.nameEn}</div>
                      </div>
                    ))}
                    {filteredDropdownCompanies.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-sm">لا توجد شركات مطابقة</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full bg-[#1a1a1a] border border-emerald-500/50 rounded-xl px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-white font-bold">
                    {companies.find(c => c.id === editingProduct.companyId)?.nameAr}
                  </span>
                  <span className="text-xs text-gray-400">
                    {companies.find(c => c.id === editingProduct.companyId)?.nameEn}
                  </span>
                </div>
                <button type="button" onClick={() => {
                  setEditingProduct({...editingProduct, companyId: ''});
                  setCompanySearchQuery('');
                  setShowCompanyDropdown(true);
                }} className="text-emerald-400 hover:text-emerald-300 text-sm font-bold px-3 py-1 bg-emerald-500/10 rounded-lg transition-colors">
                  تغيير الشركة
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">اسم المنتج بالعربية *</label>
            <input type="text" value={editingProduct.nameAr} onChange={e => setEditingProduct({...editingProduct, nameAr: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" required />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">اسم المنتج بالإنجليزية *</label>
            <input type="text" value={editingProduct.nameEn} onChange={e => setEditingProduct({...editingProduct, nameEn: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">الوصف بالعربية</label>
            <textarea rows={3} value={editingProduct.descriptionAr || ''} onChange={e => setEditingProduct({...editingProduct, descriptionAr: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">الوصف بالإنجليزية</label>
            <textarea rows={3} value={editingProduct.descriptionEn || ''} onChange={e => setEditingProduct({...editingProduct, descriptionEn: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" dir="ltr" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">السعر التقريبي (اختياري)</label>
            <input type="text" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">نوع البيع</label>
            <select value={editingProduct.salesType || editingProduct.saleType || 'RETAIL'} onChange={e => setEditingProduct({...editingProduct, salesType: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white">
              <option value="RETAIL">تجزئة</option>
              <option value="WHOLESALE">جملة</option>
              <option value="BOTH">جملة وتجزئة</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">حالة المنتج</label>
            <select value={editingProduct.status || 'PENDING'} onChange={e => setEditingProduct({...editingProduct, status: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white">
              <option value="APPROVED">مقبول ومفعل</option>
              <option value="PENDING">معلق للمراجعة</option>
              <option value="REJECTED">مرفوض</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">الترتيب (الأولوية)</label>
            <input type="number" value={editingProduct.order || 0} onChange={e => setEditingProduct({...editingProduct, order: parseInt(e.target.value) || 0})} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 text-white" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">صورة المنتج</label>
            <div className="flex items-center gap-6 bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
              {editingProduct.image ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  <img src={editingProduct.image} alt="Product" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500 shrink-0">
                  لا توجد صورة
                </div>
              )}
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl cursor-pointer transition-colors font-bold text-sm">
                  <UploadCloud size={18} /> رفع صورة جديدة
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                <p className="text-xs text-gray-500 mt-2">الحجم الأقصى 2 ميجابايت، يفضل أن تكون مربعة بخلفية بيضاء أو شفافة.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end mt-4 pt-6 border-t border-white/10">
            <button type="submit" disabled={isPending} className="bg-emerald-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-emerald-400 flex items-center justify-center gap-2 text-lg">
              {isPending ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle size={24} />} حفظ التعديلات
            </button>
          </div>
        </form>
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
