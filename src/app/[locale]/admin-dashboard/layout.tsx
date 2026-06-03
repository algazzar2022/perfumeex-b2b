import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "./_components/Sidebar";

export const metadata = {
  title: "PerfumeEx | Admin Dashboard",
  description: "Admin dashboard for PerfumeEx B2B marketplace.",
};

export default async function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    redirect(`/${locale}/admin-login`);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
