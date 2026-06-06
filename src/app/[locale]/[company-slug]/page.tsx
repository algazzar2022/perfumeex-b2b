import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./_components/ProfileClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; "company-slug": string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const company = await prisma.company.findUnique({
    where: { slug: resolvedParams["company-slug"] },
    select: { id: true, nameAr: true, nameEn: true, descriptionAr: true, logo: true, coverImage: true }
  });

  if (!company) {
    return {
      title: "شركة غير موجودة | دليل بورصة العطور",
      description: "هذه الشركة غير موجودة على دليل بورصة العطور.",
    };
  }

  const title = `${company.nameAr} | دليل بورصة العطور`;
  const description = `اكتشف الملف الشخصي لشركة ${company.nameAr} على دليل بورصة العطور، تصفح منتجاتنا وتواصل معنا الآن! ${company.descriptionAr ? '- ' + company.descriptionAr.substring(0, 100) + '...' : ''}`;
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.perfumeex.app';
  
  // Create dynamic image route
  let imageUrl = `${baseUrl}/favicon.ico`;
  if (company.logo || company.coverImage) {
    imageUrl = `${baseUrl}/api/company-logo/${company.id}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${resolvedParams.locale}/${resolvedParams["company-slug"]}`,
      siteName: 'دليل بورصة العطور',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: company.nameAr,
        },
      ],
      locale: resolvedParams.locale === 'ar' ? 'ar_AR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ locale: string; "company-slug": string }>;
}) {
  const resolvedParams = await params;
  
  let company = await prisma.company.findUnique({
    where: {
      slug: resolvedParams["company-slug"],
    },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      },
      branches: true,
      galleries: true,
    },
  });

  if (!company) {
    const fallbackSlug = resolvedParams["company-slug"].replace(/[\s\.]+/g, '-');
    if (fallbackSlug !== resolvedParams["company-slug"]) {
      const fallbackCompany = await prisma.company.findUnique({
        where: { slug: fallbackSlug }
      });
      if (fallbackCompany) {
        // Redirect to the correct slug
        const { redirect } = await import('next/navigation');
        redirect(`/${resolvedParams.locale}/${fallbackSlug}`);
      }
    }
    return notFound();
  }

  // Sort products: 1 first, 2 second. If 0, push to bottom.
  if (company.products && company.products.length > 0) {
    company.products.sort((a, b) => {
      const orderA = a.order && a.order > 0 ? a.order : 999999;
      const orderB = b.order && b.order > 0 ? b.order : 999999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return 0;
    });
  }

  // Record a page view
  await prisma.company.update({
    where: { id: company.id },
    data: { profileViews: { increment: 1 } }
  }).catch(() => {});

  return <ProfileClient company={company} locale={resolvedParams.locale} />;
}
