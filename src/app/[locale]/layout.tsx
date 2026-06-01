import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LanguageSwitcher from "../../components/LanguageSwitcher";
import Navbar from "../../components/Navbar";

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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-cairo antialiased bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-slate-50`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="pt-0">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
