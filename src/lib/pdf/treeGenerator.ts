// src/lib/pdf/treeGenerator.ts

import { groq, GROQ_CONFIG } from '@/lib/groq';
import { KnowledgeTree, KnowledgeNode, ContentType } from '@/lib/types';
import { ExtractedContent, extractStructureHints } from './extractor';

const SYSTEM_PROMPT = `You are an expert at analyzing educational content and organizing it into hierarchical knowledge trees.

Your task is to analyze the provided text and create a structured knowledge tree with:
1. A root node representing the main topic
2. Child nodes for major concepts/chapters
3. Deeper nodes for sub-concepts where appropriate

For EACH node, provide:
- id: unique identifier (use snake_case, e.g., "intro_to_networks")
- title: clear, concise title
- contentType: one of "conceptual", "procedural", "numerical", "example", or "taxonomic"
- summaries: object with 4 levels of detail
  - level1: 5-10 words (very brief)
  - level2: 20-30 words (one sentence)
  - level3: 50-100 words (paragraph)
  - level4: 150-200 words (detailed explanation)
- children: array of child nodes (can be empty)

Content types explained:
- conceptual: definitions, theories, explanations
- procedural: step-by-step processes, methods
- numerical: formulas, calculations, equations
- example: worked examples, case studies
- taxonomic: classifications, categories, lists

IMPORTANT:
- Create at least 3-5 main child nodes from the root
- Go 2-3 levels deep where content allows
- Extract REAL content from the text, not generic placeholders
- Summaries should contain actual information from the document

Return ONLY valid JSON matching this structure (no markdown, no explanation):
{
  "title": "Main Topic Title",
  "rootNode": {
    "id": "root",
    "title": "Main Topic",
    "contentType": "conceptual",
    "summaries": {
      "level1": "Brief description",
      "level2": "One sentence summary",
      "level3": "Paragraph explanation",
      "level4": "Detailed explanation"
    },
    "children": [...]
  }
}`;

export async function generateTree(
  content: ExtractedContent,
  filename: string
): Promise<KnowledgeTree> {
  // Prepare the content for the AI
  const structureHints = extractStructureHints(content.text);
  
  // Truncate text if too long (Groq has token limits)
  const maxChars = 30000; // ~7500 tokens
  const truncatedText = content.text.slice(0, maxChars);
  const isTruncated = content.text.length > maxChars;

  const userPrompt = `Analyze this educational document and create a knowledge tree:

DOCUMENT INFO:
- Filename: ${filename}
- Pages: ${content.pageCount}
- Title: ${content.title || 'Unknown'}
${isTruncated ? `- Note: Content truncated (showing first ${maxChars} characters of ${content.text.length})` : ''}

DETECTED STRUCTURE (headings/sections found):
${structureHints.length > 0 ? structureHints.join('\n') : 'No clear structure detected'}

DOCUMENT CONTENT:
${truncatedText}

Create a comprehensive knowledge tree with real content from this document. Extract actual concepts, definitions, and explanations - not generic placeholders.`;

  try {
    // Try with primary model
    const response = await callGroq(SYSTEM_PROMPT, userPrompt, GROQ_CONFIG.model);
    return parseTreeResponse(response, filename);
  } catch (error) {
    console.error('Primary model failed, trying fallback:', error);
    
    try {
      // Try with fallback model
      const response = await callGroq(SYSTEM_PROMPT, userPrompt, GROQ_CONFIG.fallbackModel);
      return parseTreeResponse(response, filename);
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError);
      return createFallbackTree(filename, content);
    }
  }
}

async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: GROQ_CONFIG.temperature,
    max_tokens: GROQ_CONFIG.maxTokens,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq');
  }

  return content;
}

function parseTreeResponse(response: string, filename: string): KnowledgeTree {
  // Clean up the response - remove markdown code blocks if present
  let jsonString = response.trim();
  
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3);
  }
  
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3);
  }
  
  jsonString = jsonString.trim();

  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate structure
    if (!parsed.rootNode) {
      throw new Error('Missing rootNode in response');
    }

    // Assign positions to all nodes
    assignPositions(parsed.rootNode);

    // Ensure all nodes have required fields
    validateAndFixNode(parsed.rootNode);

    return {
      id: `tree_${Date.now()}`,
      title: parsed.title || filename.replace('.pdf', ''),
      createdAt: new Date(),
      rootNode: parsed.rootNode,
    };
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Response was:', jsonString.slice(0, 500));
    throw new Error('Failed to parse AI response as JSON');
  }
}

