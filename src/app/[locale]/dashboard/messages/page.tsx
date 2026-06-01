"use client";

import { useState } from "react";
import { Search, MessageSquare, Trash2, Reply, Star, Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MessagesPage() {
  const t = useTranslations("Dashboard.messages");
  const [activeMessage, setActiveMessage] = useState<number | null>(1);

  // We are currently using a hardcoded system message since there are no user messages yet.
  const messages = [
    { 
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
    }
  ];

  const activeMsgData = messages.find(m => m.id === activeMessage);

  return (
    <div className="h-[calc(100vh-140px)] max-w-7xl mx-auto flex flex-col pb-20 md:pb-0">
      
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
                onClick={() => setActiveMessage(msg.id)}
                className={`w-full text-left p-4 border-b border-white/5 transition-colors relative flex gap-3
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

              {/* Message Details / Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-zinc-900/50 rounded-2xl p-6 mb-8 border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <span className="text-zinc-500 block mb-1">{t("email")}</span>
                      {activeMsgData.email !== "-" ? (
                        <a href={`mailto:${activeMsgData.email}`} className="text-white hover:text-emerald-400">{activeMsgData.email}</a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </div>
                    <div>
                      <span className="text-zinc-500 block mb-1">{t("phone")}</span>
                      {activeMsgData.phone !== "-" ? (
                        <a href={`tel:${activeMsgData.phone}`} className="text-white hover:text-emerald-400 dir-ltr inline-block">{activeMsgData.phone}</a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-px bg-white/5 mb-6" />
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {activeMsgData.body}
                    </div>
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
                      placeholder={t("replyPlaceholder")}
                      className="w-full bg-transparent p-4 text-white outline-none resize-none"
                    />
                    <div className="bg-zinc-950/50 px-4 py-3 flex justify-between items-center border-t border-white/5">
                      <button className="text-sm font-bold text-zinc-400 hover:text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> {t("replyWhatsapp")}
                      </button>
                      <button className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2">
                        <Reply className="w-4 h-4" /> {t("sendEmail")}
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
