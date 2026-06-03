'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { CompanyStatus } from '@prisma/client';

export async function getCompanies() {
  return await prisma.company.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        }
      }
    },
    orderBy: [
      { order: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

export async function updateCompanyStatus(id: string, status: CompanyStatus) {
  await prisma.company.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/[locale]/admin-dashboard/companies', 'page');
}

export async function deleteCompany(id: string, userId: string) {
  // Delete the company and the associated user account
  await prisma.$transaction([
    prisma.company.delete({ where: { id } }),
    prisma.user.delete({ where: { id: userId } })
  ]);
  revalidatePath('/[locale]/admin-dashboard/companies', 'page');
}

export async function updateCompanyPassword(userId: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
}

export async function updateCompany(
  id: string, 
  data: { 
    nameAr?: string; 
    nameEn?: string; 
    slug?: string; 
    descriptionAr?: string;
    descriptionEn?: string;
    logo?: string;
    coverImage?: string;
    category?: string;
    countryAr?: string;
    countryEn?: string;
    governorateAr?: string;
    governorateEn?: string;
    cityAr?: string;
    cityEn?: string;
    addressAr?: string;
    addressEn?: string;
    whatsapp?: string; 
    email?: string; 
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    isFeatured?: boolean;
    order?: number;
  }
) {
  await prisma.company.update({
    where: { id },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/companies', 'page');
}

export async function updateCompaniesOrder(items: { id: string, order: number }[]) {
  await prisma.$transaction(
    items.map(item => 
      prisma.company.update({
        where: { id: item.id },
        data: { order: item.order }
      })
    )
  );
  revalidatePath('/[locale]/admin-dashboard/companies', 'page');
  revalidatePath('/[locale]/companies', 'page');
}
