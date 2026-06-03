'use client';

import { useState, useTransition } from 'react';
import { Sponsor } from '@prisma/client';
import { addSponsor, updateSponsor, deleteSponsor, toggleSponsorStatus, updateSponsorsOrder } from '../actions';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Loader2, Image as ImageIcon } from 'lucide-react';

export default function SponsorsClient({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  // Form state
  const [formData, setFormData] = useState({ nameAr: '', nameEn: '', logo: '' });

  const handleOpenModal = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setFormData({ nameAr: sponsor.nameAr, nameEn: sponsor.nameEn, logo: sponsor.logo });
    } else {
      setEditingSponsor(null);
      setFormData({ nameAr: '', nameEn: '', logo: '' });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setFormData(prev => ({ ...prev, logo: base64Str }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.nameAr || !formData.nameEn || !formData.logo) return alert('الرجاء إدخال جميع الحقول المطلوبة والصورة');

    startTransition(async () => {
      if (editingSponsor) {
        await updateSponsor(editingSponsor.id, formData);
        setSponsors(sponsors.map(s => s.id === editingSponsor.id ? { ...s, ...formData } : s));
      } else {
        await addSponsor(formData);
        window.location.reload();
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الراعي؟')) return;
    startTransition(async () => {
      await deleteSponsor(id);
      setSponsors(sponsors.filter(s => s.id !== id));
    });
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleSponsorStatus(id, !currentStatus);
      setSponsors(sponsors.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    });
  };

  const moveSponsor = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sponsors.length - 1)) return;

    const newSponsors = [...sponsors];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newSponsors[index];
    newSponsors[index] = newSponsors[targetIndex];
    newSponsors[targetIndex] = temp;

    // Update order property
    const updatedSponsors = newSponsors.map((s, i) => ({ ...s, order: i }));
    setSponsors(updatedSponsors);

    startTransition(async () => {
      await updateSponsorsOrder(updatedSponsors.map(s => ({ id: s.id, order: s.order })));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#111] p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold mb-1">إدارة الرعاة</h2>
          <p className="text-gray-400 text-sm">أضف، عدل، أو رتب لوجوهات الشركات الراعية التي تظهر في الصفحة الرئيسية</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-4 py-2 rounded-xl text-white font-medium transition-all"
        >
          <Plus size={20} />
          إضافة راعي
        </button>
      </div>

      <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
        {sponsors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">لا يوجد رعاة مضافين بعد.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {sponsors.map((sponsor, index) => (
              <div key={sponsor.id} className={`flex items-center justify-between p-4 transition-colors ${!sponsor.isActive ? 'opacity-50 grayscale' : 'hover:bg-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveSponsor(index, 'up')} 
                      disabled={index === 0 || isPending}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button 
                      onClick={() => moveSponsor(index, 'down')} 
                      disabled={index === sponsors.length - 1 || isPending}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  
                  <div className="w-24 h-16 rounded-xl bg-white/10 overflow-hidden flex items-center justify-center p-2">
                    <img src={sponsor.logo} alt={sponsor.nameAr} className="w-full h-full object-contain" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{sponsor.nameAr}</h3>
                    <p className="text-sm text-gray-400">{sponsor.nameEn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-400">{sponsor.isActive ? 'مفعل' : 'معطل'}</span>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={sponsor.isActive}
                        onChange={() => toggleStatus(sponsor.id, sponsor.isActive)}
                        disabled={isPending}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${sponsor.isActive ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${sponsor.isActive ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </label>

                  <div className="flex items-center gap-2 border-r border-white/10 pr-4 ml-2">
                    <button 
                      onClick={() => handleOpenModal(sponsor)}
                      disabled={isPending}
                      className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(sponsor.id)}
                      disabled={isPending}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">
              {editingSponsor ? 'تعديل الراعي' : 'إضافة راعي جديد'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالعربية</label>
                <input 
                  type="text" 
                  value={formData.nameAr}
                  onChange={e => setFormData({...formData, nameAr: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">الاسم بالإنجليزية</label>
                <input 
                  type="text" 
                  value={formData.nameEn}
                  onChange={e => setFormData({...formData, nameEn: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-emerald-500 text-white"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">اللوجو (Logo)</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain bg-white/10 rounded-lg p-2" />
                  ) : (
                    <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center text-gray-500">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-xl p-4 text-center transition-colors">
                    <span className="text-sm text-emerald-400 font-medium">اختر صورة (أقل من 2MB)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-2 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
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
