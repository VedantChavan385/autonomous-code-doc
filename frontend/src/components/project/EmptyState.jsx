import React from 'react';
import { FolderPlus, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
      <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-white/5 mb-6">
        <FolderPlus className="h-10 w-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No projects yet</h3>
      <p className="text-slate-400 text-center max-w-sm mb-8 leading-relaxed">
        Upload your first GitHub repository to start generating AI documentation and chatting with your codebase.
      </p>
      <Button onClick={onAdd} size="lg" className="px-10">
        <Plus className="mr-2 h-5 w-5" />
        Add Your First Project
      </Button>
    </div>
  );
}
