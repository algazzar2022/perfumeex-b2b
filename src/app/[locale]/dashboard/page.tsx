"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, MousePointerClick, Package, MapPin, TrendingUp, Bell, Clock, CheckCircle2, Circle, PartyPopper } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardOverview() {
  const t = useTranslations("Dashboard.overview");
  const { data: session } = useSession();
  const companyName = session?.user?.name || "";
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [company, setCompany] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/company/profile')
      .then(res => res.json())
      .then(data => {
        setCompany(data);
      })
      .catch(console.error);

    fetch('/api/company/notifications')
      .then(res => res.json())
      .then(data => {
        if (data?.notifications) {
          setRecentActivity(data.notifications);
        }
      })
      .catch(console.error);
  }, []);

  const checks = [
    { key: 'logo', isCompleted: !!company?.logo, label: locale === 'ar' ? 'رفع شعار الشركة' : 'Upload Company Logo' },
    { key: 'location', isCompleted: !!((company?.cityAr || company?.cityEn) && (company?.governorateAr || company?.governorateEn)), label: locale === 'ar' ? 'إضافة المدينة والمحافظة' : 'Add City and Governorate' },
    { key: 'cover', isCompleted: !!company?.coverImage, label: locale === 'ar' ? 'رفع غلاف للشركة (Cover)' : 'Upload Company Cover' },
    { key: 'contact', isCompleted: !!(company?.whatsapp && company?.email), label: locale === 'ar' ? 'إضافة رقم التواصل والإيميل' : 'Add Phone and Email' },
    { key: 'facebook', isCompleted: !!company?.facebook, label: locale === 'ar' ? 'إضافة رابط صفحة الفيسبوك' : 'Add Facebook Link' },
    { key: 'description', isCompleted: !!(company?.descriptionAr || company?.descriptionEn), label: locale === 'ar' ? 'إضافة وصف قصير للشركة' : 'Add Short Description' }
  ];

  const completedCount = checks.filter(c => c.isCompleted).length;
  const completionPercentage = Math.round((completedCount / checks.length) * 100) || 0;
  const is100Percent = completionPercentage === 100;

  const profileViews = company?.profileViews || 0;
  const profileViewsPercent = Math.floor(profileViews / 50);

  const contactClicks = company?.contactClicks || 0;
  const contactClicksPercent = Math.floor(contactClicks / 50);

  const activeProducts = company?._count?.products || 0;
  const activeProductsPercent = Math.floor(activeProducts / 5);

  const branches = company?._count?.branches || 0;
  const branchesPercent = branches;

  const formatChange = (val: number) => val > 0 ? `+${val}%` : "0%";

  const stats = [
    { title: locale === 'ar' ? 'زيارات الملف' : 'Profile Views', value: profileViews.toString(), change: formatChange(profileViewsPercent), isPositive: true, icon: <Eye className="w-5 h-5 text-emerald-500" /> },
    { title: locale === 'ar' ? 'نقرات التواصل' : 'Contact Clicks', value: contactClicks.toString(), change: formatChange(contactClicksPercent), isPositive: true, icon: <MousePointerClick className="w-5 h-5 text-blue-500" /> },
    { title: locale === 'ar' ? 'منتجات نشطة' : 'Active Products', value: activeProducts.toString(), change: formatChange(activeProductsPercent), isPositive: true, icon: <Package className="w-5 h-5 text-purple-500" /> },
    { title: locale === 'ar' ? 'الفروع' : 'Branches', value: branches.toString(), change: formatChange(branchesPercent), isPositive: true, icon: <MapPin className="w-5 h-5 text-amber-500" /> },
  ];



  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("welcome", { companyName: companyName })}</h1>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>
        <button 
          onClick={() => router.push(`/${locale}/dashboard/products`)}
          className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
        >
          <Package className="w-4 h-4" /> {locale === 'ar' ? 'أضف منتجاتك' : 'Add Products'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-950 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} flex items-center ltr:flex-row rtl:flex-row-reverse gap-1`}>
                <span dir="ltr">{stat.change}</span>
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Profile Completion Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-zinc-950 border border-white/5 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
          
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{t("completion.title")}</h2>
            <p className="text-zinc-400 text-sm mb-8">{t("completion.subtitle")}</p>
            
            <div className="w-full bg-zinc-900 rounded-full h-4 mb-4 overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-4 rounded-full relative"
              >
              </motion.div>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-emerald-400">{t("completion.completed", { percentage: completionPercentage })}</span>
              <span className="text-zinc-500">100%</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {checks.map((check, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${check.isCompleted ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                  {check.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${check.isCompleted ? 'text-white line-through opacity-50' : 'text-zinc-300'}`}>{check.label}</span>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/5 mt-4">
              {is100Percent ? (
                <div className="flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-3 rounded-xl">
                  <PartyPopper className="w-5 h-5" />
                  {locale === 'ar' ? 'تهانينا! ملف شركتك مكتمل 100%' : 'Congratulations! Your profile is 100% complete.'}
                </div>
              ) : (
                <button 
                  onClick={() => router.push(`/${locale}/dashboard/company`)}
                  className="w-full bg-white text-black hover:bg-emerald-500 transition-colors font-bold py-3 rounded-xl"
                >
                  {locale === 'ar' ? 'أكمل الآن' : 'Complete Now'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-950 border border-white/5 p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-500" /> {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
            </h2>
            <button 
              onClick={() => router.push(`/${locale}/dashboard/notifications`)}
              className="text-emerald-500 hover:text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-lg transition-colors"
            >
              {locale === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 border border-white/5 rounded-2xl bg-white/5">
                {locale === 'ar' ? 'لا توجد إشعارات حديثة' : 'No recent notifications'}
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  onClick={() => router.push(`/${locale}/dashboard/notifications`)}
                  className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all border hover:-translate-y-0.5 ${
                    activity.isRead 
                      ? 'bg-[#111] border-white/5 opacity-70 hover:border-white/10' 
                      : 'bg-[#151515] border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
                  }`}
                >
                  <div className="mt-1">
                    {!activity.isRead ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <div>
                    <p className={`text-sm mb-1 leading-relaxed ${activity.isRead ? 'text-zinc-400' : 'text-white font-bold'}`}>
                      {locale === 'ar' ? activity.titleAr : activity.titleEn}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {new Date(activity.createdAt).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
