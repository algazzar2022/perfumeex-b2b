const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const categories = [
    { slug: 'perfumeClones', nameAr: 'عطور محاكاه', nameEn: 'Perfume Clones', order: 1 },
    { slug: 'readyPerfumes', nameAr: 'عطور جاهزة', nameEn: 'Ready Perfumes', order: 2 },
    { slug: 'glass', nameAr: 'زجاج', nameEn: 'Glass', order: 3 },
    { slug: 'bakhoor', nameAr: 'بخور', nameEn: 'Bakhoor & Oud', order: 4 },
    { slug: 'airFresheners', nameAr: 'معطرات', nameEn: 'Air Fresheners', order: 5 },
    { slug: 'packaging', nameAr: 'تعبئة وتغليف', nameEn: 'Packaging', order: 6 },
    { slug: 'bottlesAndEmpties', nameAr: 'فوارغ', nameEn: 'Bottles & Empties', order: 7 },
    { slug: 'others', nameAr: 'أخرى', nameEn: 'Others', order: 8 }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat
    });
  }
  console.log('Categories seeded!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
