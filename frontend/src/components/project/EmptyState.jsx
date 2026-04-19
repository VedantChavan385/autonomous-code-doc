import React from 'react';
import { Zap, FolderGit2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({ onAdd }) {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-16 py-4 px-4 sm:px-8">
      {/* Left Content */}
      <div className="flex-1 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cool border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] mb-8 font-black text-[10px] sm:text-xs tracking-widest uppercase">
          <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
          Retrieval-Augmented Docs
        </div>
        
        <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-[#1a1a1a] leading-[1.05] tracking-tight mb-8">
          Docs write<br/>themselves.
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-700 font-medium mb-12 leading-relaxed max-w-lg">
          Paste a public GitHub URL. We clone, chunk, and embed the code into a vector store, then generate a full documentation overview. Ask anything — answers cite the exact files and lines.
        </p>

        <div className="relative group w-full xl:-mr-20 z-10">
           {/* Form wrapper dummy */}
           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white border-[3px] border-[#1a1a1a] rounded-[2rem] p-2 pl-6 shadow-[8px_8px_0_#1a1a1a] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[6px_6px_0_#1a1a1a] transition-all cursor-text" onClick={onAdd}>
             <FolderGit2 className="h-6 w-6 text-[#1a1a1a] shrink-0" />
             <input 
               type="text" 
               placeholder="https://github.com/owner/repo"
               className="flex-1 bg-transparent border-none outline-none text-[#1a1a1a] text-lg sm:text-lg font-mono font-medium placeholder:text-slate-400 py-4 w-full pointer-events-none"
               readOnly
             />
             <Button size="lg" className="rounded-xl px-8 h-[3.5rem] bg-accent-yellow border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-accent-yellow/80 hover:text-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a]" onClick={onAdd}>
               Ingest Repo <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
           </div>
           
           <p className="mt-6 text-[10px] sm:text-xs font-mono text-slate-500 font-bold px-2">
             try: <span className="underline decoration-slate-300 decoration-2 underline-offset-4 font-black">https://github.com/tiangolo/fastapi</span> <span className="underline decoration-slate-300 decoration-2 underline-offset-4 ml-3 font-black">https://github.com/expressjs/express</span>
           </p>
        </div>
      </div>

      {/* Right Content - Abstract Illustration mimicking screenshot frame */}
      <div className="hidden xl:flex flex-1 relative justify-end items-center max-w-xl">
        <div className="w-[500px] h-[550px] bg-white border-4 border-[#1a1a1a] rounded-[2rem] rotate-2 shadow-[12px_12px_0_#1a1a1a] relative flex items-center justify-center p-8 overflow-hidden z-0 bg-slate-50">
           {/* Background gradient from the screenshot */}
           <div className="absolute inset-0 bg-gradient-to-br from-accent-yellow/40 via-white to-transparent opacity-80" />
           
           {/* Abstract illustration elements */}
           <div className="absolute top-20 right-20 w-32 h-32 bg-accent-start border-4 border-[#1a1a1a] rounded-[2rem] shadow-[6px_6px_0_#1a1a1a] rotate-12 flex items-center justify-center">
             <div className="w-16 h-16 bg-white rounded-full border-4 border-[#1a1a1a] animate-pulse" />
           </div>
           
           <div className="absolute bottom-32 left-12 w-48 h-64 bg-accent-cool border-4 border-[#1a1a1a] rounded-xl shadow-[8px_8px_0_#1a1a1a] -rotate-6 p-4 flex flex-col gap-3">
             <div className="h-4 w-3/4 bg-white border-2 border-[#1a1a1a] rounded-full" />
             <div className="h-4 w-1/2 bg-white border-2 border-[#1a1a1a] rounded-full" />
             <div className="h-4 w-full bg-white border-2 border-[#1a1a1a] rounded-full" />
             <div className="mt-auto h-20 w-full bg-white border-2 border-[#1a1a1a] rounded-lg" />
           </div>

           <div className="absolute bottom-20 right-16 w-40 h-24 bg-white border-4 border-[#1a1a1a] rounded-full shadow-[6px_6px_0_#1a1a1a] rotate-[15deg] flex items-center justify-center">
            <Zap className="h-10 w-10 text-accent-yellow fill-accent-yellow" />
           </div>

           {/* Floating badges */}
           <div className="absolute bottom-6 left-12 bg-accent-start border-[3px] border-[#1a1a1a] px-4 py-2 font-mono text-xs font-black text-[#1a1a1a] rounded-xl shadow-[4px_4px_0_#1a1a1a] -rotate-2 z-10 whitespace-nowrap">
             chunks → embeddings → answers
           </div>
           
           <div className="absolute bottom-6 -right-6 bg-[#1a1a1a] border-y-[3px] border-l-[3px] border-[#1a1a1a] px-5 py-2.5 font-bold text-xs text-white rounded-l-full shadow-[4px_4px_0_rgba(0,0,0,0.1)] z-10 flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center"><div className="w-1 h-1 bg-[#1a1a1a] rounded-full" /></div> Made with Emergent
           </div>
        </div>
      </div>
    </div>
  );
}
