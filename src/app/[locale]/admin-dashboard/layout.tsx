import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "./_components/Sidebar";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "PerfumeEx | Admin Dashboard",
  description: "Admin dashboard for PerfumeEx B2B marketplace.",
};

export default async function AdminLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    redirect(`/${locale}/admin-login`);
  }

  const unreadSupportCount = await prisma.supportTicket.count({
    where: { isRead: false }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
      <Sidebar unreadSupportCount={unreadSupportCount} />
      
      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {props.children}
        </div>
      </main>
    </div>
  );
}
