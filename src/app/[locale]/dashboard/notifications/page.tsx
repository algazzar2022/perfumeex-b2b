import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CompanyNotificationsClient from "./_components/CompanyNotificationsClient";

export default async function CompanyNotificationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true }
  });

  if (!user?.company) {
    redirect(`/${locale}/submit-company`);
  }

  const notifications = await prisma.notification.findMany({
    where: { companyId: user.company.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600 mb-2">
          {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
        </h1>
        <p className="text-gray-400">
          {locale === 'ar' ? 'تحديثات وتنبيهات هامة من إدارة المنصة' : 'Important updates and alerts from the platform administration'}
        </p>
      </div>

      <CompanyNotificationsClient initialNotifications={notifications} locale={locale} />
    </div>
  );
}
