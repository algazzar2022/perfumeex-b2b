import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await prisma.company.count({
          where: {
            status: 'APPROVED',
            category: { contains: cat.slug }
          }
        });
        return { ...cat, count };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
