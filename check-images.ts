import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.company.findMany({select:{logo:true, coverImage: true}});
  const logos = c.map(x => x.logo?.substring(0, 50)).filter(Boolean);
  const covers = c.map(x => x.coverImage?.substring(0, 50)).filter(Boolean);
  console.log("Logos:", logos);
  console.log("Covers:", covers);
}
main().finally(() => prisma.$disconnect());
