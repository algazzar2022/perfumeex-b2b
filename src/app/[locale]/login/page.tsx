"use client";

import { useState, useEffect } from "react";
import { signIn, getSession, useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  const t = useTranslations("Auth.login");
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status === "authenticated") {
      if ((session?.user as any)?.role === "SUPER_ADMIN") {
        router.push(`/${locale}/admin-dashboard`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
    }
  }, [status, router, locale, session]);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const callback = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (callback?.error) {
      setError(t("error"));
      setIsLoading(false);
    } else if (callback?.ok) {
      const sessionData = await getSession();
      if ((sessionData?.user as any)?.role === "SUPER_ADMIN") {
        router.push(`/${locale}/admin-dashboard`);
      } else {
        router.push(`/${locale}/dashboard`);
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-950 border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">{t("title")}</h1>
          <p className="text-zinc-400 mb-8">{t("subtitle")}</p>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">{t("emailLabel")}</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                  placeholder="company@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">{t("passwordLabel")}</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-emerald-500 absolute top-3 ltr:left-3 rtl:right-3" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors" 
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href={`/${locale}/forgot-password`} className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
                {t("forgotPassword")}
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("submit")} <ArrowRight className="w-5 h-5 rtl:rotate-180" /></>}
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-8 text-sm">
            {t("noAccount")}{' '}
            <Link href={`/${locale}/register`} className="text-emerald-500 hover:text-emerald-400 font-bold">
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
