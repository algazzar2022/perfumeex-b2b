'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitEventRegistration(data: {
  eventId: string;
  name: string;
  brandName: string;
  location: string;
  phone: string;
  whatsapp: string;
  experienceYears: number;
}) {
  const registration = await prisma.eventRegistration.create({
    data
  });
  revalidatePath('/[locale]/admin-dashboard/events');
  revalidatePath('/[locale]/events/[id]');
  return registration;
}
