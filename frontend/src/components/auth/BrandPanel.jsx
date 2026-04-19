import React from 'react';
import { Code2, Sparkles, Database, Zap } from 'lucide-react';

export function BrandPanel() {
  return (
    <div className="w-full hidden lg:flex flex-col justify-between bg-[var(--color-bg-primary)] p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-yellow/20 blur-[100px]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-cool/40 blur-[100px]" />
      
      <div className="relative z-10 mt-8">
        <div className="flex items-center gap-4 mb-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-yellow border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]">
            <Code2 className="h-6 w-6 text-[#1a1a1a]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#1a1a1a] tracking-tight leading-none">codebase.docs</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Docs / Write / Themselves</span>
          </div>
        </div>

        <h1 className="text-6xl font-black text-[#1a1a1a] leading-[1.1] tracking-tight mb-8">
          Code Docs write themselves.
        </h1>
        <p className="text-xl text-slate-600 max-w-md leading-relaxed font-medium">
          Paste a GitHub URL. We clone, chunk, and embed the code into a vector store, then generate full documentation.
        </p>

        <div className="mt-16 space-y-6 max-w-sm">
          <div className="editorial-card p-4 flex items-center gap-4 bg-white/80 backdrop-blur">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1a1a1a] bg-accent-start">
              <Sparkles className="h-5 w-5 text-[#1a1a1a]" />
            </div>
            <span className="font-bold text-[#1a1a1a]">Auto-generated structure</span>
          </div>
          <div className="editorial-card p-4 flex items-center gap-4 bg-white/80 backdrop-blur ml-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1a1a1a] bg-accent-cool">
              <Database className="h-5 w-5 text-[#1a1a1a]" />
            </div>
            <span className="font-bold text-[#1a1a1a]">Vector-based RAG chat</span>
          </div>
          <div className="editorial-card p-4 flex items-center gap-4 bg-white/80 backdrop-blur">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1a1a1a] bg-accent-yellow">
              <Zap className="h-5 w-5 text-[#1a1a1a]" />
            </div>
            <span className="font-bold text-[#1a1a1a]">Line-level citations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
