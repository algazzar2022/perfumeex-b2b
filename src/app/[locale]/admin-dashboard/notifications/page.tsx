import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import NotificationsClient from "./_components/NotificationsClient";
import { prisma } from "@/lib/prisma";

export default async function AdminNotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    redirect(`/${locale}/admin-login`);
  }

  // Get distinct notifications (group by to get history)
  let history: any[] = [];
  try {
    history = await prisma.notification.groupBy({
      by: ['titleAr', 'titleEn', 'messageAr', 'messageEn', 'createdAt'],
      _count: {
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching notifications history:', error);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          إدارة الإشعارات
        </h1>
        <p className="text-gray-400">إرسال إشعارات وتنبيهات لجميع الشركات المسجلة على المنصة</p>
      </div>

      <NotificationsClient initialHistory={history} />
    </div>
  );
}
