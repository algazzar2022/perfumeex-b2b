'use client';

import { useState } from 'react';
import { markNotificationAsRead } from '../actions';
import { useRouter } from 'next/navigation';
import { Bell, Check, Clock } from 'lucide-react';

export default function CompanyNotificationsClient({ initialNotifications, locale }: { initialNotifications: any[], locale: string }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();
  const isAr = locale === 'ar';

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      router.refresh();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 opacity-30" />
            <p>{isAr ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-6 rounded-xl border transition-all ${
                notification.isRead 
                  ? 'bg-[#1a1a1a] border-white/5 opacity-70' 
                  : 'bg-[#151515] border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg shrink-0 ${notification.isRead ? 'bg-white/5 text-gray-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">
                      {isAr ? notification.titleAr : notification.titleEn}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-white/5">
                      {isAr ? notification.messageAr : notification.messageEn}
                    </p>
                  </div>
                </div>
                
                {!notification.isRead && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors shrink-0 flex items-center gap-2 text-sm font-medium"
                    title={isAr ? 'تحديد كمقروء' : 'Mark as read'}
                  >
                    <Check size={16} />
                    <span className="hidden sm:block">{isAr ? 'مقروء' : 'Read'}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
