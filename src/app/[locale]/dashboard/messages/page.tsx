"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Trash2, Reply, Star, Info, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function MessagesPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard.messages");
  const { data: session } = useSession();
  const [activeMessage, setActiveMessage] = useState<string | number | null>(1);
  const [dbMessages, setDbMessages] = useState<any[]>([]);
  const [myCompanyId, setMyCompanyId] = useState<string | null>(null);
  const [systemMessageRead, setSystemMessageRead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessage, dbMessages]);

  useEffect(() => {
    if (session?.user?.id) {
      const isRead = localStorage.getItem(`systemMessageRead_${session.user.id}`) === 'true';
      setSystemMessageRead(isRead);
    }
    
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          setDbMessages(data.messages || []);
          if (data.companyId) setMyCompanyId(data.companyId);
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [session]);

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
    unread: !systemMessageRead,
    starred: true,
    isSystem: true
  };

  const formattedDbMessages = dbMessages.map(msg => {
    const isSentByMe = msg.senderId === myCompanyId;
    // If I sent it, the "other" party is the receiver. If I received it, the "other" party is the sender.
    const otherParty = isSentByMe ? msg.receiver : msg.sender;
    const otherName = otherParty ? (isAr ? otherParty.nameAr : otherParty.nameEn) : t("adminName");
    
    return {
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      isSentByMe,
      otherPartyId: isSentByMe ? msg.receiverId : msg.senderId,
      sender: isSentByMe ? (isAr ? "أنت" : "You") : otherName,
      company: otherName,
      email: otherParty?.email || "-",
      phone: otherParty?.whatsapp || "-",
      subject: isSentByMe ? (isAr ? "رسالة صادرة" : "Sent Message") : (isAr ? "رسالة جديدة عبر بورصة العطور" : "New Message via PerfumeEx"),
      body: msg.content,
      rawTime: new Date(msg.createdAt),
      time: new Date(msg.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      unread: !isSentByMe && !msg.isRead,
      starred: false,
      isSystem: false
    };
  });

  // Group into conversations
  const conversationsMap = new Map();
  formattedDbMessages.forEach(msg => {
    if (!msg.otherPartyId) return;
    if (!conversationsMap.has(msg.otherPartyId)) {
      conversationsMap.set(msg.otherPartyId, []);
    }
    conversationsMap.get(msg.otherPartyId).push(msg);
  });

  const conversationPreviews = Array.from(conversationsMap.values()).map(convo => {
    // Sort descending by time to get the latest message for preview
    convo.sort((a: any, b: any) => b.rawTime.getTime() - a.rawTime.getTime());
    return convo[0];
  });

  // Sidebar list
  const sidebarMessages = [systemMessage, ...conversationPreviews];

  const activeConversation = activeMessage === 1 
    ? [systemMessage] 
    : (conversationsMap.get(activeMessage) || []).sort((a: any, b: any) => a.rawTime.getTime() - b.rawTime.getTime()); // Chronological for chat view

  const activeMsgData = activeConversation.length > 0 ? activeConversation[activeConversation.length - 1] : null;

  const handleMessageClick = async (msg: any) => {
    setActiveMessage(msg.isSystem ? 1 : msg.otherPartyId);
    setShowListOnMobile(false);
    
    if (msg.isSystem && !systemMessageRead) {
      setSystemMessageRead(true);
      if (session?.user?.id) {
        localStorage.setItem(`systemMessageRead_${session.user.id}`, 'true');
        window.dispatchEvent(new Event('messagesUpdated'));
      }
    } else if (!msg.isSystem) {
      // Mark ALL unread messages from this conversation as read
      const unreadIds = conversationsMap.get(msg.otherPartyId)
        ?.filter((m: any) => m.unread)
        .map((m: any) => m.id) || [];

      if (unreadIds.length > 0) {
        // Optimistic UI update
        setDbMessages(prev => prev.map(m => unreadIds.includes(m.id) ? { ...m, isRead: true } : m));
        
        try {
          await Promise.all(unreadIds.map((id: string) => 
            fetch('/api/messages', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: id })
            })
          ));
          window.dispatchEvent(new Event('messagesUpdated'));
        } catch (err) {
          console.error("Failed to mark messages as read", err);
        }
      }
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeMsgData || activeMsgData.isSystem) return;
    setIsReplying(true);
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          receiverId: activeMsgData.otherPartyId, 
          content: replyText 
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        // Optimistically add to state
        setDbMessages(prev => [newMessage, ...prev]);
        setReplyText("");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        console.error("Failed to send reply");
      }
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="h-[85vh] min-h-[600px] max-w-7xl mx-auto flex flex-col pb-20 md:pb-0 relative">
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
        <div className={`w-full md:w-2/5 lg:w-1/3 border-b md:border-b-0 md:ltr:border-r md:rtl:border-l border-white/5 flex flex-col bg-zinc-950/50 ${showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
          
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
            {sidebarMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleMessageClick(msg)}
                className={`w-full ltr:text-left rtl:text-right p-4 border-b border-white/5 transition-colors relative flex gap-3
                  ${(activeMessage === msg.id || activeMessage === msg.otherPartyId) ? "bg-emerald-500/5" : "hover:bg-white/5"}
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
        <div className={`flex-1 flex flex-col bg-zinc-950 ${!showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
          {activeMsgData ? (
            <>
              {/* Message Header */}
              <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowListOnMobile(true)} className="md:hidden p-2 -ml-2 rtl:-mr-2 rtl:ml-0 text-zinc-400 hover:text-white rounded-lg">
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{activeMsgData.subject}</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-zinc-300">{activeMsgData.sender}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-emerald-500">{activeMsgData.company}</span>
                    </div>
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

                {/* Chat Bubbles */}
                <div className="flex flex-col gap-6 w-full">
                  {activeConversation.map((msg, idx) => (
                    <div 
                      key={msg.id || idx} 
                      className={`flex flex-col gap-2 w-full max-w-2xl ${msg.isSentByMe ? 'ltr:self-end rtl:self-end items-end' : 'ltr:self-start rtl:self-start items-start'}`}
                    >
                      <div className={`flex items-end gap-2 ${msg.isSentByMe ? 'flex-row-reverse' : ''}`}>
                        {!msg.isSentByMe && (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${msg.isSystem ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                            {msg.isSystem ? 'P' : (msg.company ? msg.company.charAt(0) : 'A')}
                          </div>
                        )}
                        <div className={`p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg border ${
                          msg.isSentByMe 
                          ? 'bg-emerald-600 text-white ltr:rounded-br-none rtl:rounded-bl-none border-emerald-500' 
                          : 'bg-zinc-800/80 text-zinc-200 ltr:rounded-bl-none rtl:rounded-br-none border-white/5'
                        }`}>
                          {msg.body}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 mx-10">
                        {msg.time}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

              </div>

              {/* Reply Box */}
              {/* Reply Box (Compact Chat Style) */}
              <div className="p-4 border-t border-white/5 bg-zinc-900/80 backdrop-blur-xl shrink-0">
                {activeMsgData.isSystem ? (
                  <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-sm font-medium">
                    <Info className="w-4 h-4" /> {t("systemMessageWarning")}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-zinc-950 border border-white/10 rounded-full overflow-hidden focus-within:border-emerald-500 transition-colors flex items-center">
                        <input 
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t("replyPlaceholder")}
                          className="w-full bg-transparent px-6 py-3 text-sm text-white outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleReply();
                          }}
                        />
                      </div>
                      <button 
                        onClick={handleReply}
                        disabled={isReplying || !replyText.trim()}
                        className="w-12 h-12 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                      >
                        {isReplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Reply className="w-5 h-5 rtl:rotate-180" />} 
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
