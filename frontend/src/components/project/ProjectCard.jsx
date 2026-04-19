import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, FileCode2, Layers, Clock, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

export function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group cursor-pointer hover:border-accent-end/30 transition-all hover:shadow-2xl hover:shadow-accent-end/5 relative overflow-hidden"
    >
      {/* Hover gradient effect */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="h-5 w-5 text-accent-end" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:border-accent-end/20 group-hover:bg-accent-end/5 transition-colors">
          <GitBranch className="h-6 w-6 text-slate-300 group-hover:text-accent-end transition-colors" />
        </div>
        <StatusBadge status={project.status} />
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-end transition-colors truncate">
        {project.name}
      </h3>
      
      <p className="text-xs text-slate-500 mb-6 font-mono truncate">
        {project.repoUrl}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <FileCode2 className="h-4 w-4 text-slate-500" />
          <span className="text-sm">{project.fileCount || 0} Files</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="h-4 w-4 text-slate-500" />
          <span className="text-sm">{project.chunkCount || 0} Chunks</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Updated {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 uppercase tracking-wider font-bold">
          {project.language || 'Code'}
        </div>
      </div>
    </Card>
  );
}
