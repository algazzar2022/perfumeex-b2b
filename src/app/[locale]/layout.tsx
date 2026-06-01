import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Navbar from "../../components/Navbar";

import { AuthProvider } from "../../components/AuthProvider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PerfumeEx | Premium B2B Perfume Marketplace",
  description: "The premier B2B marketplace and directory for the perfume industry.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Fetch messages
  const messages = await getMessages();

  // Set direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className="dark">
      <body
        className={`${cairo.variable} font-cairo antialiased bg-zinc-950 text-white min-h-screen relative overflow-x-hidden`}
      >
        <AuthProvider>
          {/* Global Grid Background */}
          <div className="fixed inset-0 z-[-1] pointer-events-none" style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
          }} />
          <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] z-[-1] pointer-events-none" />
          <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] z-[-1] pointer-events-none" />

          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <div className="pt-0 relative z-10">
              {children}
            </div>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
