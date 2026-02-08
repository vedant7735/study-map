// src/components/layout/MainView.tsx

"use client";

import { useState, useEffect } from 'react';
import { ChatView } from '../chat/ChatView';
import { CanvasView } from '../canvas/CanvasView';
import { KnowledgeTree } from '@/lib/types';
import { fetchConversation } from '@/lib/api';

interface MainViewProps {
  view: 'chat' | 'canvas';
  conversationId: string | null;
  onTreeReady: () => void;
}

export function MainView({ view, conversationId, onTreeReady }: MainViewProps) {
  const [tree, setTree] = useState<KnowledgeTree | null>(null);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  useEffect(() => {
    if (view === 'canvas' && conversationId) {
      loadTree();
    }
  }, [view, conversationId]);

  const loadTree = async () => {
    if (!conversationId) return;

    setIsLoadingTree(true);
    try {
      const conversation = await fetchConversation(conversationId);
      if (conversation.tree) {
        setTree(conversation.tree.data);
      }
    } catch (error) {
      console.error('Failed to load tree:', error);
    } finally {
      setIsLoadingTree(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {view === 'chat' ? (
        <ChatView
          conversationId={conversationId}
          onTreeReady={() => {
            onTreeReady();
            loadTree();
          }}
        />
      ) : (
        isLoadingTree ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading knowledge tree...</p>
            </div>
          </div>
        ) : (
          <CanvasView tree={tree} />
        )
      )}
    </main>
  );
}