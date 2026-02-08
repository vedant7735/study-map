// src/components/chat/MessageInput.tsx

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
    <div className="border-t border-[#c9c4b9] p-4 bg-[#f0ebe0]">
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
          className="p-3 text-[#6b6560] hover:text-[#2d2a26] transition-colors
                     disabled:opacity-50 hover:bg-[#e6e1d6] rounded-lg"
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
          className="flex-1 bg-white border border-[#c9c4b9] rounded-lg
                     px-4 py-3 text-[#2d2a26] placeholder-[#9a948c]
                     focus:outline-none focus:border-[#5a7c65] focus:ring-1 focus:ring-[#5a7c65]
                     disabled:opacity-50"
        />
        
        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-6 py-3 bg-[#5a7c65] text-white rounded-lg
                     hover:bg-[#4a6955] transition-colors font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}