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
    <div className="bg-slate-900/60 backdrop-blur-xl border-t border-white/5 p-6 pb-8">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-start/20 to-accent-end/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
        
        <div className="relative flex items-center gap-2 bg-[#0d0d17] border border-white/10 rounded-2xl p-2 pl-4 shadow-2xl">
          <Sparkles className="h-5 w-5 text-slate-500 shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask anything about the codebase..."
            className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-slate-600 py-3"
          />
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={!input.trim()}
            className="rounded-xl h-11 px-5 shadow-lg shadow-accent-end/10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="mt-3 text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold">
          CodeDoc AI is grounded in your uploaded source files
        </p>
      </form>
    </div>
  );
}
