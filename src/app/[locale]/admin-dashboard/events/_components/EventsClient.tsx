'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@prisma/client';
import { createEvent, updateEvent, deleteEvent } from '../actions';
import { Calendar, MapPin, Plus, Edit, Trash2, Users, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface EventsClientProps {
  initialEvents: (Event & { _count: { registrations: number } })[];
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    slug: '',
    image: '',
    date: '',
    locationAr: '',
    locationEn: ''
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (event?: Event & { slug?: string }) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        titleAr: event.titleAr,
        titleEn: event.titleEn,
        slug: event.slug || '',
        image: event.image,
        date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
        locationAr: event.locationAr,
        locationEn: event.locationEn
      });
    } else {
      setEditingEvent(null);
      setFormData({
        titleAr: '',
        titleEn: '',
        slug: '',
        image: '',
        date: '',
        locationAr: '',
        locationEn: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr || !formData.titleEn || !formData.image || !formData.date || !formData.locationAr || !formData.locationEn) {
      showToast('يرجى تعبئة جميع الحقول وإرفاق صورة', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const dateObj = new Date(formData.date);
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          ...formData,
          date: dateObj
        });
        showToast('تم تحديث الفعالية بنجاح');
      } else {
        await createEvent({
          ...formData,
          date: dateObj
        });
        showToast('تمت إضافة الفعالية بنجاح');
      }
      setIsModalOpen(false);
      router.refresh();
      // Optimistic update omitted for simplicity, relying on router.refresh
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast('حدث خطأ غير متوقع', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفعالية نهائياً؟')) return;
    
    try {
      setEvents(events.filter(e => e.id !== id));
      await deleteEvent(id);
      showToast('تم حذف الفعالية بنجاح', 'success');
      router.refresh();
    } catch (error) {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-2 rounded-lg ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            <span className="font-bold text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
          </div>
          <p className="font-medium text-white">{toast.message}</p>
        </div>
      )}
      
      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>إضافة فعالية جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors">
            <div className="relative h-48 w-full">
              <Image 
                src={event.image} 
                alt={event.titleAr} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">{event.titleAr}</h3>
              <p className="text-gray-400 text-sm mb-4">{event.titleEn}</p>
              
              <div className="space-y-2 mb-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" />
                  <span>{new Date(event.date).toLocaleString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-500" />
                  <span>{event.locationAr}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-blue-400 font-medium">{event._count.registrations} مسجلين</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/${locale}/admin-dashboard/events/${event.id}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition-colors"
                >
                  عرض المسجلين
                </Link>
                <button 
                  onClick={() => handleOpenModal(event as any)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-gray-300"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">لا توجد فعاليات مضافة حالياً</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <h2 className="text-xl font-bold">
                {editingEvent ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">صورة الفعالية</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                  >
                    {formData.image ? (
                      <div className="relative w-full h-40">
                        <Image src={formData.image} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-gray-400">اضغط لرفع صورة الفعالية (يُفضل بالعرض)</span>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">العنوان بالعربية</label>
                    <input
                      type="text"
                      required
                      value={formData.titleAr}
                      onChange={e => setFormData({...formData, titleAr: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">العنوان بالإنجليزية</label>
                    <input
                      type="text"
                      required
                      value={formData.titleEn}
                      onChange={e => setFormData({...formData, titleEn: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">الرابط المخصص (Slug - إنجليزي بدون مسافات)</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    placeholder="مثال: alexandria-bride-event"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">التاريخ والوقت</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">المكان بالعربية</label>
                    <input
                      type="text"
                      required
                      value={formData.locationAr}
                      onChange={e => setFormData({...formData, locationAr: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">المكان بالإنجليزية</label>
                    <input
                      type="text"
                      required
                      value={formData.locationEn}
                      onChange={e => setFormData({...formData, locationEn: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-[#111] flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
              >
                إلغاء
              </button>
              <button 
                form="event-form"
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
