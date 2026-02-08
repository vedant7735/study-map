// src/lib/types.ts

export type ContentType = 
  | 'conceptual' 
  | 'procedural' 
  | 'numerical' 
  | 'taxonomic' 
  | 'example';

export interface KnowledgeNode {
  id: string;
  title: string;
  contentType: ContentType;
  summaries: {
    level1: string;
    level2: string;
    level3: string;
    level4?: string;
  };
  position: {
    x: number;
    y: number;
  };
  visualWeight: number;
  children: KnowledgeNode[];
}

export interface KnowledgeTree {
  id: string;
  title: string;
  createdAt: Date | string;
  rootNode: KnowledgeNode;
}

export interface Conversation {
  id: string;
  title: string;
  status: 'chatting' | 'processing' | 'ready' | 'error';
  createdAt: Date | string;
  updatedAt?: Date | string;
  treeId?: string | null;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date | string;
}