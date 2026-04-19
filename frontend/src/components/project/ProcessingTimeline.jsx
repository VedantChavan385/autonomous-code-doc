import React from 'react';
import { CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProcessingTimeline({ status }) {
  const steps = [
    { id: 'cloning', label: 'Cloning Repository', targetStatus: ['processing', 'ready', 'failed'] },
    { id: 'parsing', label: 'Parsing Code Files', targetStatus: ['processing', 'ready', 'failed'] },
    { id: 'chunking', label: 'Chunking & Embedding', targetStatus: ['processing', 'ready', 'failed'] },
    { id: 'ready', label: 'Finalizing Project', targetStatus: ['ready'] },
  ];

  // Logic to determine step state based on overall project status
  // Note: For a real app, the backend should send specific sub-status events.
  // For MVP, we simulate progress based on the main status.
  
  const getStepState = (step, projectStatus) => {
    if (projectStatus === 'ready') return 'completed';
    if (projectStatus === 'failed') return 'failed';
    if (projectStatus === 'pending') return 'waiting';
    
    // If 'processing', we show progress
    if (step.id === 'cloning') return 'completed';
    if (step.id === 'parsing') return 'completed';
    if (step.id === 'chunking') return 'active';
    return 'waiting';
  };

  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Ingestion Flow</h4>
      <div className="space-y-6 relative ml-3">
        {/* Connector line */}
        <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-slate-200" />
        
        {steps.map((step, index) => {
          const state = getStepState(step, status);
          
          return (
            <div key={index} className="flex gap-6 relative z-10">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5",
                state === 'completed' ? "bg-accent-yellow border-[#1a1a1a] text-[#1a1a1a]" :
                state === 'active' ? "bg-white border-[#1a1a1a] text-[#1a1a1a] shadow-[1px_1px_0_#1a1a1a]" :
                state === 'failed' ? "bg-error border-[#1a1a1a] text-[#1a1a1a] shadow-[1px_1px_0_#1a1a1a]" : "bg-slate-50 border-slate-300 text-slate-400"
              )}>
                {state === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                 state === 'active' ? <Loader2 className="h-4 w-4 animate-spin" /> :
                 state === 'failed' ? <X className="h-4 w-4" /> : <Circle className="h-2 w-2 fill-current" />}
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-bold",
                  state === 'waiting' ? "text-slate-500 font-medium" : "text-[#1a1a1a]"
                )}>
                  {step.label}
                </span>
                {state === 'active' && (
                  <span className="text-xs font-bold text-accent-start uppercase tracking-widest mt-1 animate-pulse">In progress...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
