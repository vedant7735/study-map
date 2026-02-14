// src/lib/pdf/extractor.ts

export interface ExtractedContent {
  text: string;
  pageCount: number;
  title?: string;
  info?: {
    author?: string;
    subject?: string;
    keywords?: string;
  };
}

export async function extractPdfContent(buffer: Buffer): Promise<ExtractedContent> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require('pdf-parse');
    
    const data = await pdf(buffer);

    const cleanedText = cleanText(data.text);

    return {
      text: cleanedText,
      pageCount: data.numpages,
      title: data.info?.Title || undefined,
      info: {
        author: data.info?.Author,
        subject: data.info?.Subject,
        keywords: data.info?.Keywords,
      },
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract PDF content');
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\b\d+\s*\|\s*Page\b/gi, '')
    .replace(/\bPage\s*\d+\b/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractStructureHints(text: string): string[] {
  const hints: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^(Chapter|Section|Part|\d+\.|\d+\))\s+\w+/i.test(trimmed)) {
      hints.push(trimmed.slice(0, 100));
    }

    if (
      trimmed.length > 3 &&
      trimmed.length < 100 &&
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed)
    ) {
      hints.push(trimmed);
    }
  }

  return hints.slice(0, 50);
}