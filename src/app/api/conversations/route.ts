// src/app/api/conversations/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Type for conversation with tree
type ConversationWithTree = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  tree: { id: string } | null;
};

// GET - Fetch all conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tree: {
          select: { id: true }
        }
      }
    });

    // Transform data to match frontend expectations
    const formatted = conversations.map((conv: ConversationWithTree) => ({
      id: conv.id,
      title: conv.title,
      status: conv.status,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      treeId: conv.tree?.id || null
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const conversation = await prisma.conversation.create({
      data: {
        title: body.title || 'New Chat',
        status: 'chatting'
      }
    });

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      status: conversation.status,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      treeId: null
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}