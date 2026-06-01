"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, UploadCloud, Building2, MapPin, Globe, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function CompanySettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [logoPreview, setLogoPreview] = useState("https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=200&h=200");
  const [coverPreview, setCoverPreview] = useState("https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1920&h=600");

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Company Profile</h1>
          <p className="text-zinc-400">Manage your brand's public presence on PerfumeEx.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors border border-white/5">
            Save Draft
          </button>
          <button className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Save className="w-4 h-4" /> Publish Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 sticky top-28 space-y-2">
            {[
              { id: 'general', name: 'General Info', icon: <Building2 className="w-4 h-4" /> },
              { id: 'media', name: 'Brand Media', icon: <UploadCloud className="w-4 h-4" /> },
              { id: 'contact', name: 'Contact & Links', icon: <Phone className="w-4 h-4" /> },
              { id: 'about', name: 'About Company', icon: <FileText className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  activeSection === tab.id 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* GENERAL INFO SECTION */}
          {activeSection === "general" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">General Information</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Company Name (English)</label>
                      <input type="text" defaultValue="Luxe Fragrance Co." className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Company Name (Arabic)</label>
                      <input type="text" defaultValue="شركة لوكس للعطور" dir="rtl" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors font-cairo" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Main Category</label>
                    <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors appearance-none">
                      <option>Ready Perfumes</option>
                      <option>Clone Perfumes</option>
                      <option>Bakhoor</option>
                      <option>Air Fresheners</option>
                      <option>Packaging</option>
                      <option>Glass Bottles</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">Country</label>
                      <input type="text" defaultValue="United Arab Emirates" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                      <input type="text" defaultValue="Dubai" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BRAND MEDIA SECTION */}
          {activeSection === "media" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">Brand Media</h2>
                
                {/* Logo Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-zinc-400 mb-4">Company Logo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative shadow-xl">
                      <Image src={logoPreview} alt="Logo Preview" fill className="object-cover" />
                    </div>
                    <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                      <UploadCloud className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors mb-2" />
                      <p className="text-sm text-zinc-300 font-medium">Click to upload logo</p>
                      <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG (max 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Cover Upload */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-4">Cover Banner</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-2 relative group cursor-pointer hover:border-emerald-500/50 transition-colors bg-zinc-900/50">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                      <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 text-white font-bold text-sm border border-white/10">
                        <UploadCloud className="w-5 h-5" /> Replace Cover
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* CONTACT SECTION */}
          {activeSection === "contact" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">Contact & Social Links</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input type="text" defaultValue="+971 50 123 4567" className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors dir-ltr text-left" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input type="email" defaultValue="contact@luxefragrance.com" className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Website</label>
                    <div className="relative">
                      <Globe className="w-5 h-5 text-emerald-500 absolute top-3.5 ltr:left-4 rtl:right-4" />
                      <input type="url" defaultValue="https://luxefragrance.com" className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors dir-ltr text-left" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABOUT SECTION */}
          {activeSection === "about" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-zinc-950 border border-white/5 p-8 rounded-3xl">
                <h2 className="text-xl font-bold text-white mb-6">About Company</h2>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Company Story / Description</label>
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                    {/* Fake rich text toolbar */}
                    <div className="border-b border-white/5 px-4 py-2 flex items-center gap-3 bg-zinc-950/50">
                      <button className="text-zinc-400 hover:text-white font-bold">B</button>
                      <button className="text-zinc-400 hover:text-white italic font-serif">I</button>
                      <button className="text-zinc-400 hover:text-white underline">U</button>
                      <div className="w-px h-4 bg-white/10 mx-1" />
                      <button className="text-zinc-400 hover:text-white text-xs font-bold">H1</button>
                      <button className="text-zinc-400 hover:text-white text-xs font-bold">H2</button>
                    </div>
                    <textarea 
                      rows={8}
                      defaultValue="Luxe Fragrance Co. is a premier perfume manufacturer based in Dubai, specializing in the creation of authentic oriental and modern French perfumes. With over 20 years of experience, we provide end-to-end fragrance development, from scent creation to final packaging."
                      className="w-full bg-transparent p-4 text-white outline-none resize-y leading-relaxed font-light"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
