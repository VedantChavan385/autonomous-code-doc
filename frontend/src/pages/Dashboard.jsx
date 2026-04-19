import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProjectGrid } from '../components/project/ProjectGrid';
import { EmptyState } from '../components/project/EmptyState';
import { AddRepoModal } from '../components/project/AddRepoModal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useProjectStore } from '../stores/projectStore';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, isLoading, fetchProjects, searchQuery } = useProjectStore();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <DashboardLayout>
      {projects.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight">Main Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and explore your documented repositories.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchProjects}
              className="h-12 bg-white border-2 border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a] hover:bg-slate-50"
              disabled={isLoading}
            >
              <RefreshCw className={isLoading ? "animate-spin h-4 w-4 text-[#1a1a1a]" : "h-4 w-4 text-[#1a1a1a]"} />
            </Button>
            <Button size="md" onClick={() => setIsModalOpen(true)} className="h-12 shadow-[4px_4px_0_#1a1a1a]">
              <Plus className="mr-2 h-4 w-4" />
              Add Repository
            </Button>
          </div>
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      ) : filteredProjects.length > 0 ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <div className="py-8">
          <EmptyState onAdd={() => setIsModalOpen(true)} />
        </div>
      )}

      <AddRepoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
