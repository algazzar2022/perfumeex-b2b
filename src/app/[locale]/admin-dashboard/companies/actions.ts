'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { CompanyStatus } from '@prisma/client';

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      userId: true,
      nameAr: true,
      nameEn: true,
      slug: true,
      logo: true,
      email: true,
      whatsapp: true,
      status: true,
      order: true,
      createdAt: true,
      user: {
        select: {
          email: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return companies.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return 0;
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
    isSponsor?: boolean;
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

export async function createCompany(data: any) {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error('البريد الإلكتروني مسجل بالفعل');
  }
  const existingSlug = await prisma.company.findUnique({ where: { slug: data.slug } });
  if (existingSlug) {
    throw new Error('رابط الشركة مستخدم بالفعل');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      name: data.nameAr,
      password: hashedPassword,
      role: 'COMPANY_OWNER'
    }
  });

  const newCompany = await prisma.company.create({
    data: {
      userId: newUser.id,
      nameAr: data.nameAr,
      nameEn: data.nameEn || data.nameAr,
      slug: data.slug,
      email: data.email,
      status: 'APPROVED',
      order: data.order || 0,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      logo: data.logo,
      coverImage: data.coverImage,
      category: data.category,
      whatsapp: data.whatsapp,
      website: data.website,
      countryAr: data.countryAr,
      governorateAr: data.governorateAr,
      cityAr: data.cityAr,
      addressAr: data.addressAr,
      facebook: data.facebook,
      instagram: data.instagram,
      twitter: data.twitter,
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        }
      }
    }
  });

  revalidatePath('/[locale]/admin-dashboard/companies', 'page');
  revalidatePath('/[locale]/companies', 'page');
  return newCompany;
}
export async function createBranch(companyId: string, data: any) {
  await prisma.branch.create({
    data: {
      ...data,
      companyId
    }
  });
  revalidatePath('/[locale]/admin-dashboard/companies/[id]', 'page');
}

export async function updateBranch(branchId: string, data: any) {
  await prisma.branch.update({
    where: { id: branchId },
    data
  });
  revalidatePath('/[locale]/admin-dashboard/companies/[id]', 'page');
}

export async function deleteBranch(branchId: string) {
  await prisma.branch.delete({
    where: { id: branchId }
  });
  revalidatePath('/[locale]/admin-dashboard/companies/[id]', 'page');
}

export async function addGalleryImage(companyId: string, url: string, type: 'IMAGE' | 'VIDEO' = 'IMAGE') {
  await prisma.gallery.create({
    data: {
      companyId,
      url,
      type
    }
  });
  revalidatePath('/[locale]/admin-dashboard/companies/[id]', 'page');
}

export async function deleteGalleryImage(imageId: string) {
  await prisma.gallery.delete({
    where: { id: imageId }
  });
  revalidatePath('/[locale]/admin-dashboard/companies/[id]', 'page');
}
