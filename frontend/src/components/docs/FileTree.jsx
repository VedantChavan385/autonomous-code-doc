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
    const isActive = activeFile === node.name;

    return (
      <div key={node.name} style={{ paddingLeft: `${depth * 12}px` }}>
        <button 
          onClick={() => !isFolder && onFileSelect(node.path)}
          className={cn(
            "w-full flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm transition-all text-left",
            isActive ? "bg-accent-end/10 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          )}
        >
          {isFolder ? <ChevronDown className="h-4 w-4" /> : <div className="w-4" />}
          {isFolder ? <Folder className="h-4 w-4 text-accent-start" /> : <FileCode className="h-4 w-4 text-slate-500" />}
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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
        <input 
          type="text" 
          placeholder="Filter files..." 
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent-end"
        />
      </div>
      
      <div className="space-y-1">
        <h4 className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-2">
          <BookOpen className="h-3 w-3" />
          Repository Structure
        </h4>
        {tree.map(node => renderNode(node))}
      </div>
    </div>
  );
}
