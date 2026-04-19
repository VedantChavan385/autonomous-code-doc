import React, { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Search,
  BookOpen
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function FileTree({ tree = [], onFileSelect, activeFile }) {

  const renderNode = (node, depth = 0) => {
    const isFolder = node.type === 'folder';
    const isActive = activeFile === node.path;

    return (
      <div key={node.name} style={{ paddingLeft: `${depth * 12}px` }}>
        <button 
          onClick={() => !isFolder && onFileSelect(node.path)}
          className={cn(
            "w-full flex items-center gap-2 py-1.5 px-3 rounded-xl text-sm transition-all text-left font-bold border-2 border-transparent",
            isActive ? "bg-accent-yellow border-[#1a1a1a] text-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]" : "text-slate-600 hover:text-[#1a1a1a] hover:bg-slate-100"
          )}
        >
          {isFolder ? <ChevronDown className="h-4 w-4 text-[#1a1a1a]" /> : <div className="w-4" />}
          {isFolder ? <Folder className="h-4 w-4 text-accent-start" /> : <FileCode className="h-4 w-4 text-[#1a1a1a]" />}
          <span className="truncate">{node.name}</span>
        </button>
        {isFolder && node.children && (
          <div className="mt-1">
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a1a1a]" />
        <input 
          type="text" 
          placeholder="Filter files..." 
          className="w-full bg-slate-50 border-2 border-[#1a1a1a] rounded-xl pl-9 pr-3 py-2 text-sm font-medium text-[#1a1a1a] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all"
        />
      </div>
      
      <div className="space-y-1">
        <h4 className="px-3 text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest flex items-center gap-2 mb-4 border-b-2 border-[#1a1a1a]/10 pb-2">
          <BookOpen className="h-4 w-4" />
          Repository Structure
        </h4>
        {tree.map(node => renderNode(node))}
      </div>
    </div>
  );
}
