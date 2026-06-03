'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { markTicketAsRead, deleteTicket } from '../actions';
import { Check, Trash2, Mail, Phone, Building2, User, Clock } from 'lucide-react';

export default function SupportClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    await markTicketAsRead(id);
    setTickets(tickets.map(t => t.id === id ? { ...t, isRead: true } : t));
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      await deleteTicket(id);
      setTickets(tickets.filter(t => t.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {tickets.length === 0 ? (
        <div className="bg-[#111] border border-white/5 p-12 rounded-3xl text-center">
          <Mail className="mx-auto text-gray-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-400">لا توجد رسائل دعم فني حالياً</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={`bg-[#111] border p-6 rounded-2xl transition-all ${ticket.isRead ? 'border-white/5 opacity-70' : 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!ticket.isRead && <span className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse" />}
                    <h3 className="text-xl font-bold">{ticket.name}</h3>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(ticket.createdAt).toLocaleString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-300 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-emerald-400" />
                      {ticket.brandName}
                    </div>
                    <div className="w-px h-5 bg-white/10 hidden md:block" />
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-emerald-400" />
                      <a href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="hover:text-emerald-400" dir="ltr">
                        {ticket.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 text-gray-200 leading-relaxed whitespace-pre-wrap bg-[#050505] p-4 rounded-xl border border-white/5">
                    {ticket.message}
                  </div>
                </div>

                <div className="flex md:flex-col gap-3 justify-end md:justify-start">
                  {!ticket.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(ticket.id)}
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 p-3 rounded-xl flex items-center gap-2 transition-colors"
                      title="تحديد كمقروء"
                    >
                      <Check size={20} />
                      <span className="md:hidden">تحديد كمقروء</span>
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-3 rounded-xl flex items-center gap-2 transition-colors"
                    title="حذف الرسالة"
                  >
                    <Trash2 size={20} />
                    <span className="md:hidden">حذف</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
