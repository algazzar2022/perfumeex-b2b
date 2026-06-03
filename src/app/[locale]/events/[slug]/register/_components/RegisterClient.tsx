'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@prisma/client';
import { Calendar, MapPin, User, Building, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { submitEventRegistration } from '@/app/[locale]/events/actions';

import Image from 'next/image';

export default function RegisterClient({ event, isAr }: { event: Event, isAr: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    location: '',
    phone: '',
    whatsapp: '',
    experienceYears: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await submitEventRegistration({
        eventId: event.id,
        name: formData.name,
        brandName: formData.brandName,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        experienceYears: parseInt(formData.experienceYears)
      });

      if (response && response.error === 'already_registered') {
        alert(isAr ? 'هذا الرقم مسجل بالفعل في هذه الفعالية!' : 'This phone number is already registered for this event!');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/${isAr ? 'ar' : 'en'}/events`);
      }, 3000);
    } catch (error) {
      alert(isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
        <CheckCircle size={80} className="mx-auto mb-6 text-emerald-500" />
        <h2 className="text-3xl font-bold mb-4">{isAr ? 'تم تسجيل حضورك بنجاح!' : 'Registration Successful!'}</h2>
        <p className="text-gray-400 text-lg mb-8">
          {isAr ? 'شكراً لاهتمامك بالفعالية. سيتم توجيهك الآن لصفحة الفعاليات.' : 'Thank you for your interest. You will be redirected to the events page now.'}
        </p>
        <Loader2 size={32} className="mx-auto text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="relative w-full flex flex-col justify-end min-h-[350px] md:min-h-[400px]">
        <div className="absolute inset-0">
          <Image 
            src={event.image} 
            alt={isAr ? event.titleAr : event.titleEn} 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/90 to-black/40" />
        </div>
        
        <div className="relative z-10 p-6 md:p-8 pt-32">
          <div className="bg-emerald-500/20 text-emerald-400 w-fit px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-4 border border-emerald-500/20 backdrop-blur-md shadow-lg">
            {isAr ? 'تسجيل حضور' : 'Event Registration'}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-6 text-white drop-shadow-lg leading-snug">
            {isAr ? event.titleAr : event.titleEn}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 text-gray-200">
            <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md border border-white/10 shadow-lg flex-1">
              <Calendar size={20} className="text-emerald-400 drop-shadow-md shrink-0" />
              <span className="font-bold tracking-wide text-sm md:text-base">{new Date(event.date).toLocaleString(isAr ? 'ar-EG' : 'en-US', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl backdrop-blur-md border border-white/10 shadow-lg flex-1">
              <MapPin size={20} className="text-emerald-400 drop-shadow-md shrink-0" />
              <span className="font-bold tracking-wide text-sm md:text-base">{isAr ? event.locationAr : event.locationEn}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 ps-10 pe-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder={isAr ? 'الاسم الثلاثي' : 'John Doe'}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{isAr ? 'اسم البراند / الشركة' : 'Brand / Company Name'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
                  <Building size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={e => setFormData({...formData, brandName: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 ps-10 pe-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder={isAr ? 'اسم شركتك أو مشروعك' : 'Your Company Name'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{isAr ? 'المدينة / المحافظة' : 'City / Location'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 ps-10 pe-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder={isAr ? 'الرياض, القاهرة, دبي...' : 'Riyadh, Cairo, Dubai...'}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{isAr ? 'رقم الاتصال' : 'Phone Number'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 ps-10 pe-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-left"
                  dir="ltr"
                  placeholder="+20 100 000 0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{isAr ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-gray-500">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 ps-10 pe-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-left"
                  dir="ltr"
                  placeholder="+20 100 000 0000"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{isAr ? 'كم سنة تعمل في مجال العطور؟' : 'Years of Experience in Perfumes'}</label>
            <input
              type="number"
              required
              min="0"
              max="50"
              value={formData.experienceYears}
              onChange={e => setFormData({...formData, experienceYears: e.target.value})}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder={isAr ? 'مثال: 5' : 'e.g. 5'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : (
              <>
                <span>{isAr ? 'تأكيد الحضور' : 'Confirm Registration'}</span>
                <ArrowRight size={20} className={isAr ? 'rotate-180' : ''} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
