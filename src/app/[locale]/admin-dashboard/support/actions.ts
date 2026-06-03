'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const checkAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }
};

export const getSupportTickets = async () => {
  await checkAdmin();
  return await prisma.supportTicket.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const markTicketAsRead = async (id: string) => {
  await checkAdmin();
  await prisma.supportTicket.update({
    where: { id },
    data: { isRead: true }
  });
  revalidatePath('/[locale]/admin-dashboard/support');
  return { success: true };
};

export const deleteTicket = async (id: string) => {
  await checkAdmin();
  await prisma.supportTicket.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/support');
  return { success: true };
};
