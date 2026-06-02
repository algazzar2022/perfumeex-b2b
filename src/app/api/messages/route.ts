import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get sender company ID
    const senderUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    });

    if (!senderUser?.company?.id) {
      return NextResponse.json({ error: 'Sender must have a registered company profile' }, { status: 403 });
    }

    // Check if sending to self
    if (senderUser.company.id === receiverId) {
      return NextResponse.json({ error: 'Cannot send message to yourself' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: senderUser.company.id,
        receiverId,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true }
    });

    if (!user?.company?.id) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.message.findMany({
      where: { receiverId: user.company.id },
      include: {
        sender: {
          select: {
            nameAr: true,
            nameEn: true,
            email: true,
            whatsapp: true,
            logo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

