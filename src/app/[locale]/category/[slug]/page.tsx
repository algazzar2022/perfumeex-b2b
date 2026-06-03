import { prisma } from "@/lib/prisma";
import CategoryProductsClient from "./_components/CategoryProductsClient";

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const slug = resolvedParams.slug;

  const products = await prisma.product.findMany({
    where: {
      categoryId: slug,
      status: 'APPROVED',
      company: {
        status: 'APPROVED'
      }
    },
    include: {
      company: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          slug: true,
          logo: true,
          whatsapp: true,
          status: true,
          isVerified: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Pass all products directly (consistent with the rest of the app for now)
  const approvedProducts = products;

  return (
    <CategoryProductsClient 
      initialProducts={approvedProducts} 
      locale={locale} 
      slug={slug} 
    />
  );
}
