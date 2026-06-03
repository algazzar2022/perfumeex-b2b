'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Lock, User, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: username, // using email field for username to match credentials provider
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError('بيانات الدخول غير صحيحة');
    } else {
      router.push(`/${locale}/admin-dashboard`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            لوحة الإدارة
          </h1>
          <p className="text-gray-400">الرجاء تسجيل الدخول للمتابعة</p>
        </div>

        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full blur-[80px] opacity-20" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-2">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500 text-white text-left"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 focus:outline-none focus:border-purple-500 text-white text-left"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center transition-opacity mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
