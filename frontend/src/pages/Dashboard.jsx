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
  const { projects, isLoading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Main Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage and explore your documented repositories.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchProjects}
            className="h-10"
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin h-4 w-4" : "h-4 w-4"} />
          </Button>
          <Button size="md" onClick={() => setIsModalOpen(true)} className="h-10">
            <Plus className="mr-2 h-4 w-4" />
            Add Repository
          </Button>
        </div>
      </div>

      {isLoading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      ) : projects.length > 0 ? (
        <ProjectGrid projects={projects} />
      ) : (
        <EmptyState onAdd={() => setIsModalOpen(true)} />
      )}

      <AddRepoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </DashboardLayout>
  );
}
