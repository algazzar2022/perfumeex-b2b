"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Trash2, Loader2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function DashboardGallery() {
  const t = useTranslations("Dashboard.gallery");
  const locale = useParams().locale as string;

  const [media, setMedia] = useState<any[]>([]);
  const [catalogPdf, setCatalogPdf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchGallery();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/company/profile");
      if (res.ok) {
        const data = await res.json();
        setCatalogPdf(data.catalogPdf);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/company/gallery");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = event.target?.result as string;
      
      try {
        const res = await fetch("/api/company/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: base64Str })
        });
        
        if (res.ok) {
          await fetchGallery();
          setToastMessage(t("uploadSuccess"));
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      alert(locale === 'ar' ? "حجم الملف يجب أن لا يتجاوز 200 ميجابايت" : "File must be smaller than 200MB");
      return;
    }

    if (file.type !== "application/pdf") {
      alert(locale === 'ar' ? "يجب أن يكون الملف بصيغة PDF" : "File must be a PDF");
      return;
    }

    setIsUploadingPdf(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Str = event.target?.result as string;
      
      try {
        const res = await fetch("/api/company/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ catalogPdf: base64Str })
        });
        
        if (res.ok) {
          await fetchProfile();
          setToastMessage(locale === 'ar' ? 'تم رفع الكتالوج بنجاح' : 'Catalog uploaded successfully');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        } else {
          alert(locale === 'ar' ? 'حدث خطأ. قد يكون حجم الملف كبيراً جداً على الخادم.' : 'Error. The file might be too large for the server.');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploadingPdf(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/company/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchGallery();
        setToastMessage(t("deleteSuccess"));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog PDF Section */}
      <div className="bg-zinc-950/50 border border-white/10 rounded-3xl p-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {locale === 'ar' ? 'كتالوج / قائمة الأسعار (PDF)' : 'Catalog / Price List (PDF)'}
            </h2>
            <p className="text-zinc-400">
              {locale === 'ar' 
                ? 'ارفع ملف PDF يحتوي على كتالوج منتجاتك أو قائمة الأسعار الخاصة بالشركة. (الحد الأقصى 200 ميجابايت)'
                : 'Upload a PDF file containing your product catalog or price list. (Max 200MB)'}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {catalogPdf ? (
              <>
                <a 
                  href={catalogPdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  {locale === 'ar' ? 'عرض الكتالوج' : 'View Catalog'}
                </a>
                <button 
                  onClick={async () => {
                    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف الكتالوج؟' : 'Are you sure you want to delete the catalog?')) return;
                    try {
                      await fetch("/api/company/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ catalogPdf: null })
                      });
                      setCatalogPdf(null);
                      setToastMessage(locale === 'ar' ? 'تم حذف الكتالوج' : 'Catalog deleted');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    } catch(e) {}
                  }}
                  className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <label className={`px-6 py-2.5 ${isUploadingPdf ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'} font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]`}>
                {isUploadingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} 
                {isUploadingPdf ? (locale === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (locale === 'ar' ? 'رفع الكتالوج' : 'Upload Catalog')}
                <input type="file" accept="application/pdf" className="hidden" disabled={isUploadingPdf} onChange={handlePdfUpload} />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        <div>
          <label className={`px-6 py-2.5 ${isUploading ? 'bg-zinc-800 text-zinc-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'} font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]`}>
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} 
            {isUploading ? (locale === 'ar' ? 'جاري الرفع...' : 'Uploading...') : t("add")}
            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-zinc-950/50">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t("noMedia")}</h3>
          <p className="text-zinc-400 max-w-md">{t("uploadHint")}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {media.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group rounded-2xl overflow-hidden break-inside-avoid shadow-xl bg-zinc-900"
            >
              <Image 
                src={item.url} 
                alt="Gallery media" 
                width={400} 
                height={400} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-zinc-300 font-medium">
                  {new Date(item.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
