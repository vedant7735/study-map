// Create file: src/components/canvas/CanvasView.tsx

"use client";

interface CanvasViewProps {
  conversationId: string | null;
}

export function CanvasView({ conversationId }: CanvasViewProps) {
  // Placeholder - we'll build the real canvas later
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Knowledge Canvas
        </h2>
        <p className="text-gray-400">
          Canvas visualization will be implemented in Phase 5
        </p>
      </div>
    </div>
  );
}