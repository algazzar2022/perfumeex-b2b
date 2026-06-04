'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function sendGlobalNotification(data: { titleAr: string; titleEn: string; messageAr: string; messageEn: string }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }

  const companies = await prisma.company.findMany({
    where: { status: 'APPROVED' },
    select: { id: true }
  });

  if (companies.length === 0) return 0;

  await prisma.notification.createMany({
    data: companies.map(company => ({
      companyId: company.id,
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      messageAr: data.messageAr,
      messageEn: data.messageEn,
    }))
  });

  return companies.length;
}

export async function deleteGlobalNotification(titleAr: string, messageAr: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }

  await prisma.notification.deleteMany({
    where: { titleAr, messageAr }
  });
}
