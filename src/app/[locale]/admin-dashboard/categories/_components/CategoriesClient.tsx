'use client';

import { useState, useTransition } from 'react';
import { Category } from '@prisma/client';
import { addCategory, updateCategory, deleteCategory, updateCategoriesOrder } from '../actions';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({ nameAr: '', nameEn: '', slug: '', image: '' });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ nameAr: category.nameAr, nameEn: category.nameEn, slug: category.slug, image: category.image || '' });
    } else {
      setEditingCategory(null);
      setFormData({ nameAr: '', nameEn: '', slug: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.nameAr || !formData.nameEn || !formData.slug) return alert('الرجاء إدخال جميع الحقول المطلوبة');

    startTransition(async () => {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      } else {
        await addCategory(formData);
        // Let Server component re-fetch by doing a full reload or we can just rely on revalidatePath
        // Actually revalidatePath works on next navigation or full reload. We can just refresh the page.
        window.location.reload();
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    startTransition(async () => {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    });
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) return;

    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    // Update order property based on array position
    const updatedCategories = newCategories.map((c, i) => ({ ...c, order: i }));
    setCategories(updatedCategories);

    // Save to DB
    startTransition(async () => {
      await updateCategoriesOrder(updatedCategories.map(c => ({ id: c.id, order: c.order })));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#111] p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold mb-1">إدارة الأقسام</h2>
          <p className="text-gray-400 text-sm">أضف، عدل، أو رتب الأقسام التي تظهر في الموقع</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-xl text-white font-medium transition-all"
        >
          <Plus size={20} />
          إضافة قسم
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">لا توجد أقسام مضافة بعد.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveCategory(index, 'up')} 
                      disabled={index === 0 || isPending}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveCategory(index, 'down')} 
                      disabled={index === categories.length - 1 || isPending}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  
                  {category.image && (
                    <div className="w-12 h-12 rounded-xl bg-white/10 overflow-hidden flex items-center justify-center">
                      <img src={category.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-lg">{category.nameAr}</h3>
                    <p className="text-sm text-gray-400">{category.nameEn} - {category.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(category)}
                    disabled={isPending}
                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    disabled={isPending}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-6">
              {editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالعربية</label>
                <input 
                  type="text" 
                  value={formData.nameAr}
                  onChange={e => setFormData({...formData, nameAr: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالإنجليزية</label>
                <input 
                  type="text" 
                  value={formData.nameEn}
                  onChange={e => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">الرابط اللطيف (Slug - إنجليزي فقط)</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">رابط الصورة (اختياري)</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 text-white"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              >
                {isPending ? <Loader2 className="animate-spin" size={20} /> : 'حفظ'}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
