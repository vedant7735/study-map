// Create file: src/components/layout/Sidebar.tsx

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
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white mb-3">
          Knowledge Tree
        </h1>
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 
                     text-white rounded-lg border border-gray-700
                     transition-colors"
        >
          + New Chat
        </button>
      </div>
      
      {/* Conversation List */}
      <nav className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm p-2">
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
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800/50'
                }
              `}
            >
              <span className="text-lg">
                {conv.treeId ? '🗺️' : '💬'}
              </span>
              <span className="truncate flex-1">
                {conv.title}
              </span>
              {conv.status === 'processing' && (
                <span className="text-yellow-500">⏳</span>
              )}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}