import React from 'react';
import { Code2, Sparkles, Database, Zap } from 'lucide-react';

export function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 border-r border-white/5 p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-start/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-end/20 blur-[120px]" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-start to-accent-end shadow-lg shadow-accent-start/20">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">CodeDoc AI</span>
        </div>
      </div>

      <div className="relative z-10 mt-auto pb-12">
        <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          Understand any codebase perfectly.
        </h1>
        <p className="text-lg text-slate-400 max-w-md leading-relaxed">
          The ultimate AI pair programmer that ingests entire repositories and answers your questions instantly using RAG.
        </p>

        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Sparkles className="h-5 w-5 text-accent-start" />
            </div>
            <span>Auto-generate comprehensive documentation in seconds</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Database className="h-5 w-5 text-accent-end" />
            </div>
            <span>Secure local embeddings powered by ChromaDB</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <span>Lightning-fast retrieval augmented generation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
