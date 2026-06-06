import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const c = await prisma.company.findMany({select:{slug:true}});
  console.log(c.map(x => x.slug).join('\n'));
}
main().finally(() => prisma.$disconnect());
