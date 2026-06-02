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
      OR: [
        { categoryId: slug },
        {
          company: {
            category: {
              contains: slug
            }
          }
        }
      ]
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

  // Filter out products from unapproved companies just in case
  const approvedProducts = products.filter(p => p.company.status === 'APPROVED');

  return (
    <CategoryProductsClient 
      initialProducts={approvedProducts} 
      locale={locale} 
      slug={slug} 
    />
  );
}
