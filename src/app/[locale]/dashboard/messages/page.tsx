"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare, Trash2, Reply, Star, Info, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function MessagesPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.messages");
  const [activeMessage, setActiveMessage] = useState<string | number | null>(1);
  const [dbMessages, setDbMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setDbMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const isAr = locale === 'ar';

  const systemMessage = { 
    id: 1, 
    sender: t("adminName"), 
    company: t("adminCompany"), 
    email: "support@perfumeex.com",
    phone: "-",
    subject: t("welcomeSubject"), 
    body: t("welcomeBody"), 
    time: t("justNow"), 
    unread: true,
    starred: true,
    isSystem: true
  };

  const formattedDbMessages = dbMessages.map(msg => ({
    id: msg.id,
    sender: isAr ? msg.sender.nameAr : msg.sender.nameEn,
    company: isAr ? msg.sender.nameAr : msg.sender.nameEn,
    email: msg.sender.email || "-",
    phone: msg.sender.whatsapp || "-",
    subject: isAr ? "رسالة جديدة عبر بورصة العطور" : "New Message via PerfumeEx",
    body: msg.content,
    time: new Date(msg.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' }),
    unread: !msg.isRead,
    starred: false,
    isSystem: false
  }));

  const messages = [systemMessage, ...formattedDbMessages];

  const activeMsgData = messages.find(m => m.id === activeMessage);

  const handleMessageClick = async (msg: any) => {
    setActiveMessage(msg.id);
    if (msg.unread && !msg.isSystem) {
      // Optimistic UI update
      setDbMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
      try {
        await fetch('/api/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId: msg.id })
        });
        window.dispatchEvent(new Event('messagesUpdated'));
      } catch (err) {
        console.error("Failed to mark message as read", err);
      }
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    // Simulate sending reply
    setTimeout(() => {
      setIsReplying(false);
      setReplyText("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] max-w-7xl mx-auto flex flex-col pb-20 md:pb-0 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isAr ? "تم إرسال الرد بنجاح" : "Reply sent successfully"}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex-1 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
        
        {/* Messages List (Sidebar) */}
        <div className="w-full md:w-2/5 lg:w-1/3 border-b md:border-b-0 md:ltr:border-r md:rtl:border-l border-white/5 flex flex-col bg-zinc-950/50">
          
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute top-3 ltr:left-3 rtl:right-3" />
              <input 
                type="text" 
                placeholder={t("search")} 
                className="w-full bg-zinc-900 border border-white/10 rounded-lg ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-colors" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleMessageClick(msg)}
                className={`w-full ltr:text-left rtl:text-right p-4 border-b border-white/5 transition-colors relative flex gap-3
                  ${activeMessage === msg.id ? "bg-emerald-500/5" : "hover:bg-white/5"}
                `}
              >
                {msg.unread && (
                  <div className="absolute top-1/2 -translate-y-1/2 ltr:left-1.5 rtl:right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${msg.isSystem ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {msg.isSystem ? 'P' : msg.sender.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm truncate ${msg.unread ? "text-white font-bold" : "text-zinc-300 font-medium"}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-zinc-500 shrink-0">{msg.time}</span>
                  </div>
                  <div className={`text-xs truncate mb-1 ${msg.unread ? "text-zinc-300 font-medium" : "text-zinc-500"}`}>
                    {msg.subject}
                  </div>
                  <div className="text-[11px] text-zinc-600 truncate">
                    {msg.body.substring(0, 50)}...
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Content Area */}
        <div className="flex-1 flex flex-col bg-zinc-950">
          {activeMsgData ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{activeMsgData.subject}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-zinc-300">{activeMsgData.sender}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-emerald-500">{activeMsgData.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                    <Star className={`w-5 h-5 ${activeMsgData.starred ? "fill-emerald-400 text-emerald-400" : ""}`} />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Message Details / Body (Chat Style) */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                
                {/* Contact Info Card */}
                <div className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row gap-6 justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 mb-1">{t("email")}</span>
                      {activeMsgData.email !== "-" ? (
                        <a href={`mailto:${activeMsgData.email}`} className="text-white hover:text-emerald-400 font-bold">{activeMsgData.email}</a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 mb-1">{t("phone")}</span>
                      {activeMsgData.phone !== "-" ? (
                        <a href={`tel:${activeMsgData.phone}`} className="text-white hover:text-emerald-400 font-bold dir-ltr inline-block">{activeMsgData.phone}</a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chat Bubble */}
                <div className="flex flex-col gap-2 w-full max-w-3xl ltr:self-start rtl:self-start">
                   <div className="flex items-end gap-2">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${activeMsgData.isSystem ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                       {activeMsgData.isSystem ? 'P' : activeMsgData.sender.charAt(0)}
                     </div>
                     <div className="bg-zinc-800/80 text-zinc-200 p-4 rounded-2xl ltr:rounded-bl-none rtl:rounded-br-none border border-white/5 whitespace-pre-wrap leading-relaxed shadow-lg">
                       {activeMsgData.body}
                     </div>
                   </div>
                   <div className="text-xs text-zinc-500 ltr:ml-10 rtl:mr-10">
                     {activeMsgData.time}
                   </div>
                </div>

              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-white/5 bg-zinc-950/80">
                {activeMsgData.isSystem ? (
                  <div className="flex items-center justify-center gap-2 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 text-sm font-medium">
                    <Info className="w-4 h-4" /> {t("systemMessageWarning")}
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                    <textarea 
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t("replyPlaceholder")}
                      className="w-full bg-transparent p-4 text-white outline-none resize-none"
                    />
                    <div className="bg-zinc-950/50 px-4 py-3 flex justify-between items-center border-t border-white/5">
                      <button className="text-sm font-bold text-zinc-400 hover:text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> {t("replyWhatsapp")}
                      </button>
                      <button 
                        onClick={handleReply}
                        disabled={isReplying || !replyText.trim()}
                        className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />} 
                        {isReplying ? (isAr ? "جاري الإرسال..." : "Sending...") : t("sendEmail")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p>{t("selectToRead")}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
