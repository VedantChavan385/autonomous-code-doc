import React from 'react';
import { Card } from '../ui/Card';
import { Share2, Brain, MessageSquareQuote } from 'lucide-react';

export function FeaturesSection() {
  return (
    <div className="py-16 border-b-2 border-[#1a1a1a]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Box 1: Smart Chunking (1/3 width) */}
        <div className="md:col-span-1 p-8 border-2 border-[#1a1a1a] rounded-3xl bg-white shadow-[8px_8px_0_#1a1a1a] flex flex-col items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center border-2 border-[#1a1a1a] bg-white">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">Smart chunking</h3>
            <p className="text-slate-600 font-bold text-sm leading-relaxed">
              Walks your repo and splits source files into overlapping chunks, skipping dependencies and build artifacts.
            </p>
          </div>
        </div>

        {/* Box 2: Vector Retrieval (2/3 width) */}
        <div className="md:col-span-2 p-8 border-2 border-[#1a1a1a] rounded-3xl bg-purple-100 shadow-[8px_8px_0_#1a1a1a] flex flex-col items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center border-2 border-[#1a1a1a] bg-white text-purple-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">Vector retrieval</h3>
            <p className="text-slate-600 font-bold text-sm leading-relaxed">
              Embeds chunks into a persistent ChromaDB collection. When you ask a question, only the top-k relevant snippets are sent to the LLM.
            </p>
          </div>
        </div>

        {/* Box 3: Chat with Citations (2/3 width) */}
        <div className="md:col-span-2 p-8 border-2 border-[#1a1a1a] rounded-3xl bg-[#ffd4b3] shadow-[8px_8px_0_#1a1a1a] flex flex-col items-start gap-6 hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center border-2 border-[#1a1a1a] bg-white text-[#f97316]">
            <MessageSquareQuote className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#1a1a1a] mb-2">Chat with citations</h3>
            <p className="text-slate-600 font-bold text-sm leading-relaxed">
              Every answer from your LLM is grounded in retrieved code with clickable file + line citations.
            </p>
          </div>
        </div>

        {/* Box 4: Visual Illustration (1/3 width) */}
        <div className="md:col-span-1 p-0 border-2 border-[#1a1a1a] rounded-3xl bg-white shadow-[8px_8px_0_#1a1a1a] overflow-hidden flex items-center justify-center hover:-translate-y-1 transition-transform">
            <img 
              src="https://static.prod-images.emergentagent.com/jobs/9c671775-2369-4651-bf54-5b96e0fee01b/images/29bebfff09a958c9c0deff65c517f845d86e0ad7cd0100e18fe354308a5f4fb8.png" 
              alt="Collaboration" 
              className="w-full h-full object-contain p-6" 
            />
        </div>
      </div>
    </div>
  );
}
