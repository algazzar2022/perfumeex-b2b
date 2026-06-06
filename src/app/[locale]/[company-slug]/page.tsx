import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./_components/ProfileClient";

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
    const fallbackSlug = resolvedParams["company-slug"].replace(/\s+/g, '.');
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
