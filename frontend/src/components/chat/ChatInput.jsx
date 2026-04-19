import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)]/90 backdrop-blur-xl border-t-2 border-[#1a1a1a] p-4 sm:p-6 pb-8">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative group"
      >
        <div className="relative flex items-center gap-3 bg-white border-2 border-[#1a1a1a] rounded-2xl p-2 pl-5 shadow-[4px_4px_0_#1a1a1a] focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0_#1a1a1a] transition-all">
          <Sparkles className="h-6 w-6 text-accent-start shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask anything about the codebase..."
            className="flex-1 bg-transparent border-none text-[#1a1a1a] text-lg font-medium outline-none placeholder:text-slate-400 py-3"
          />
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={!input.trim()}
            className="rounded-xl h-12 px-6"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
          CodeDoc AI is grounded in your uploaded source files
        </p>
      </form>
    </div>
  );
}
