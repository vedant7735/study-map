// Create file: src/components/chat/WelcomeScreen.tsx

export function WelcomeScreen() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome to Knowledge Tree
        </h2>
        <p className="text-gray-400 mb-8">
          Upload a PDF textbook to transform it into an explorable knowledge map.
        </p>
        
        <div className="flex justify-center gap-6">
          <Feature icon="📚" text="Upload any PDF" />
          <Feature icon="🧠" text="AI extracts concepts" />
          <Feature icon="🗺️" text="Navigate spatially" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl">{icon}</span>
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
}