import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { StatusBadge } from './StatusBadge';

export function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col min-w-0 pr-4">
          <p className="text-[10px] text-slate-500 font-mono truncate mb-1">
            {project.repoUrl.replace('https://github.com/', '').replace('http://github.com/', '')}
          </p>
          <h3 className="text-2xl font-black text-[#1a1a1a] truncate">
            {project.name}
          </h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(project.file_extensions || ['.js', '.jsx', '.ts', '.tsx', '.py']).map((ext) => (
           <span key={ext} className="mono-label px-2 py-1 border-[1.5px] border-[#1a1a1a] rounded-full text-[10px] bg-white">
             {ext}
           </span>
        ))}
      </div>

      <div className="pt-4 border-t-2 border-[#1a1a1a]/10 flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span>{project.fileCount || 0} files</span>
          <span className="opacity-50">•</span>
          <span>{project.chunkCount || 0} chunks</span>
        </div>
      </div>
    </Card>
  );
}
