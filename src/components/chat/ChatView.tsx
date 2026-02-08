// Create file: src/components/chat/ChatView.tsx

"use client";

import { useState, useRef } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/lib/types';

interface ChatViewProps {
  conversationId: string | null;
}

export function ChatView({ conversationId }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // TODO: Send to AI and get response
    // For now, just echo back
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: ${content}`,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  
  const handleFileUpload = async (file: File) => {
    console.log('Uploading file:', file.name);
    setIsProcessing(true);
    
    // TODO: Upload to server and process
    // For now, just simulate
    setTimeout(() => {
      setIsProcessing(false);
      alert('File processing will be implemented with backend!');
    }, 2000);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(f => f.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    }
  };
  
  return (
    <div 
      className={`
        flex-1 flex flex-col
        ${isDragging ? 'bg-blue-500/10 border-2 border-dashed border-blue-500' : ''}
      `}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !isProcessing ? (
          <WelcomeScreen />
        ) : (
          <MessageList messages={messages} isProcessing={isProcessing} />
        )}
      </div>
      
      {/* Input Area */}
      <MessageInput 
        onSend={handleSendMessage}
        onFileSelect={handleFileUpload}
        disabled={isProcessing}
      />
    </div>
  );
}