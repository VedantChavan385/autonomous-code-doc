import React, { useState } from 'react';
import { Terminal, GitBranch, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroSection({ onIngest }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onIngest(url);
    }
  };

  return (
    <div className="relative bg-white border-b-2 border-[#1a1a1a] pb-20 pt-10 overflow-hidden">
      {/* Background Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="flex-1 max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#1a1a1a] bg-purple-50 text-[10px] font-black uppercase tracking-widest text-[#1a1a1a] mb-8 shadow-[2px_2px_0_#1a1a1a]">
               <Zap className="h-3.5 w-3.5 fill-purple-500" />
               Retrieval-Augmented Docs
             </div>
             
             <h1 className="text-7xl sm:text-8xl font-black text-[#1a1a1a] leading-[0.9] tracking-tighter mb-8">
               Docs write<br />them<span className="text-slate-400">selves.</span>
             </h1>
             
             <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg">
               Paste a public GitHub URL. We clone, chunk, and embed the code into a vector store, then generate a full documentation overview. Ask anything — answers cite the exact files and lines.
             </p>
             
             <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
               <div className="flex-1 relative">
                 <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                 <input 
                   type="text"
                   value={url}
                   onChange={(e) => setUrl(e.target.value)}
                   placeholder="https://github.com/owner/repo"
                   className="w-full h-14 bg-white border-2 border-[#1a1a1a] rounded-xl pl-12 pr-4 font-bold text-[#1a1a1a] placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-accent-yellow/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                 />
               </div>
               <Button type="submit" size="lg" className="h-14 px-8 bg-accent-yellow text-[#1a1a1a] hover:bg-white border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] hover:shadow-[6px_6px_0_#1a1a1a] transition-all">
                 Ingest Repo <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
             </form>
             
             {/* <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span>Try:</span>
               <button onClick={() => setUrl('https://github.com/tiangolo/fastapi')} className="hover:text-[#1a1a1a] underline underline-offset-4 decoration-2">fastapi</button>
               <button onClick={() => setUrl('https://github.com/expressjs/express')} className="hover:text-[#1a1a1a] underline underline-offset-4 decoration-2">express</button>
             </div> */}
          </div>
          
          {/* Illustration Container */}
          <div className="flex-1 relative hidden lg:block">
            <div className="relative z-10 border-2 border-[#1a1a1a] rounded-[2.5rem] p-4 bg-white shadow-[12px_12px_0_#1a1a1a] rotate-2">
               <div className="rounded-[2rem] overflow-hidden border-2 border-[#1a1a1a] aspect-square flex items-center justify-center bg-slate-50">
                  <img 
                    src="https://static.prod-images.emergentagent.com/jobs/9c671775-2369-4651-bf54-5b96e0fee01b/images/4c360238ddaaa810a762c76b6e67d803a2dd86eb3f1439591aa07c153e53f424.png" 
                    alt="Robot reading" 
                    className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-700" 
                  />
               </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-10 z-20 bg-[#dcfce7] border-2 border-[#1a1a1a] px-4 py-2 rounded-xl flex items-center gap-2 shadow-[4px_4px_0_#1a1a1a] -rotate-3">
              <div className="text-[10px] font-black tracking-tighter text-[#1a1a1a]">
                chunks &rarr; embeddings &rarr; answers
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
