// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { extractPdfContent } from '@/lib/pdf/extractor';
import { generateTree } from '@/lib/pdf/treeGenerator';

export async function POST(request: NextRequest) {
  let conversationId: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File | null;
    conversationId = formData.get('conversationId') as string | null;

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

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    console.log(`Processing PDF: ${file.name} (${file.size} bytes)`);

    // Update conversation status to processing
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: 'processing',
        title: file.name.replace('.pdf', ''),
      },
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 1: Extract text from PDF
    console.log('Extracting PDF content...');
    const extractedContent = await extractPdfContent(buffer);
    console.log(`Extracted ${extractedContent.text.length} characters from ${extractedContent.pageCount} pages`);

    // Step 2: Generate knowledge tree with AI
    console.log('Generating knowledge tree with Groq...');
    const treeData = await generateTree(extractedContent, file.name);
    console.log(`Generated tree with title: ${treeData.title}`);

    // Step 3: Save tree to database
    const tree = await prisma.knowledgeTree.create({
      data: {
        title: treeData.title,
        data: treeData as any,
        conversationId: conversationId,
      },
    });

    // Step 4: Update conversation status to ready
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'ready' },
    });

    console.log(`Successfully created tree: ${tree.id}`);

    return NextResponse.json({
      success: true,
      treeId: tree.id,
      title: treeData.title,
      nodeCount: countNodes(treeData.rootNode),
    });

  } catch (error) {
    console.error('Upload error:', error);

    // Update conversation status to error
    if (conversationId) {
      try {
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { status: 'error' },
        });
      } catch (updateError) {
        console.error('Failed to update conversation status:', updateError);
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: `Failed to process PDF: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Helper function to count nodes in tree
function countNodes(node: any): number {
  let count = 1;
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}