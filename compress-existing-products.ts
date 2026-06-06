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
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 70 })
      .toBuffer();
      
    if (processedBuffer.length >= buffer.length) return null;
    
    return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

async function main() {
  console.log('Starting compression of existing products...');
  const products = await prisma.product.findMany({
    select: { id: true, image: true, nameAr: true }
  });

  let compressedCount = 0;
  for (const product of products) {
    if (product.image) {
      console.log(`Processing image for ${product.nameAr}...`);
      const newImage = await processImage(product.image, 800, 800);
      if (newImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: newImage }
        });
        compressedCount++;
        console.log(`[SUCCESS] Compressed image for product: ${product.nameAr}`);
      } else {
        console.log(`[SKIP] Product ${product.nameAr} image already optimized.`);
      }
    }
  }
  
  console.log(`Finished! Compressed images for ${compressedCount} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
