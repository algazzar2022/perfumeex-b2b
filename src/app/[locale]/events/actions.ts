'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitEventRegistration(data: {
  eventId: string;
  name: string;
  age: number;
  brandName: string;
  location: string;
  phone: string;
  whatsapp: string;
  experienceYears: number;
}) {
  await prisma.eventRegistration.create({
    data
  });
  revalidatePath('/[locale]/events');
  revalidatePath('/[locale]/admin-dashboard/events/[id]');
  return { success: true };
}
