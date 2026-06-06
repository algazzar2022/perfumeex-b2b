import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const companies = await prisma.company.findMany();
  let updatedCount = 0;
  for (const company of companies) {
    if (company.slug && company.slug.includes('.')) {
      const newSlug = company.slug.replace(/\./g, '-');
      await prisma.company.update({
        where: { id: company.id },
        data: { slug: newSlug }
      });
      console.log(`[FIXED] ID: ${company.id} | Old: "${company.slug}" -> New: "${newSlug}"`);
      updatedCount++;
    }
  }
  console.log(`Completed! Fixed ${updatedCount} companies.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
