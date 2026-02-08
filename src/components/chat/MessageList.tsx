// Create file: src/components/chat/MessageList.tsx

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
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-100'
              }
            `}
          >
            {message.content}
          </div>
        </div>
      ))}
      
      {isProcessing && (
        <div className="flex items-center gap-3 text-gray-400">
          <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          <span>Processing your PDF...</span>
        </div>
      )}
    </div>
  );
}