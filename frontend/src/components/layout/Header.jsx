import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="relative w-96 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full bg-white/5 border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-end transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-[1px] bg-white/5 mx-1" />
          <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/5 transition-colors group">
            <div className="h-8 w-8 rounded-full bg-accent-start/20 flex items-center justify-center border border-accent-start/30">
              <User className="h-4 w-4 text-accent-start" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
