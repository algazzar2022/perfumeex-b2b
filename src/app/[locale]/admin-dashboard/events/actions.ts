'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Middleware to check admin access
const checkAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }
};

export async function getEvents() {
  await checkAdmin();
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });
  return events;
}

export async function createEvent(data: {
  titleAr: string;
  titleEn: string;
  slug: string;
  image: string;
  date: Date;
  locationAr: string;
  locationEn: string;
}) {
  await checkAdmin();
  const event = await prisma.event.create({
    data
  });
  revalidatePath('/[locale]/admin-dashboard/events');
  revalidatePath('/[locale]/events');
  return event;
}

export async function updateEvent(id: string, data: Partial<{
  titleAr: string;
  titleEn: string;
  slug: string;
  image: string;
  date: Date;
  locationAr: string;
  locationEn: string;
}>) {
  await checkAdmin();
  const event = await prisma.event.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/events');
  revalidatePath('/[locale]/events');
  return event;
}

export async function deleteEvent(id: string) {
  await checkAdmin();
  await prisma.event.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/events');
  revalidatePath('/[locale]/events');
}

export async function getEventRegistrations(eventId: string) {
  await checkAdmin();
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    orderBy: { createdAt: 'desc' }
  });
  return registrations;
}

export async function deleteRegistration(id: string) {
  await checkAdmin();
  await prisma.eventRegistration.delete({
    where: { id }
  });
  revalidatePath('/[locale]/admin-dashboard/events/[id]');
}

export async function updateRegistration(id: string, data: {
  name: string;
  brandName: string;
  location: string;
  phone: string;
  whatsapp: string;
  experienceYears: number;
}) {
  await checkAdmin();
  const reg = await prisma.eventRegistration.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/events/[id]');
  return reg;
}
