// src/app/api/conversations/[id]/messages/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch all messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Create new message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.role || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: role, content' },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await prisma.conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        role: body.role,
        content: body.content,
        conversationId: id
      }
    });

    // Update conversation title if it's the first user message
    if (body.role === 'user' && conversation.title === 'New Chat') {
      const newTitle = body.content.slice(0, 50) + (body.content.length > 50 ? '...' : '');
      await prisma.conversation.update({
        where: { id },
        data: { title: newTitle }
      });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}