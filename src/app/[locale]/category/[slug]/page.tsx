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
    orderBy: { createdAt: 'desc' }
  });

  // Sort: 1 first, 2 second. If 0, push to bottom.
  const sortedProducts = products.sort((a, b) => {
    const orderA = a.order && a.order > 0 ? a.order : 999999;
    const orderB = b.order && b.order > 0 ? b.order : 999999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    // If order is same (both 0 or same number), keep original date sorting
    return 0;
  });

  // Pass all products directly
  const approvedProducts = sortedProducts;

  return (
    <CategoryProductsClient 
      initialProducts={approvedProducts} 
      locale={locale} 
      slug={slug} 
    />
  );
}
