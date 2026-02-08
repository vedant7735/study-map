// Create file: src/components/layout/MainView.tsx

"use client";

import { ChatView } from '../chat/ChatView';
import { CanvasView } from '../canvas/CanvasView';

interface MainViewProps {
  view: 'chat' | 'canvas';
  conversationId: string | null;
}

export function MainView({ view, conversationId }: MainViewProps) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {view === 'chat' ? (
        <ChatView conversationId={conversationId} />
      ) : (
        <CanvasView conversationId={conversationId} />
      )}
    </main>
  );
}