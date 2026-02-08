// src/components/chat/ChatView.tsx

"use client";

import { useState, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/lib/types';
import { fetchConversation, sendMessage, uploadPDF } from '@/lib/api';

interface ChatViewProps {
  conversationId: string | null;
  onTreeReady?: () => void;
}

export function ChatView({ conversationId, onTreeReady }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const conversation = await fetchConversation(conversationId);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) {
      alert('Please start a new chat first');
      return;
    }

    // Add user message immediately for responsiveness
    const tempUserMessage: Message = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Save user message to database
      const savedMessage = await sendMessage(conversationId, content, 'user');
      
      // Replace temp message with saved message
      setMessages(prev => 
        prev.map(m => m.id === tempUserMessage.id ? savedMessage : m)
      );

      // For now, add a simple echo response
      // In Phase 5, this will be replaced with AI response
      const assistantResponse = await sendMessage(
        conversationId,
        `I received your message: "${content}". AI responses will be implemented in Phase 5.`,
        'assistant'
      );
      
      setMessages(prev => [...prev, assistantResponse]);

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!conversationId) {
      alert('Please start a new chat first');
      return;
    }

    setIsProcessing(true);

    // Add a message about the upload
    const uploadMessage: Message = {
      id: `upload_${Date.now()}`,
      role: 'user',
      content: `📄 Uploading: ${file.name}`,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, uploadMessage]);

    try {
      const result = await uploadPDF(conversationId, file);

      // Add success message
      const successMessage: Message = {
        id: `success_${Date.now()}`,
        role: 'assistant',
        content: `✅ Successfully processed "${file.name}"! Click on this conversation in the sidebar to explore the knowledge tree.`,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, successMessage]);

      // Notify parent that tree is ready
      onTreeReady?.();

    } catch (error) {
      console.error('Upload error:', error);
      
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: '❌ Sorry, there was an error processing your PDF. Please try again.',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(f => f.type === 'application/pdf');

    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // No conversation selected
  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col bg-[#f0ebe0]">
        <div className="flex-1 overflow-y-auto">
          <WelcomeScreen />
        </div>
        <MessageInput
          onSend={handleSendMessage}
          onFileSelect={handleFileUpload}
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        flex-1 flex flex-col bg-[#f0ebe0]
        ${isDragging ? 'bg-[#e8f0ea] border-2 border-dashed border-[#5a7c65]' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#e8f0ea]/80 z-10 pointer-events-none">
          <div className="text-center">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-[#5a7c65] font-medium text-lg">Drop your PDF here</p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-6 w-6 border-2 border-[#5a7c65] border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-[#6b6560]">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 && !isProcessing ? (
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