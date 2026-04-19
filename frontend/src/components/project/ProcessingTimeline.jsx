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
      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Ingestion Flow</h4>
      <div className="space-y-6 relative">
        {/* Connector line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/5" />
        
        {steps.map((step, index) => {
          const state = getStepState(step, status);
          
          return (
            <div key={index} className="flex gap-4 relative z-10">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                state === 'completed' ? "bg-success/20 text-success" :
                state === 'active' ? "bg-accent-end/20 text-accent-end" :
                state === 'failed' ? "bg-error/20 text-error" : "bg-white/5 text-slate-600"
              )}>
                {state === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
                 state === 'active' ? <Loader2 className="h-4 w-4 animate-spin" /> :
                 state === 'failed' ? <X className="h-4 w-4" /> : <Circle className="h-2 w-2 fill-current" />}
              </div>
              
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  state === 'waiting' ? "text-slate-500" : "text-white"
                )}>
                  {step.label}
                </span>
                {state === 'active' && (
                  <span className="text-xs text-accent-end/80 mt-1 animate-pulse">In progress...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
