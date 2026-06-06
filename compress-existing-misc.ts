import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();

async function processImage(base64Str: string, maxWidth: number, maxHeight: number): Promise<string | null> {
  if (!base64Str || !base64Str.startsWith('data:image')) return null;
  try {
    const matches = base64Str.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;
    const buffer = Buffer.from(matches[2], 'base64');
    if (buffer.length < 50 * 1024) return null;
    const processedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
    if (processedBuffer.length >= buffer.length) return null;
    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('Compressing Sponsors...');
  const sponsors = await prisma.sponsor.findMany();
  for (const s of sponsors) {
    if (s.logo) {
      const newLogo = await processImage(s.logo, 400, 400);
      if (newLogo) {
        await prisma.sponsor.update({ where: { id: s.id }, data: { logo: newLogo } });
        console.log(`[SUCCESS] Sponsor: ${s.nameAr}`);
      }
    }
  }

  console.log('Compressing Events...');
  const events = await prisma.event.findMany();
  for (const e of events) {
    if (e.image) {
      const newImage = await processImage(e.image, 800, 800);
      if (newImage) {
        await prisma.event.update({ where: { id: e.id }, data: { image: newImage } });
        console.log(`[SUCCESS] Event: ${e.titleAr}`);
      }
    }
  }
}
main().finally(() => prisma.$disconnect());
