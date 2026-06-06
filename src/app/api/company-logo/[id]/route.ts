import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      select: { logo: true, coverImage: true }
    });

    if (!company) {
      return new NextResponse('Not found', { status: 404 });
    }

    const imageString = company.logo || company.coverImage;
    
    if (!imageString || !imageString.startsWith('data:image')) {
      // You can replace this with a default image path if available
      return new NextResponse('No image', { status: 404 });
    }

    const matches = imageString.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return new NextResponse('Invalid image data', { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': `image/${mimeType}`,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error serving company image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
