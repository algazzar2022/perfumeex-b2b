"use client";

import { useState, useTransition } from "react";
import { PackageSearch, Search, Filter, CheckCircle, XCircle, Trash2, Edit2, Loader2, Star } from "lucide-react";
import { updateProductStatus, deleteProduct, updateProduct } from "../actions";
import Image from "next/image";

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    startTransition(async () => {
      try {
        await updateProduct(editingProduct.id, {
          isFeatured: editingProduct.isFeatured,
          order: editingProduct.order
        });
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
        showToast("تم تحديث المنتج بنجاح", 'success');
      } catch (error) {
        showToast("حدث خطأ أثناء التحديث", 'error');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <PackageSearch className="w-8 h-8 text-emerald-500" />
            إدارة المنتجات
          </h1>
          <p className="text-gray-400 mt-1">مراجعة المنتجات المضافة من قبل الشركات والتحكم بها</p>
        </div>
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
                      <button onClick={() => setEditingProduct(product)} title="تعديل الترتيب والتميز" className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">إعدادات المنتج: {editingProduct.nameAr}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">ترتيب الظهور (رقم 1 يظهر أولاً، والافتراضي 0 يظهر في النهاية)</label>
                <input 
                  type="number" 
                  value={editingProduct.order || 0} 
                  onChange={e => setEditingProduct({...editingProduct, order: parseInt(e.target.value) || 0})} 
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:border-emerald-500 text-white" 
                  dir="ltr" 
                />
              </div>

              <div>
              </div>

              <div className="flex items-center gap-3 mt-8">
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
