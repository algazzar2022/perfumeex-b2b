'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function markNotificationAsRead(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { company: true }
  });

  if (!user?.company) throw new Error('Company not found');

  await prisma.notification.update({
    where: { 
      id,
      companyId: user.company.id // Ensure they only mark their own
    },
    data: { isRead: true }
  });
}
