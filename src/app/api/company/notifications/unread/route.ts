import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user?.company) {
      return NextResponse.json({ count: 0 }, { status: 404 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        companyId: user.company.id,
        isRead: false
      }
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
