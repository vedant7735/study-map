// src/components/layout/Sidebar.tsx

"use client";

import { Conversation } from '@/lib/types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export function Sidebar({ 
  conversations, 
  activeId, 
  onNewChat, 
  onSelectConversation 
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[#e6e1d6] border-r border-[#c9c4b9] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#c9c4b9]">
        <h1 className="text-lg font-semibold text-[#2d2a26] mb-3">
          Knowledge Tree
        </h1>
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-[#5a7c65] hover:bg-[#4a6955] 
                     text-white rounded-lg transition-colors font-medium"
        >
          + New Chat
        </button>
      </div>
      
      {/* Conversation List */}
      <nav className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-[#9a948c] text-sm p-2">
            No conversations yet
          </p>
        ) : (
          conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`
                w-full p-3 rounded-lg text-left mb-1 transition-colors
                flex items-center gap-2
                ${activeId === conv.id 
                  ? 'bg-[#ddd8cd] text-[#2d2a26]' 
                  : 'text-[#6b6560] hover:bg-[#ddd8cd]/50'
                }
              `}
            >
              <span className="text-lg">
                {conv.treeId ? '🗺️' : '💬'}
              </span>
              <span className="truncate flex-1 text-sm">
                {conv.title}
              </span>
              {conv.status === 'processing' && (
                <span className="text-[#5a7c65]">⏳</span>
              )}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}