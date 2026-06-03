'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { submitSupportTicket } from '../actions';

export default function ContactClient({ isAr }: { isAr: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.name || !formData.brandName || !formData.phone || !formData.message) {
      setError(isAr ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
      setIsLoading(false);
      return;
    }

    const res = await submitSupportTicket(formData);
    if (res.success) {
      setIsSuccess(true);
      setFormData({ name: '', brandName: '', phone: '', message: '' });
    } else {
      setError(res.error || 'Error');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-cairo">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              {isAr ? 'الدعم ' : 'Technical '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                {isAr ? 'الفني' : 'Support'}
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {isAr 
                ? 'نحن هنا لمساعدتك والإجابة على كافة استفساراتك المتعلقة بمنصة دليل بورصة العطور.'
                : 'We are here to help and answer all your inquiries regarding the PerfumeEx directory.'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Mail className="text-emerald-400" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</h3>
              <p className="text-gray-400 mb-4">{isAr ? 'للتواصل الرسمي والمراسلات' : 'For official correspondence'}</p>
              <a href="mailto:info@perfumeex.app" className="text-xl font-bold text-white hover:text-emerald-400 transition-colors" dir="ltr">
                info@perfumeex.app
              </a>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Phone className="text-blue-400" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{isAr ? 'رقم الهاتف' : 'Phone Number'}</h3>
              <p className="text-gray-400 mb-4">{isAr ? 'للدعم الفني والاستفسارات المباشرة' : 'For technical support and direct inquiries'}</p>
              <a href="tel:01014228118" className="text-xl font-bold text-white hover:text-blue-400 transition-colors" dir="ltr">
                01014228118
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 bg-[#111] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            {isSuccess ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-emerald-400">
                  {isAr ? 'تم إرسال رسالتك بنجاح!' : 'Message sent successfully!'}
                </h2>
                <p className="text-xl text-gray-400 max-w-md">
                  {isAr ? 'شكراً لتواصلك معنا، سيقوم فريق الدعم الفني بالرد عليك في أقرب وقت.' : 'Thank you for reaching out, our support team will get back to you shortly.'}
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-bold"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Send className="text-emerald-400" />
                  {isAr ? 'نموذج المراسلة المباشرة' : 'Direct Message Form'}
                </h2>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-emerald-500 p-4 rounded-xl outline-none transition-colors"
                      placeholder={isAr ? 'أدخل اسمك الكريم' : 'Enter your name'}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">{isAr ? 'اسم البراند أو الشركة' : 'Brand or Company Name'}</label>
                    <input 
                      type="text" 
                      value={formData.brandName}
                      onChange={e => setFormData({...formData, brandName: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 focus:border-emerald-500 p-4 rounded-xl outline-none transition-colors"
                      placeholder={isAr ? 'اسم شركتك' : 'Your company name'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-emerald-500 p-4 rounded-xl outline-none transition-colors"
                    placeholder={isAr ? 'رقم التواصل الخاص بك' : 'Your contact number'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">{isAr ? 'نص الرسالة / الاستفسار' : 'Message / Inquiry'}</label>
                  <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-white/10 focus:border-emerald-500 p-4 rounded-xl outline-none transition-colors min-h-[150px]"
                    placeholder={isAr ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your inquiry details here...'}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                  {isAr ? 'إرسال الرسالة الآن' : 'Send Message Now'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
