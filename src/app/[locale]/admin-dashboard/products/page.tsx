import { getProducts } from './actions';
import ProductsClient from './_components/ProductsClient';
import { prisma } from '@/lib/prisma';

export default async function AdminProducts() {
  const products = await getProducts();
  
  const companies = await prisma.company.findMany({
    select: { id: true, nameAr: true, nameEn: true },
    where: { status: 'APPROVED' },
    orderBy: { nameAr: 'asc' }
  });

  return (
    <div>
      <ProductsClient initialProducts={products} companies={companies} />
    </div>
  );
}
