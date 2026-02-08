// Create file: src/components/layout/AppShell.tsx

"use client";

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MainView } from './MainView';
import { Conversation } from '@/lib/types';

export function AppShell() {
  // Track which view we're on
  const [currentView, setCurrentView] = useState<'chat' | 'canvas'>('chat');
  
  // Track conversations (will come from database later)
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Track active conversation
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      createdAt: new Date(),
      status: 'chatting'
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
    setCurrentView('chat');
  };
  
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find(c => c.id === id);
    // If conversation has a tree, show canvas view
    if (conv?.treeId) {
      setCurrentView('canvas');
    } else {
      setCurrentView('chat');
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar 
        conversations={conversations}
        activeId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <MainView 
        view={currentView}
        conversationId={activeConversationId}
      />
    </div>
  );
}