const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany();
  console.log(companies.map(c => ({
    nameEn: c.nameEn,
    nameAr: c.nameAr,
    isVerified: c.isVerified,
    status: c.status
  })));
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
