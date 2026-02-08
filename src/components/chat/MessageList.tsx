// src/components/chat/MessageList.tsx

import { Message } from '@/lib/types';

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
}

export function MessageList({ messages, isProcessing }: MessageListProps) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
        >
          <div
            className={`
              inline-block max-w-[80%] p-4 rounded-lg
              ${message.role === 'user'
                ? 'bg-[#5a7c65] text-white'
                : 'bg-[#e6e1d6] text-[#2d2a26] border border-[#c9c4b9]'
              }
            `}
          >
            {message.content}
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-center gap-3 text-[#6b6560]">
          <div className="animate-spin h-5 w-5 border-2 border-[#5a7c65] border-t-transparent rounded-full" />
          <span>Processing your PDF...</span>
        </div>
      )}
    </div>
  );
}