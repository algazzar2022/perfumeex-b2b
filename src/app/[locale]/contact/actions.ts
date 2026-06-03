'use server';

import { prisma } from '@/lib/prisma';

export async function submitSupportTicket(data: {
  name: string;
  brandName: string;
  phone: string;
  message: string;
}) {
  try {
    await prisma.supportTicket.create({
      data
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'حدث خطأ أثناء الإرسال' };
  }
}
