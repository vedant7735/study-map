// src/components/layout/AppShell.tsx

"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MainView } from './MainView';
import { Conversation } from '@/lib/types';
import { fetchConversations, createConversation } from '@/lib/api';

export function AppShell() {
  const [currentView, setCurrentView] = useState<'chat' | 'canvas'>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setError(null);
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      setError(null);
      const newConversation = await createConversation();
      setConversations([newConversation, ...conversations]);
      setActiveConversationId(newConversation.id);
      setCurrentView('chat');
    } catch (err) {
      console.error('Failed to create conversation:', err);
      setError('Failed to create conversation');
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv?.treeId) {
      setCurrentView('canvas');
    } else {
      setCurrentView('chat');
    }
  };

  const handleTreeReady = () => {
    loadConversations();
    setCurrentView('canvas');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f0ebe0]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-[#5a7c65] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[#6b6560]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f0ebe0]">
      {error && (
        <div className="absolute top-4 right-4 bg-[#f8e8e8] border border-[#c45c5c] text-[#c45c5c] px-4 py-2 rounded-lg z-50">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 hover:opacity-70"
          >
            ✕
          </button>
        </div>
      )}
      
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
      <MainView
        view={currentView}
        conversationId={activeConversationId}
        onTreeReady={handleTreeReady}
      />
    </div>
  );
}