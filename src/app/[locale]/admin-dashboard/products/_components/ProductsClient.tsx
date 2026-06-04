"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Search, CheckCircle, XCircle, Trash2, Edit2, Loader2, Plus, UploadCloud } from "lucide-react";
import { updateProductStatus, deleteProduct, updateProduct, createProduct } from "../actions";

export default function ProductsClient({ initialProducts, companies = [] }: { initialProducts: any[], companies?: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredProducts = products.filter(p => 
    p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.nameAr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDropdownCompanies = companies.filter(c => 
    c.nameAr.toLowerCase().includes(companySearchQuery.toLowerCase()) || 
    c.nameEn.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  const handleStatusChange = (id: string, status: 'APPROVED' | 'REJECTED') => {
    startTransition(async () => {
      try {
        await updateProductStatus(id, status);
        setProducts(products.map(p => p.id === id ? { ...p, status } : p));
        showToast(`تم ${status === 'APPROVED' ? 'قبول' : 'رفض'} المنتج بنجاح`, 'success');
      } catch (error) {
        showToast("حدث خطأ أثناء التحديث", 'error');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    
    startTransition(async () => {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        showToast("تم حذف المنتج بنجاح", 'success');
      } catch (error) {
        showToast("حدث خطأ أثناء الحذف", 'error');
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 4 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setEditingProduct((prev: any) => ({ ...prev, image: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.nameAr || !editingProduct.nameEn || !editingProduct.companyId) {
      showToast("يرجى إدخال اسم المنتج باللغتين واختيار الشركة", "error");
      return;
    }

    startTransition(async () => {
      try {
        const newProduct = await createProduct({
            nameAr: editingProduct.nameAr,
            nameEn: editingProduct.nameEn,
            descriptionAr: editingProduct.descriptionAr,
            descriptionEn: editingProduct.descriptionEn,
            price: editingProduct.price,
            image: editingProduct.image,
            stockStatus: editingProduct.stockStatus,
            salesType: editingProduct.salesType,
            companyId: editingProduct.companyId,
            isFeatured: editingProduct.isFeatured,
            order: editingProduct.order
        });
        setProducts([newProduct, ...products]);
        showToast("تم إضافة المنتج بنجاح", 'success');
        setEditingProduct(null);
      } catch (error) {
        showToast("حدث خطأ أثناء الإضافة", 'error');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4 justify-between w-full md:w-auto">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <PackageSearch className="w-8 h-8 text-emerald-500" />
              إدارة المنتجات
            </h1>
            <p className="text-gray-400 mt-1">مراجعة المنتجات المضافة من قبل الشركات والتحكم بها</p>
          </div>
          <button 
            onClick={() => setEditingProduct({ id: '', nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '', price: 0, image: '', stockStatus: 'IN_STOCK', salesType: 'WHOLESALE', companyId: '', order: 0 })}
            className="md:hidden bg-emerald-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 shrink-0"
          >
            <Plus size={20} /> إضافة
          </button>
        </div>
        <button 
          onClick={() => setEditingProduct({ id: '', nameAr: '', nameEn: '', descriptionAr: '', descriptionEn: '', price: 0, image: '', stockStatus: 'IN_STOCK', salesType: 'WHOLESALE', companyId: '', order: 0 })}
          className="hidden md:flex bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold items-center gap-2 hover:bg-emerald-400 transition-colors shrink-0"
        >
          <Plus size={20} /> إضافة منتج جديد
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="ابحث باسم المنتج أو الشركة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pr-11 pl-4 focus:border-emerald-500 text-white"
          />
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-400">المنتج</th>
                <th className="px-6 py-4 font-bold text-gray-400">الشركة</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-center">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-400">تاريخ الإضافة</th>
                <th className="px-6 py-4 font-bold text-gray-400 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-white/10">
                          <Image src={product.image} alt={product.nameAr} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          {product.nameAr[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {product.nameAr}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {product.nameEn} • الترتيب: {product.order || 0}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{product.company.nameAr}</div>
                    <div className="text-xs text-gray-400">{product.company.nameEn}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.status === 'APPROVED' && <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">مقبول</span>}
                    {product.status === 'PENDING' && <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold">معلق</span>}
                    {product.status === 'REJECTED' && <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">مرفوض</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      {product.status !== 'APPROVED' && (
                        <button onClick={() => handleStatusChange(product.id, 'APPROVED')} disabled={isPending} title="موافقة وظهور" className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {product.status !== 'REJECTED' && (
                        <button onClick={() => handleStatusChange(product.id, 'REJECTED')} disabled={isPending} title="رفض وإخفاء" className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                          <XCircle size={18} />
                        </button>
                      )}
                      <div className="w-px h-6 bg-white/10 mx-1"></div>
                      <Link 
                        href={`/ar/admin-dashboard/products/${product.id}`}
                        onClick={() => setNavigatingId(product.id)}
                        title="تعديل بيانات المنتج" 
                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors flex items-center justify-center w-[34px] h-[34px]"
                      >
                        {navigatingId === product.id ? <Loader2 size={18} className="animate-spin" /> : <Edit2 size={18} />}
                      </Link>
                      <button onClick={() => handleDelete(product.id)} disabled={isPending} title="حذف" className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    لا توجد منتجات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {editingProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">{'إضافة منتج جديد'}</h3>
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="md:col-span-2 relative">
                <label className="block text-sm text-gray-400 mb-1">الشركة المالكة للمنتج</label>
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
                      className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white"
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
                  <div className="flex items-center justify-between w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3">
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
                <label className="block text-sm text-gray-400 mb-1">الاسم بالعربية</label>
                <input type="text" value={editingProduct.nameAr || ''} onChange={e => setEditingProduct({...editingProduct, nameAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالإنجليزية</label>
                <input type="text" value={editingProduct.nameEn || ''} onChange={e => setEditingProduct({...editingProduct, nameEn: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">الوصف بالعربية</label>
                <textarea rows={3} value={editingProduct.descriptionAr || ''} onChange={e => setEditingProduct({...editingProduct, descriptionAr: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">الوصف بالإنجليزية</label>
                <textarea rows={3} value={editingProduct.descriptionEn || ''} onChange={e => setEditingProduct({...editingProduct, descriptionEn: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">السعر (اختياري)</label>
                <input type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">ترتيب الظهور (رقم 1 يظهر أولاً، والافتراضي 0 يظهر في النهاية)</label>
                <input type="number" value={editingProduct.order || 0} onChange={e => setEditingProduct({...editingProduct, order: parseInt(e.target.value) || 0})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" dir="ltr" />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">حالة التوفر</label>
                  <select value={editingProduct.stockStatus || 'IN_STOCK'} onChange={e => setEditingProduct({...editingProduct, stockStatus: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white">
                    <option value="IN_STOCK">متوفر</option>
                    <option value="OUT_OF_STOCK">غير متوفر</option>
                    <option value="ON_REQUEST">عند الطلب</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">نوع البيع</label>
                  <select value={editingProduct.salesType || 'WHOLESALE'} onChange={e => setEditingProduct({...editingProduct, salesType: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white">
                    <option value="WHOLESALE">جملة</option>
                    <option value="RETAIL">قطاعي</option>
                    <option value="BOTH">جملة وقطاعي</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">صورة المنتج</label>
                <div className="flex items-center gap-4">
                  {editingProduct.image ? (
                    <img src={editingProduct.image} alt="Product" className="w-20 h-20 rounded-xl object-cover bg-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-gray-500">لا يوجد</div>
                  )}
                  <label className="flex-1 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 cursor-pointer transition-colors group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 mb-1 transition-colors" />
                    <span className="text-xs text-gray-400">تغيير الصورة</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-3 mt-6">
                <button type="submit" disabled={isPending} className="flex-1 bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 flex items-center justify-center disabled:opacity-50">
                  {isPending ? <Loader2 className="animate-spin" /> : 'حفظ التعديلات'}
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
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
