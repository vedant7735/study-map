// src/components/canvas/CanvasView.tsx

"use client";

import { KnowledgeTree } from '@/lib/types';

interface CanvasViewProps {
  tree: KnowledgeTree | null;
}

export function CanvasView({ tree }: CanvasViewProps) {
  if (!tree) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f0ebe0]">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-xl font-semibold text-[#2d2a26] mb-2">
            No Knowledge Tree
          </h2>
          <p className="text-[#6b6560]">
            Upload a PDF to generate a knowledge tree
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[#f0ebe0]">
      <div className="text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold text-[#2d2a26] mb-2">
          {tree.title}
        </h2>
        <p className="text-[#6b6560] mb-4">
          Knowledge tree loaded successfully!
        </p>
        <p className="text-[#9a948c] text-sm">
          Canvas visualization will be implemented in Phase 6
        </p>
        
        {/* Show tree structure for debugging */}
        <div className="mt-6 p-4 bg-[#e6e1d6] border border-[#c9c4b9] rounded-lg text-left max-w-md mx-auto">
          <p className="text-[#6b6560] text-xs mb-2">Tree Structure:</p>
          <p className="text-[#2d2a26] text-sm font-medium">
            📁 {tree.rootNode?.title || 'Root'}
          </p>
          {tree.rootNode?.children?.map((child, index) => (
            <p key={index} className="text-[#6b6560] text-sm ml-4">
              └─ 📄 {child.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}