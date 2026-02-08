// src/components/chat/WelcomeScreen.tsx

export function WelcomeScreen() {
  return (
    <div className="h-full flex items-center justify-center bg-[#f0ebe0]">
      <div className="text-center max-w-lg px-6">
        {/* Logo/Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#5a7c65] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl">🌳</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#2d2a26] mb-3">
          Welcome to Knowledge Tree
        </h2>
        
        {/* Subtitle */}
        <p className="text-[#6b6560] mb-10 text-lg">
          Transform any PDF into an explorable knowledge map
        </p>
        
        {/* Features */}
        <div className="flex justify-center gap-8 mb-10">
          <Feature 
            icon="📚" 
            title="Upload" 
            description="Drop any PDF" 
          />
          <Feature 
            icon="🧠" 
            title="Analyze" 
            description="AI extracts concepts" 
          />
          <Feature 
            icon="🗺️" 
            title="Explore" 
            description="Navigate visually" 
          />
        </div>

        {/* Instructions */}
        <div className="bg-[#e6e1d6] border border-[#c9c4b9] rounded-xl p-6">
          <p className="text-[#6b6560] text-sm mb-3">
            Get started by:
          </p>
          <div className="space-y-2">
            <Step number={1} text="Click '+ New Chat' in the sidebar" />
            <Step number={2} text="Drag & drop a PDF or click 📎 to upload" />
            <Step number={3} text="Wait for AI to process your document" />
            <Step number={4} text="Explore your knowledge tree!" />
          </div>
        </div>

        {/* Supported formats */}
        <p className="text-[#9a948c] text-xs mt-6">
          Supports PDF files up to 50MB
        </p>
      </div>
    </div>
  );
}

function Feature({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-14 h-14 bg-[#e6e1d6] border border-[#c9c4b9] rounded-xl flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-[#2d2a26] font-medium text-sm">{title}</span>
      <span className="text-[#9a948c] text-xs">{description}</span>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="w-6 h-6 bg-[#5a7c65] text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
        {number}
      </div>
      <span className="text-[#2d2a26] text-sm">{text}</span>
    </div>
  );
}