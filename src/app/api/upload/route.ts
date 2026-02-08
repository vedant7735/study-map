// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Upload and process PDF
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;
    const conversationId = formData.get('conversationId') as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: 'No conversation ID provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Update conversation status to processing
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: 'processing',
        title: file.name.replace('.pdf', '')
      }
    });

    // TODO: In Phase 5, we will:
    // 1. Extract text from PDF
    // 2. Send to OpenAI to generate tree structure
    // 3. Save tree to database

    // For now, create a placeholder tree
    const placeholderTree = {
      id: `tree_${Date.now()}`,
      title: file.name.replace('.pdf', ''),
      createdAt: new Date().toISOString(),
      rootNode: {
        id: 'root',
        title: file.name.replace('.pdf', ''),
        contentType: 'conceptual',
        summaries: {
          level1: 'Document overview',
          level2: 'This document has been uploaded and is ready for processing.',
          level3: 'Full AI processing will be implemented in Phase 5. For now, this is a placeholder tree structure.',
          level4: 'The complete implementation will extract text from the PDF, analyze it with AI, and generate a hierarchical knowledge tree with multiple levels of summaries.'
        },
        position: { x: 0, y: 0 },
        visualWeight: 1.0,
        children: [
          {
            id: 'child1',
            title: 'Section 1',
            contentType: 'conceptual',
            summaries: {
              level1: 'First section',
              level2: 'This is the first section of the document.',
              level3: 'More details will be extracted when AI processing is implemented.',
              level4: 'Full content extraction coming in Phase 5.'
            },
            position: { x: -0.5, y: 0.5 },
            visualWeight: 0.8,
            children: []
          },
          {
            id: 'child2',
            title: 'Section 2',
            contentType: 'procedural',
            summaries: {
              level1: 'Second section',
              level2: 'This is the second section of the document.',
              level3: 'More details will be extracted when AI processing is implemented.',
              level4: 'Full content extraction coming in Phase 5.'
            },
            position: { x: 0.5, y: 0.5 },
            visualWeight: 0.8,
            children: []
          }
        ]
      }
    };

    // Save tree to database
    const tree = await prisma.knowledgeTree.create({
      data: {
        title: file.name.replace('.pdf', ''),
        data: placeholderTree,
        conversationId: conversationId
      }
    });

    // Update conversation status to ready
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'ready' }
    });

    return NextResponse.json({
      success: true,
      treeId: tree.id,
      message: 'PDF uploaded successfully. Full processing coming in Phase 5.'
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Try to update conversation status to error
    try {
      const formData = await request.formData();
      const conversationId = formData.get('conversationId') as string;
      if (conversationId) {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { status: 'error' }
        });
      }
    } catch (e) {
      // Ignore error update failure
    }

    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
}