function assignPositions(
  node: KnowledgeNode,
  depth: number = 0,
  angle: number = 0,
  angleRange: number = 2 * Math.PI
): void {
  // Root node at center
  if (depth === 0) {
    node.position = { x: 0, y: 0 };
    node.visualWeight = 1.0;
  }

  const children = node.children || [];
  if (children.length === 0) return;

  const angleStep = angleRange / children.length;
  const radius = 0.6; // Distance from parent

  children.forEach((child, i) => {
    const childAngle = angle - angleRange / 2 + angleStep * (i + 0.5);
    
    child.position = {
      x: Math.cos(childAngle) * radius,
      y: Math.sin(childAngle) * radius,
    };
    
    // Reduce visual weight with depth
    child.visualWeight = Math.max(0.4, 1 - depth * 0.2);

    // Recursively position grandchildren
    assignPositions(child, depth + 1, childAngle, angleStep * 0.8);
  });
}

function validateAndFixNode(node: KnowledgeNode): void {
  // Ensure required fields exist
  if (!node.id) {
    node.id = `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  if (!node.title) {
    node.title = 'Untitled';
  }

  if (!node.contentType || !isValidContentType(node.contentType)) {
    node.contentType = 'conceptual';
  }

  if (!node.summaries) {
    node.summaries = {
      level1: node.title,
      level2: `About ${node.title}`,
      level3: `This section covers ${node.title}.`,
      level4: `Detailed information about ${node.title} will be provided here.`,
    };
  }

  if (!node.position) {
    node.position = { x: 0, y: 0 };
  }

  if (typeof node.visualWeight !== 'number') {
    node.visualWeight = 0.7;
  }

  if (!Array.isArray(node.children)) {
    node.children = [];
  }

  // Recursively validate children
  node.children.forEach(validateAndFixNode);
}

function isValidContentType(type: string): type is ContentType {
  return ['conceptual', 'procedural', 'numerical', 'example', 'taxonomic'].includes(type);
}

function createFallbackTree(filename: string, content: ExtractedContent): KnowledgeTree {
  const title = filename.replace('.pdf', '');
  
  // Try to extract some meaningful sections from the text
  const structureHints = extractStructureHints(content.text);
  
  const children: KnowledgeNode[] = structureHints.slice(0, 5).map((hint, index) => ({
    id: `section_${index + 1}`,
    title: hint.slice(0, 50),
    contentType: 'conceptual' as ContentType,
    summaries: {
      level1: hint.slice(0, 30),
      level2: hint.slice(0, 80),
      level3: `This section covers: ${hint}`,
      level4: `Detailed content for: ${hint}. The full content extraction requires manual review.`,
    },
    position: {
      x: Math.cos((index / 5) * 2 * Math.PI) * 0.6,
      y: Math.sin((index / 5) * 2 * Math.PI) * 0.6,
    },
    visualWeight: 0.7,
    children: [],
  }));

  // If no sections found, create default ones
  if (children.length === 0) {
    children.push({
      id: 'overview',
      title: 'Document Overview',
      contentType: 'conceptual',
      summaries: {
        level1: 'Document summary',
        level2: `Overview of ${title}`,
        level3: `This document contains ${content.pageCount} pages of content about ${title}.`,
        level4: content.text.slice(0, 500),
      },
      position: { x: 0, y: 0.6 },
      visualWeight: 0.8,
      children: [],
    });
  }

  return {
    id: `tree_${Date.now()}`,
    title,
    createdAt: new Date(),
    rootNode: {
      id: 'root',
      title,
      contentType: 'conceptual',
      summaries: {
        level1: `About ${title}`,
        level2: `${title} - ${content.pageCount} pages`,
        level3: `This knowledge tree was generated from "${filename}" containing ${content.pageCount} pages.`,
        level4: `This document "${filename}" has been processed. Due to parsing limitations, a simplified tree structure has been created. The document contains ${content.pageCount} pages of content.`,
      },
      position: { x: 0, y: 0 },
      visualWeight: 1.0,
      children,
    },
  };
}