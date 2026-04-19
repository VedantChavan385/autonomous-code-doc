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
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full cursor-pointer group" onClick={onAdd}>
             <div className="flex flex-1 items-center bg-white border-2 border-[#1a1a1a] rounded-xl px-5 h-14 hover:border-[#FFBE0B] transition-colors">
               <FolderGit2 className="h-5 w-5 text-[#1a1a1a] mr-2.5" />
               <input 
                 type="text" 
                 placeholder="https://github.com/expressjs/express"
                 className="flex-1 bg-transparent border-none outline-none text-[#1a1a1a] text-base font-mono font-medium placeholder:text-slate-600 pointer-events-none"
                 readOnly
               />
             </div>
             <Button className="rounded-xl px-8 h-14 bg-[#FFB800] border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#E5A600] font-black text-base shadow-[5px_5px_0_#1a1a1a] group-hover:translate-y-[2px] group-hover:translate-x-[2px] group-hover:shadow-[3px_3px_0_#1a1a1a] transition-all shrink-0">
               Ingest Repo <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
           </div>
           
           {/* <p className="mt-6 text-[10px] sm:text-xs font-mono text-slate-500 font-bold px-2">
             try: <span className="underline decoration-slate-300 decoration-2 underline-offset-4 font-black">https://github.com/tiangolo/fastapi</span> <span className="underline decoration-slate-300 decoration-2 underline-offset-4 ml-3 font-black">https://github.com/expressjs/express</span>
           </p> */}
        </div>
      </div>

      {/* Right Content - Abstract Illustration mimicking screenshot frame */}
      <div className="hidden xl:flex flex-1 relative justify-end items-center max-w-xl">
        <div className="relative w-[500px] h-[550px] rotate-2 z-0">
          <div className="w-full h-full bg-white border-[3px] border-[#1a1a1a] rounded-3xl shadow-[8px_8px_0_#1a1a1a] absolute inset-0 overflow-hidden">
             <img 
               src="https://static.prod-images.emergentagent.com/jobs/9c671775-2369-4651-bf54-5b96e0fee01b/images/4c360238ddaaa810a762c76b6e67d803a2dd86eb3f1439591aa07c153e53f424.png" 
               alt="Robot reading documentation" 
               className="w-full h-full object-cover"
               draggable={false}
             />
          </div>

           {/* Floating badges */}
           <div className="absolute -bottom-5 -left-8 bg-[#c6e6c3] border-[3px] border-[#1a1a1a] px-5 py-2.5 font-mono text-sm font-black text-[#1a1a1a] rounded-[1rem] shadow-[4px_4px_0_#1a1a1a] -rotate-2 z-20 whitespace-nowrap overflow-visible">
             chunks → embeddings → answers
           </div>
        </div>
      </div>
    </div>
  );
}
