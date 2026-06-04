'use client';

import { useState } from 'react';
import { sendGlobalNotification, deleteGlobalNotification } from '../actions';
import { useRouter } from 'next/navigation';
import { Send, Bell, Trash2, Loader2, Users } from 'lucide-react';

export default function NotificationsClient({ initialHistory }: { initialHistory: any[] }) {
  const [formData, setFormData] = useState({
    titleAr: '', titleEn: '', messageAr: '', messageEn: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('هل أنت متأكد من إرسال هذا الإشعار لجميع الشركات؟')) return;

    setIsLoading(true);
    try {
      const count = await sendGlobalNotification(formData);
      alert(`تم إرسال الإشعار بنجاح إلى ${count} شركة`);
      setFormData({ titleAr: '', titleEn: '', messageAr: '', messageEn: '' });
      router.refresh();
    } catch (e) {
      alert('حدث خطأ أثناء الإرسال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (titleAr: string, messageAr: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإشعار من حسابات جميع الشركات؟')) {
      try {
        await deleteGlobalNotification(titleAr, messageAr);
        router.refresh();
      } catch (e) {
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Send Notification Form */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 bg-[#1a1a1a]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Send className="text-emerald-500" size={20} />
            إرسال إشعار جديد
          </h2>
        </div>
        
        <form onSubmit={handleSend} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">عنوان الإشعار (بالعربي)</label>
              <input 
                type="text" required
                value={formData.titleAr}
                onChange={e => setFormData({...formData, titleAr: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
                placeholder="مثال: تحديث جديد في المنصة"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">عنوان الإشعار (بالإنجليزي)</label>
              <input 
                type="text" required dir="ltr"
                value={formData.titleEn}
                onChange={e => setFormData({...formData, titleEn: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors"
                placeholder="e.g. New Platform Update"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">نص الإشعار (بالعربي)</label>
            <textarea 
              required rows={4}
              value={formData.messageAr}
              onChange={e => setFormData({...formData, messageAr: e.target.value})}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors resize-none"
              placeholder="اكتب تفاصيل الإشعار هنا..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">نص الإشعار (بالإنجليزي)</label>
            <textarea 
              required rows={4} dir="ltr"
              value={formData.messageEn}
              onChange={e => setFormData({...formData, messageEn: e.target.value})}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none transition-colors resize-none"
              placeholder="Write notification details here..."
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            إرسال لجميع الشركات
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full max-h-[800px]">
        <div className="p-6 border-b border-white/10 bg-[#1a1a1a]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="text-blue-500" size={20} />
            سجل الإشعارات المرسلة
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {initialHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p>لم تقم بإرسال أي إشعارات بعد</p>
            </div>
          ) : (
            initialHistory.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-emerald-400">{item.titleAr}</h3>
                    <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.titleAr, item.messageAr)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors shrink-0"
                    title="حذف من الجميع"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed bg-[#111] p-3 rounded-lg border border-white/5 mb-3">
                  {item.messageAr}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg w-fit">
                  <Users size={14} />
                  تم الإرسال إلى {item._count.id} شركة
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
