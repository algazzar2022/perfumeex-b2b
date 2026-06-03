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

export const getAboutContent = async () => {
  const setting = await prisma.setting.findUnique({
    where: { key: 'about_page_content' }
  });
  
  if (setting && setting.value) {
    try {
      return JSON.parse(setting.value);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const updateAboutContent = async (data: any) => {
  await checkAdmin();
  
  await prisma.setting.upsert({
    where: { key: 'about_page_content' },
    update: { value: JSON.stringify(data) },
    create: { key: 'about_page_content', value: JSON.stringify(data) }
  });
  
  revalidatePath('/[locale]/about');
  revalidatePath('/[locale]/admin-dashboard/about');
  
  return { success: true };
};
