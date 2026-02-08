// Create file: src/components/chat/MessageInput.tsx

"use client";

import { useState, useRef } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, onFileSelect, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  return (
    <div className="border-t border-gray-800 p-4">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex gap-3"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-3 text-gray-400 hover:text-white transition-colors
                     disabled:opacity-50"
        >
          📎
        </button>
        
        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or drop a PDF..."
          disabled={disabled}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg
                     px-4 py-3 text-white placeholder-gray-500
                     focus:outline-none focus:border-blue-500
                     disabled:opacity-50"
        />
        
        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg
                     hover:bg-blue-500 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}