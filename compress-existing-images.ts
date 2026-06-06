import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';

const prisma = new PrismaClient();

async function processImage(base64Str: string, maxWidth: number, maxHeight: number): Promise<string | null> {
  if (!base64Str || !base64Str.startsWith('data:image')) return null;
  
  try {
    const matches = base64Str.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return null;
    
    const buffer = Buffer.from(matches[2], 'base64');
    
    // Check original size roughly (buffer length)
    if (buffer.length < 50 * 1024) return null; // Already small enough (less than 50KB)

    const processedBuffer = await sharp(buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 70 })
      .toBuffer();
      
    if (processedBuffer.length >= buffer.length) return null; // Didn't actually reduce size
    
    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

async function main() {
  console.log('Starting compression of existing companies...');
  const companies = await prisma.company.findMany({
    select: { id: true, logo: true, coverImage: true, nameAr: true }
  });

  let compressedCount = 0;
  for (const company of companies) {
    let updateData: any = {};
    let updated = false;

    if (company.logo) {
      console.log(`Processing logo for ${company.nameAr}...`);
      const newLogo = await processImage(company.logo, 400, 400);
      if (newLogo) {
        updateData.logo = newLogo;
        updated = true;
      }
    }

    if (company.coverImage) {
      console.log(`Processing cover image for ${company.nameAr}...`);
      const newCover = await processImage(company.coverImage, 1200, 800);
      if (newCover) {
        updateData.coverImage = newCover;
        updated = true;
      }
    }

    if (updated) {
      await prisma.company.update({
        where: { id: company.id },
        data: updateData
      });
      compressedCount++;
      console.log(`[SUCCESS] Compressed images for company: ${company.nameAr}`);
    } else {
      console.log(`[SKIP] Company ${company.nameAr} images are already optimized or not present.`);
    }
  }
  
  console.log(`Finished! Compressed images for ${compressedCount} companies.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
