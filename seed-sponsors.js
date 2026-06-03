const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const logos = [
    'AL Madinah AL Munawwarah.png', 'Aknan.png', 'Al-Mawardi.png', 'Al-Rihani.png', 'Al-Safa.png',
    'French.png', 'Halim.png', 'Hamed.png', 'Hashim.png', 'Khader Group.png', 'Sea of ​​Perfumes.png',
    'abketko.png', 'afaq.png', 'alfaroq.png', 'alharamayn.png', 'almasa alzahbeya.png', 'alsharkisii.png',
    'bet malke.png', 'diamond.png', 'eid.png', 'euro.png', 'motawea.png', 'rahiq.png', 'sabarah.png',
    'teba.png', 'twins.png', 'vegas.png', 'zamany.png'
  ];

  for (let i = 0; i < logos.length; i++) {
    const logo = logos[i];
    const name = logo.split('.')[0];
    const exists = await prisma.sponsor.findFirst({ where: { logo: '/sponsor-logos/' + logo } });
    if (!exists) {
      await prisma.sponsor.create({
        data: {
          nameAr: name,
          nameEn: name,
          logo: '/sponsor-logos/' + logo,
          order: i,
          isActive: true
        }
      });
    }
  }
  console.log('Sponsors seeded!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
